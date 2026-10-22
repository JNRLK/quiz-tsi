/* education-tsi.fr — Service Worker.
   Version COURANTE = valeur de const CACHE ci-dessous : l'incrémenter à CHAQUE déploiement.
   Ce fichier ne contient que du code. Les notes de version vont dans le message de commit.
   L'historique jusqu'à la v380 est dans « Documentation/historique-versions-sw.md », hors dépôt :
   il pesait 345 Ko et chaque élève le retéléchargeait à chaque vérification de mise à jour.

   Stratégies :
   - page et fichiers locaux : cache d'abord + mise à jour en arrière-plan (stale-while-revalidate).
     La page s'ouvre instantanément depuis le cache, même sur un réseau lent ; la copie est rafraîchie
     dans la foulée. Une NOUVELLE VERSION ne passe pas par là : chaque déploiement change CACHE, donc
     sw.js, donc le navigateur installe un nouveau SW qui pré-cache la page fraîche (install), et la
     page recharge au premier moment sûr (appliquerMaj, dans index.html) ;
   - CDN (MathJax, polices) : cache-first (gros fichiers externes qui ne changent pas) ;
   - images img/… : cache-first dans un cache À PART, « quiz-tsi-img », que l'activation ne vide pas.
     Leur nom contient l'empreinte du contenu, donc elles sont immuables : un déploiement ne les fait
     pas retélécharger. La page les précharge au repos (prechargerImages) pour le hors-ligne.
   - Firebase / Google : jamais en cache. */
const CACHE = 'quiz-tsi-v395';
const IMG_CACHE = 'quiz-tsi-img';

const CORE = [
  './',
  './index.html',
  './manifest.json'
];

// Installation : pré-cache le cœur de l'app
self.addEventListener('install', (e) => {
  e.waitUntil(
    // cache:'reload' : contourne le cache HTTP (max-age 600 s de GitHub Pages), sinon le nouveau SW
    // pourrait pré-cacher l'ancienne page.
    caches.open(CACHE).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' })))).catch(() => {})
  );
  self.skipWaiting();
});

// Activation : nettoie les anciens caches (sauf le cache images, partagé entre versions)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== IMG_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ne jamais mettre en cache Firebase (auth + Firestore en temps réel)
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.pathname.includes('/recaptcha/') ||   // v313 : reCAPTCHA (App Check) toujours du réseau, jamais du cache
      (!url.hostname.includes('gstatic') && url.hostname.includes('google'))) {
    return; // laisse passer vers le réseau normalement
  }

  // Images locales img/… : cache-first dans le cache images persistant (noms à empreinte = immuables)
  if (url.origin === self.location.origin && url.pathname.includes('/img/')) {
    e.respondWith(
      caches.open(IMG_CACHE).then((c) =>
        c.match(req).then((hit) =>
          hit || fetch(req).then((res) => {
            if (res.ok) c.put(req, res.clone()).catch(() => {});
            return res;
          })
        )
      )
    );
    return;
  }

  // CDN (MathJax, polices) : cache-first (gros, immuables)
  if (url.hostname.includes('cdnjs') ||
      url.hostname.includes('gstatic') ||
      url.hostname.includes('fonts.googleapis') ||
      url.hostname.includes('jsdelivr')) {
    e.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        }).catch(() => hit)
      )
    );
    return;
  }

  // Page et ressources locales : cache d'abord, rafraîchi en arrière-plan ; sans cache, réseau,
  // et hors ligne sans cache, repli sur la page.
  const reseau = fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      return caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}).then(() => res);
    }
    return res;
  });
  e.waitUntil(reseau.catch(() => {}));
  e.respondWith(
    // Recherche limitée au cache de CETTE version : caches.match() seul fouillerait aussi les
    // caches d'une version précédente et pourrait resservir l'ancienne page.
    caches.open(CACHE).then((c) => c.match(req)).then((hit) =>
      hit || reseau.catch(() => caches.open(CACHE).then((c) => c.match('./index.html')))
    )
  );
});

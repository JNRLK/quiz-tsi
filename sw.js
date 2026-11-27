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
   - CDN (SDK Firebase, MathJax, polices) : cache-first dans un cache À PART, « quiz-tsi-cdn », que
     l'activation ne vide pas (hors-ligne 27/11) : leurs URL portent leur version, ils sont immuables ;
   - images img/… : cache-first dans un cache À PART, « quiz-tsi-img », que l'activation ne vide pas.
     Leur nom contient l'empreinte du contenu, donc elles sont immuables : un déploiement ne les fait
     pas retélécharger. La page les précharge au repos (prechargerImages) pour le hors-ligne.
   - Firebase / Google : jamais en cache. */
const CACHE = 'quiz-tsi-v483';
const IMG_CACHE = 'quiz-tsi-img';
const CDN_CACHE = 'quiz-tsi-cdn';

/* hors-ligne 27/11 : la page n'est pré-cachée qu'UNE fois (avant : './' ET './index.html', soit deux fois
   2,4 Mo à chaque déploiement) ; toute navigation est servie par cette copie. */
const CORE = [
  './index.html',
  './manifest.json'
];

/* hors-ligne 27/11 : fichiers CDN pré-cachés au mieux à l'installation (sans jamais la faire échouer).
   À GARDER ALIGNÉ sur index.html (imports Firebase du module, balise MathJax, lien des polices) : un oubli ne
   casse rien, il retire seulement ce fichier du hors-ligne tant qu'il n'a pas été demandé une fois en ligne.
   - les 4 modules du SDK importés par la page (auth, firestore et app-check n'importent que firebase-app.js) ;
   - MathJax, son extension chargée à la demande par \boldsymbol (seule commande de l'autoload utilisée) et
     les polices CHTML dont la banque se sert (Fraktur, SansSerif, Script : aucune occurrence) ;
   - la feuille Google Fonts (ses .woff2 dépendent du navigateur : mis en cache à la première demande). */
const MJ = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/';
const CDN_PRE = [
  'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/12.14.0/firebase-app-check.js',
  'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js',
  MJ + 'tex-mml-chtml.min.js',
  MJ + 'input/tex/extensions/boldsymbol.js',
  ...['Zero', 'Main-Regular', 'Main-Bold', 'Main-Italic', 'Math-Italic', 'Math-BoldItalic', 'AMS-Regular',
    'Calligraphic-Regular', 'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular',
    'Vector-Regular', 'Vector-Bold', 'Typewriter-Regular'].map((f) => MJ + 'output/chtml/fonts/woff-v2/MathJax_' + f + '.woff'),
  'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,500;0,7..72,600;0,7..72,700;1,7..72,500;1,7..72,600&family=Lexend:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap'
];
const estCdn = (u) => u.hostname.includes('cdnjs') || u.hostname.includes('gstatic') ||
  u.hostname.includes('fonts.googleapis') || u.hostname.includes('jsdelivr');
// Réponses CDN : seulement en mode CORS, pour que le statut soit lisible (voir la branche CDN)
const enCors = (u) => new Request(u, { mode: 'cors', credentials: 'omit' });

/* Remplit le cache CDN : saute ce qui y est déjà, recopie ce qu'un ancien cache versionné contient encore
   (transition), sinon télécharge. Ne rejette jamais. */
function remplirCdn() {
  return caches.open(CDN_CACHE).then((c) => Promise.all(CDN_PRE.map((u) =>
    c.match(u, { ignoreVary: true }).then((h) => h || caches.match(u, { ignoreVary: true }).then((v) =>
      (v && v.ok) ? c.put(u, v) : fetch(enCors(u)).then((r) => (r.ok ? c.put(u, r) : null))))
      .catch(() => {})))).catch(() => {});
}

// Installation : pré-cache le cœur de l'app
self.addEventListener('install', (e) => {
  e.waitUntil(
    /* hors-ligne 27/11 : plus de .catch qui avale l'échec. Un pré-cache raté (réseau qui coupe) fait échouer
       l'installation : l'ancien SW et son cache restent en place, le navigateur réessaiera à la vérification
       suivante. Avant, le nouveau SW s'activait avec un cache vide et effaçait la seule copie de la page.
       cache:'no-cache' : la page est revalidée auprès du serveur (jamais l'ancienne du cache HTTP, max-age 600 s
       de GitHub Pages), mais un 304 évite de retélécharger les 2,4 Mo que la page vient peut-être de recevoir.
       Puis le CDN, APRÈS la page (pour ne pas lui disputer le réseau), avec au plus 20 s : le reste se remplira
       à la demande. skipWaiting seulement à la fin, donc après un pré-cache complet de la page. */
    caches.open(CACHE).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'no-cache' }))))
      .then(() => Promise.race([remplirCdn(), new Promise((r) => setTimeout(r, 20000))]))
      .then(() => self.skipWaiting())
  );
});

/* hors-ligne 27/11 : transition. Les fichiers CDN des anciens caches versionnés (SDK, MathJax, polices) passent
   dans le cache CDN AVANT la suppression de ces caches. Ne rejette jamais. */
function recopierCdn(vieux) {
  return caches.open(CDN_CACHE).then((cdn) => Promise.all(vieux.map((k) => caches.open(k).then((v) => v.keys()
    .then((reqs) => Promise.all(reqs.filter((r) => estCdn(new URL(r.url))).map((r) =>
      cdn.match(r, { ignoreVary: true }).then((h) => h || v.match(r).then((res) => (res && res.ok ? cdn.put(r, res) : null)))
        .catch(() => {}))))))))
    .catch(() => {});
}
/* hors-ligne 27/11 : une version qui change dans l'URL (firebasejs/12.14.0/, mathjax/3.2.2/) rend l'entrée
   inutile : on la retire du cache CDN, qui sinon grossirait à chaque montée de version. Restent utiles les
   versions de CDN_PRE ET celles que cite la page en cache (si CDN_PRE a été oublié lors d'une montée de version,
   on ne purge pas la nouvelle) ; page illisible = aucune purge. */
const versionCdn = (u) => (u.match(/\/(?:firebasejs|mathjax)\/[^/]+\//) || [])[0];
const VERSIONS_CDN = CDN_PRE.map(versionCdn).filter(Boolean);
function purgerCdn() {
  return caches.open(CACHE).then((c) => c.match('./index.html')).then((p) => (p ? p.text() : null)).then((texte) => {
    if (texte === null) return null;
    const utiles = new Set(VERSIONS_CDN.concat(texte.match(/\/(?:firebasejs|mathjax)\/[^/"'\s]+\//g) || []));
    return caches.open(CDN_CACHE).then((cdn) => cdn.keys().then((reqs) => Promise.all(reqs
      .filter((r) => { const v = versionCdn(r.url); return v && !utiles.has(v); })
      .map((r) => cdn.delete(r)))));
  }).catch(() => {});
}

// Activation : nettoie les anciens caches (sauf le cache images et le cache CDN, partagés entre versions)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      const vieux = keys.filter((k) => k !== CACHE && k !== IMG_CACHE && k !== CDN_CACHE);
      /* hors-ligne 27/11 : les anciens caches ne sont supprimés que si le nouveau contient bien la page (éviction
         entre l'installation et l'activation : on garde l'ancienne copie, dernier repli des navigations). */
      return recopierCdn(vieux).then(() => caches.open(CACHE)).then((c) => c.match('./index.html'))
        .then((page) => (page ? Promise.all(vieux.map((k) => caches.delete(k))) : null));
    }).then(purgerCdn)
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ne jamais mettre en cache Firebase (auth + Firestore en temps réel).
  // Seule exception Google : la feuille des polices (fonts.googleapis.com), confiée à la branche CDN.
  const policesGoogle = url.hostname === 'fonts.googleapis.com';
  if (!policesGoogle && (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.pathname.includes('/recaptcha/') ||   // v313 : reCAPTCHA (App Check) toujours du réseau, jamais du cache
      (!url.hostname.includes('gstatic') && url.hostname.includes('google')))) {
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

  // CDN (SDK Firebase, MathJax, polices) : cache-first (gros, immuables)
  if (estCdn(url)) {
    /* hors-ligne 27/11 : cache CDN persistant, et seulement des réponses saines (res.ok). Une requête no-cors
       (feuille Google Fonts, extension MathJax ajoutée par une balise <script>) est refaite en CORS : ces CDN
       renvoient tous Access-Control-Allow-Origin: *, et une réponse CORS satisfait une requête no-cors. Règle
       pour toute réponse OPAQUE restante (CDN sans CORS) : servie à la page, JAMAIS mise en cache. Son statut est
       illisible (0) : une erreur 5xx passerait pour un succès et serait resservie indéfiniment, et Chromium
       compte chaque réponse opaque pour plusieurs Mo de quota. Hors ligne et sans copie : Response.error()
       (avant : undefined, d'où « Failed to convert value to 'Response' »). */
    const cors = req.mode === 'no-cors' ? enCors(req.url) : req;
    e.respondWith(
      caches.open(CDN_CACHE).then((c) => c.match(req, { ignoreVary: true }).then((hit) =>
        hit || fetch(cors).catch((err) => { if (cors === req) throw err; return fetch(req); }).then((res) => {
          if (res.ok) { const p = c.put(req, res.clone()).catch(() => {}); try { e.waitUntil(p); } catch (x) {} }
          return res;
        }).catch(() => caches.match(req, { ignoreVary: true }).then((r) => r || Response.error()))
      ))
    );
    return;
  }

  /* hors-ligne 27/11 : toute navigation vers une page du site est servie par la copie UNIQUE './index.html'
     (une adresse avec ?paramètres ou './' donne la même page), rafraîchie en arrière-plan sous cette même clé. */
  const nom = url.pathname.split('/').pop();
  const page = url.origin === self.location.origin && req.mode === 'navigate' && (!nom.includes('.') || /\.html?$/.test(nom));
  const cle = page ? './index.html' : req;

  // Page et ressources locales : cache d'abord, rafraîchi en arrière-plan ; sans cache, réseau,
  // et hors ligne sans cache, dernier repli dans TOUS les caches (une ancienne page vaut mieux qu'une erreur).
  /* hors-ligne 27/11 : une navigation est revalidée auprès du serveur (requête conditionnelle, 304 le plus souvent) :
     en mode par défaut, « / » pouvait venir du cache HTTP (max-age 600 de GitHub Pages) et réécrire l'ANCIENNE page
     sous './index.html' dans le cache de la nouvelle version. */
  const reseau = fetch(page ? new Request(req, { cache: 'no-cache' }) : req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      return caches.open(CACHE).then((c) => c.put(cle, copy)).catch(() => {}).then(() => res);
    }
    return res;
  });
  e.waitUntil(reseau.catch(() => {}));
  e.respondWith(
    // Recherche d'abord dans le cache de CETTE version : caches.match() seul fouillerait aussi les
    // caches d'une version précédente et pourrait resservir l'ancienne page.
    caches.open(CACHE).then((c) => c.match(cle)).then((hit) =>
      hit || reseau.then((res) => (page && !res.ok ? caches.match(cle).then((r) => r || res) : res))
        .catch(() => caches.match(cle).then((r) => r || Response.error()))
    )
  );
});

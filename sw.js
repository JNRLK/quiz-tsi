/* Service Worker — Console de révision TSI
   Stratégie : "network-first" pour la page (toujours la dernière version
   quand on a du réseau), "cache-first" pour MathJax/polices (gros fichiers
   externes qui ne changent jamais). Fonctionne hors ligne après 1ère visite. */

const CACHE = 'quiz-tsi-v75';  /* CORRECTIF RÉGRESSION : le push v74 avait déployé une copie locale périmée (pré-v72) qui écrasait les raccourcis clavier (quiz + révision/confiance) et la fiche de cours en plein écran. Restauration de la base v72 correcte (GitHub HEAD f996b48a) + chapitre « Variables aléatoires » reconservé */
const CORE = [
  './',
  './index.html',
  './manifest.json'
];

// Installation : pré-cache le cœur de l'app
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {})
  );
  self.skipWaiting();
});

// Activation : nettoie les anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
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
      (!url.hostname.includes('gstatic') && url.hostname.includes('google'))) {
    return; // laisse passer vers le réseau normalement
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

  // Page et ressources locales : network-first, repli sur cache hors ligne
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});

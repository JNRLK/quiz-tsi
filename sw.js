/* Service Worker — Console de révision TSI
   Stratégie : "network-first" pour la page (toujours la dernière version
   quand on a du réseau), "cache-first" pour MathJax/polices (gros fichiers
   externes qui ne changent jamais). Fonctionne hors ligne après 1ère visite. */

const CACHE = 'quiz-tsi-v86';  /* SRS — MOTEUR DE PROGRESSION (6 correctifs) : #1 réinjection des paliers d'apprentissage EN session (dueLearning, collapse 20 min : les étapes 1/10 min vivent enfin) ; #2 détection LEECH (carte oubliée ≥8× signalée élève+prof) ; #3 oubli ADOUCI des cartes mûres (≥21 j → intervalle post-oubli plafonné à 7 j au lieu d'un reset à 1 j) ; #4 reviewLog SYNCHRONISÉ cloud (rétention vraie + heatmap multi-appareils) ; #5 LISSAGE du backlog (plafond 120 révisions/jour, « +N en attente ») ; #7 compteurs valides-only (plus d'orphelines dans globalStats). ── v85 RESTRUCTURATION CHAPITRES — les 20 chapitres maths regroupés deviennent les 32 chapitres NUMÉROTÉS de la prof (cahier de prépa tsi2-chaptal-paris) ; re-classement des 469 cartes selon la fiche rattachée à chacune (remap au chargement : seul le champ topic change, énoncés inchangés → progression SRS préservée) + 6 cartes « 15. TVI et bijections » créées (programme TSI1). ── v77 (conservé) PLEIN ÉCRAN + TRANSITIONS : zoom des cartes en plein écran agrandi (1.34em, énoncé 52px, choix 25px, colonne 1180px) + transition sans flash (typeset MathJax avant affichage + fondu .mj-pending + scrollQuizTop). ── v76 (conservé) ACCÈS CLASSE — fix « re-demande d'adhésion fantôme » : un élève DÉJÀ approuvé était renvoyé vers « Rejoindre la classe » (accueil + verrou révision) et sa re-demande était AVALÉE côté prof (la liste « en attente » filtrait via l'ancien roster). Corrigé : accueil/verrou respectent classStatus==='approved' (+ cache anti-aléa réseau) ; la console prof détecte les demandes via le doc de l'élève, plus le roster ; auto-réparation des membres de l'ancien roster sans classStatus. ── v75 (conservé) : le push v74 avait déployé une copie locale périmée (pré-v72) écrasant les raccourcis clavier + la fiche de cours en plein écran ; base v72 (GitHub HEAD f996b48a) restaurée + chapitre « Variables aléatoires » reconservé */
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

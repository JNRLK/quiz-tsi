/* ── v95 REFONTE UX « Direction B » (greffée sur la base schémas v94, contenu/schémas/moteur INTACTS) : header en barre d'icônes + « Se connecter » primaire ; carte-interrupteur Approfondissement (titre+pastille+switch, tappable/clavier) ; sélecteur de thème en PIED DE PAGE ; refonte MOBILE du Quiz perso (grille ≥4 4px) + sélection de chapitre (nom complet, bouton Réviser dédié) ; SUPPRESSION bloc démo (corrige TSI0/TSI2). FSRS-6, rétention 92 %, schémas MathJax, conformité programme et 32 chapitres préservés. Service Worker — Console de révision TSI
   Stratégie : "network-first" pour la page (toujours la dernière version
   quand on a du réseau), "cache-first" pour MathJax/polices (gros fichiers
   externes qui ne changent jamais). Fonctionne hors ligne après 1ère visite. */

const CACHE = 'quiz-tsi-v102';  /* ── v102 CLASSES TSI0/1/2 + GESTION DES MEMBRES + SUPPRESSION ROBUSTE : à l'inscription l'élève CHOISIT sa classe (boutons TSI0/TSI1/TSI2 sur l'accueil ET dans le verrou d'accès) → écrit filiere=TSI + annee, regroupé automatiquement dans la console prof. Console admin : bouton « ✗ Retirer » + menu déroulant « changer de classe » sur CHAQUE membre approuvé (avant : aucune action possible une fois approuvé). Approbation / retrait / déplacement / réparation écrits en REPLI CLIENT direct (un compte enseignant a le droit d'écrire profile.classStatus/annee par les règles Firestore) si la Cloud Function setClassApproval est indisponible. SUPPRESSION DE COMPTE durcie : quand deleteAccount renvoie « internal » (fonction non déployée / plan Blaze), repli client qui efface les DONNÉES (doc users + sessions + pseudo, teacher-allowed) ; le login Firebase restant est clairement signalé (console Authentication / redéploiement). Cloud Function deleteAccount durcie séparément (message lisible au lieu d'« internal », fallback manuel si recursiveDelete indispo). Énoncés/SRS/FSRS-6/32 chapitres/schémas/design/Mot du jury INCHANGÉS. ── v101 GÉOMÉTRIE 3D (GeoGebra) : explorateurs 3D interactifs « Explorer en 3D » sur 13 cartes geoespace (produit vectoriel ⊥ plan + norme, produit mixte = volume du parallélépipède, plans parallèles ⟺ normales colinéaires, intersection de deux plans, vecteur normal au plan, sphère). Champ additif ggb:{obs,leg,cmds} → bouton + hôte ajoutés à exp au chargement (énoncés q INCHANGÉS → SRS préservé) ; applet GeoGebra 3D (vue 3D seule) chargé LAZY au clic depuis geogebra.org (en ligne) avec bandeau « À observer » + légende couleurs (thémés). Reste de la carte et app = légers/hors-ligne/thémés ; CSP déjà permissive. Page de test temporaire labo-3d.html. ── v100 ANNULATION (anti-miss-click) : bouton « ↶ Annuler » dans la barre du quiz + raccourci Ctrl/Cmd+Z. Un clic accidentel sur une note (Oubli/Difficile/Correct/Facile, confiance QCM, « Je ne sais pas ») fait avancer la carte ET corrompt la planification SRS — désormais réversible. Avant chaque notation, instantané MINIMAL (état SRS de la carte via qHash + daily/streak/reviewLog + compteurs de session score/streak/count) ; l'annulation restaure cet état et ré-affiche la carte vierge pour la re-noter. Multi-niveaux (pile bornée à 60), SRS-safe (énoncés q INCHANGÉS → hash préservés ; restauration chirurgicale validée par 26 tests sur le vrai moteur FSRS, dont oubli accidentel sur carte mûre restaurée à l'identique), mobile-safe (snapshot léger). En révision (file dynamique) l'annulation jette la carte piochée à la suite ; en quiz (pool fixe) le pool n'est pas tronqué. Ne vole pas l'annulation native pendant la saisie d'une réponse. ── v99 SCHÉMAS — PROBABILITÉS (+3 arbres pondérés composés avec segment+label, sans nouvelle primitive ; additif, SRS préservé ; 47 cartes à figure au total) : formule de Bayes, formule des probabilités totales (système complet), définition de la probabilité conditionnelle — arbre à 2 niveaux A/Ā puis B/B̄ avec probabilités sur les branches. Reste hors-FIG : géométrie 3D (~10 cartes) → décision GeoGebra parkée. ── v98 SCHÉMAS — LOT 3 (+16 figures FIG + nouvelle primitive `area` remplissage sous-courbe ; additif, SRS préservé ; 44 cartes à figure au total) : intégrale=aire (∫₀^π sin=2), croissance f≤g, ∫ fonction impaire=0 (aires +/− qui se compensent), Chasles (aire découpée en a<c<b), convexité/position courbe-tangente, équivalents en 0 (ln(1+x)∼x, 1−cos x∼x²/2, eˣ−1∼x, sin x∼x), suites adjacentes (intervalles emboîtés), domaine de ln, arccos (domaine/image), amplitude de a cos x+b sin x. ── v97 SCHÉMAS — LOT 2 (+21 figures FIG, additif, énoncés q INCHANGÉS → SRS préservé ; 28 cartes à figure au total) : cercle trigonométrique (cos π/6, sin π/3, tan π/4, cos π, identité cos²+sin²=1, arcsin), plan complexe (module |3+4i|, arg(−1), conjugué, e^{iπ}, e^{iπ/2}), racines n-ièmes (hexagone régulier), arctan (asymptotes ±π/2), croissance comparée ln≪x≪eˣ, valeur absolue |x|, parité, théorème de Rolle, accroissements finis (TAF), distance point-droite, vecteur normal. ── v96 GÉNÉRATEUR DE SCHÉMAS (FIG) : fonction FIG ajoutée (mini-DSL SVG inline — 1 SEUL repère pour formes ET labels, flèches/arcs générés, currentColor → 3 thèmes, labels rendus par MathJax) ; champ déclaratif fig:{window,items} converti en SVG dans exp AU CHARGEMENT (énoncés q INCHANGÉS → SRS préservé ; try/catch : une figure invalide ne casse jamais l'app). 7 cartes équipées : ln, Al-Kashi, tangente, TVI, suite récurrente (escalier/cobweb), produit scalaire (angle), somme de Riemann. Tâche « signalements-check-tsi » branchée : une demande de schéma fondée → ajout d'un champ fig (catalogue de figures-types) au lieu de « non fondé ». ── v94 FIX LABELS MATH (alpha/vec) : en v93, le re.sub de génération avait collapsé les doubles antislashs des labels en simple → après eval JS, la commande LaTeX (alpha, vec) perdait son antislash et s'affichait en toutes lettres (ex. « ialpha ») dans les schémas rotation et droite. Correctif : doublage des antislashs dans les régions figure → eval JS redonne la bonne commande → MathJax rend α et le vecteur. Cercle/monotone non touchés (labels sans commande). ── v93 SCHÉMAS — LABELS MATHJAX : les écritures des schémas sont désormais rendues par MathJax (le moteur mathématique de l'app), typographie STRICTEMENT identique au reste des cartes (vraies écritures mathématiques, fini le Computer Modern de TikZ jugé incohérent). Géométrie = SVG inline (currentColor → thèmes), labels = spans $...$ positionnés en % et typeset par MathJax. AUCUNE dépendance ajoutée (MathJax déjà chargé + en cache offline). Énoncés q inchangés (figure dans exp) → SRS préservé. ── v92 FIX THÈME NUIT : dans les schémas TikZ, les labels et points (glyphes sans attribut fill) héritaient du NOIR par défaut → invisibles sur fond sombre (thème Nuit). Correctif : fill='currentColor' ajouté sur la racine <svg> → labels + points adoptent la couleur d'encre du thème (vérifié sur fond Nuit : tout visible). ── v91 SCHÉMAS PRO (TikZ) : les 4 schémas refaits avec TikZ + dvisvgm (qualité publication : typographie LaTeX, flèches Stealth, géométrie précise) ; labels tracés en chemins (--no-fonts, autonomes), couleurs #000 → currentColor (compatibles thèmes). Remplacent les schémas tracés main de v90. Énoncés q inchangés (schéma dans exp) → SRS préservé. ── v90 SCHÉMAS : schémas SVG inline (currentColor, compatibles thèmes Papier/Nuit/Contraste) ajoutés dans le champ exp de 4 cartes (énoncés q inchangés → SRS préservé) — cercle |z-a|=r, rotation par e^{iα}, fonction monotone (limites latérales en un point intérieur), droite paramétrique M=A+t·u. ── v89 SIGNALEMENTS + CONFORMITÉ PROGRAMME : retrait du terme « sous-espace affine » (HORS-PROGRAMME TSI1, explicite au programme) de 6 cartes (systèmes ×2, équations différentielles/exp ×4 ; maths inchangées) ; « accept » de l'espérance E(X) élargi (formes commutées + notation p_i) ; enrichissements (définition des bases de la composée, « théorème des bornes atteintes / Weierstrass », récurrence sur Z, invariants de similitude). Énoncés (q) inchangés → SRS préservé. ── SRS — FSRS-6 : rétention cible IMPOSÉE à 92 % (curseur élève RETIRÉ). Décision : l'optimum d'ancrage est ~90 % (difficulté désirable + équilibre Anki), PAS plus haut ; on penche très légèrement vers la rétention (92 %, lean concours) sans l'excès contre-productif de 95 %+. Modifiable seulement via setFsrsRetention (console prof/admin), pour éviter qu'un élève sous-révise. ── v87 PASSAGE À FSRS-6 (algo avancé d'Anki, option recommandée — PAS le défaut SM-2 d'Anki) : le moteur de révision n'utilise plus SM-2 mais FSRS (mémoire Stabilité/Difficulté par carte ; intervalle = f(rétention cible)). Paliers d'apprentissage courts conservés (1m/10m) ; max interval 365 j (horizon prépa). Paliers d'apprentissage en minutes conservés ; migration DOUCE des cartes existantes (S amorcée depuis l'intervalle, D depuis l'ease, progression qHash préservée, dues inchangées jusqu'à la prochaine révision) ; port FIDÈLE de ts-fsrs validé numériquement (0 écart / 152 cas + 9 tests d'intégration). Poids FSRS-6 par défaut (optimisation perso possible plus tard via reviewLog déjà synchronisé). ── v86 SRS — MOTEUR DE PROGRESSION (6 correctifs) : #1 réinjection des paliers d'apprentissage EN session (dueLearning, collapse 20 min : les étapes 1/10 min vivent enfin) ; #2 détection LEECH (carte oubliée ≥8× signalée élève+prof) ; #3 oubli ADOUCI des cartes mûres (≥21 j → intervalle post-oubli plafonné à 7 j au lieu d'un reset à 1 j) ; #4 reviewLog SYNCHRONISÉ cloud (rétention vraie + heatmap multi-appareils) ; #5 LISSAGE du backlog (plafond 120 révisions/jour, « +N en attente ») ; #7 compteurs valides-only (plus d'orphelines dans globalStats). ── v85 RESTRUCTURATION CHAPITRES — les 20 chapitres maths regroupés deviennent les 32 chapitres NUMÉROTÉS de la prof (cahier de prépa tsi2-chaptal-paris) ; re-classement des 469 cartes selon la fiche rattachée à chacune (remap au chargement : seul le champ topic change, énoncés inchangés → progression SRS préservée) + 6 cartes « 15. TVI et bijections » créées (programme TSI1). ── v77 (conservé) PLEIN ÉCRAN + TRANSITIONS : zoom des cartes en plein écran agrandi (1.34em, énoncé 52px, choix 25px, colonne 1180px) + transition sans flash (typeset MathJax avant affichage + fondu .mj-pending + scrollQuizTop). ── v76 (conservé) ACCÈS CLASSE — fix « re-demande d'adhésion fantôme » : un élève DÉJÀ approuvé était renvoyé vers « Rejoindre la classe » (accueil + verrou révision) et sa re-demande était AVALÉE côté prof (la liste « en attente » filtrait via l'ancien roster). Corrigé : accueil/verrou respectent classStatus==='approved' (+ cache anti-aléa réseau) ; la console prof détecte les demandes via le doc de l'élève, plus le roster ; auto-réparation des membres de l'ancien roster sans classStatus. ── v75 (conservé) : le push v74 avait déployé une copie locale périmée (pré-v72) écrasant les raccourcis clavier + la fiche de cours en plein écran ; base v72 (GitHub HEAD f996b48a) restaurée + chapitre « Variables aléatoires » reconservé */
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

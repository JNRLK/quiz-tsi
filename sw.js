/* education-tsi.fr — Service Worker. Version COURANTE = valeur de const CACHE ci-dessous ; historique des versions (récent → ancien) dans le commentaire de cette ligne. Bloc ci-dessous = note historique d'origine. ── v95 REFONTE UX « Direction B » (greffée sur la base schémas v94, contenu/schémas/moteur INTACTS) : header en barre d'icônes + « Se connecter » primaire ; carte-interrupteur Approfondissement (titre+pastille+switch, tappable/clavier) ; sélecteur de thème en PIED DE PAGE ; refonte MOBILE du Quiz perso (grille ≥4 4px) + sélection de chapitre (nom complet, bouton Réviser dédié) ; SUPPRESSION bloc démo (corrige TSI0/TSI2). FSRS-6, rétention 92 %, schémas MathJax, conformité programme et 32 chapitres préservés. Service Worker — Console de révision TSI
   Stratégie : "network-first" pour la page (toujours la dernière version
   quand on a du réseau), "cache-first" pour MathJax/polices (gros fichiers
   externes qui ne changent jamais). Fonctionne hors ligne après 1ère visite. */

/* ── v108 NETTOYAGE : suppression du système de fiches PDF/JPG (chemin de repli jamais atteint — toutes les cartes passent par les notions HTML) : 204 PDF + 143 JPG retirés du dépôt (~62 Mo), code mort retiré (branche image/PDF de openCourse, lien « PDF ↗ », FICHE_LABEL, CSS .cv-img). CARD_FICHE CONSERVÉ (sert au reclassement des chapitres). Notions HTML / SRS / FSRS / schémas INCHANGÉS. */
/* ── v110 RETRAIT STRIPE/ABONNEMENT : suppression totale du code et de l'UI d'abonnement (modale subscribeModal, openSubscribe/closeSubscribe/startCheckout/openBillingPortal, constantes SUBSCRIBE_ON/STRIPE_PRICES, mySubStatus/subActive, bouton « s'abonner » du verrou d'accès, mention Stripe des mentions légales) ; accès « révision » désormais purement basé sur la classe (revisionAllowed = !ACCESS_GATE_ON || isAdmin || classStatus==='approved'). Greffé sur v109 Physique-Chimie, INTACT. node --check OK. */
/* ── v111 PHYSIQUE — LOT PILOTE OPTIQUE GÉOMÉTRIQUE : 12 cartes ajoutées à ph_optique_geo (modes flash/qcm/saisie/trou) + 2 schémas FIG créés (réfraction Snell-Descartes, construction d'image lentille convergente) — vectoriels, thémés, labels MathJax. Ajout ADDITIF dans QUESTIONS (qHash préservés → SRS-safe). node --check OK. */
/* ── v112 FIX SCHÉMAS — LABELS ANTI-SUPERPOSITION : dans le générateur FIG, chaque label (points A/B/O/F, angles, axes…) reçoit une pastille de fond (var(--panel-2), thémée) → le texte n'est plus jamais superposé/illisible par-dessus un trait ou un objet. Correctif GLOBAL : s'applique à TOUS les schémas du site (physique ET maths). Aucun changement de q/qHash → SRS préservé. */
/* ── v113 OPTIQUE GÉOMÉTRIQUE — CHAPITRE ÉTOFFÉ : 23 cartes (12 -> 23) à DOMINANTE FLASHCARD (18 flash / 2 qcm / 2 saisie / 1 trou) couvrant tout le programme TSI1 (indice, Snell-Descartes, réflexion totale + fibre, lentilles conv./div., foyers, vergence, Gauss, conjugaison, grandissement, 5 cas de l'objet réel, image réelle/virtuelle, ASSOCIATIONS de lentilles + grandissements, miroir plan). 7 schémas FIG vérifiés par tracé de rayons (réfraction, réflexion totale, cas limite, construction conv., construction div., loupe, doublet). FIX bug d'affichage : < et > bruts dans les formules (interprétés comme balises HTML -> texte mangé) remplacés par \lt / \gt. Additif (qHash) -> SRS préservé. node --check OK. */
/* ── v114 PHYSIQUE — CHAPITRE « 1. Propagation d'un signal » : 21 cartes (16 flash / 2 qcm / 2 saisie / 1 trou) au standard, conformes au programme TSI1 (onde progressive, énergie sans matière, célérité, transversale/longitudinale, son, double périodicité, λ=cT, retard, k & ω=ck, déphasage, milieu dispersif, interférences, ondes stationnaires, battements, ordres de grandeur). 2 schémas FIG par tracé de courbe (périodicité spatiale λ et temporelle T). Sérialiseur JS pour préserver les fonctions plot. Additif (qHash) → SRS préservé. node --check OK. */
/* ── v115 PHYSIQUE — CHAPITRE « 3. Signaux électriques dans l'ARQS » : 21 cartes (16 flash / 2 qcm / 2 saisie / 1 trou) programme TSI1 (ARQS, intensité, lois nœuds/mailles, Ohm, effet Joule, puissance, assoc. série/parallèle, diviseurs tension/courant, condensateur q=Cu & E=½Cu², bobine u=Ldi/dt & E=½Li², continuités, régime permanent C/L, Thévenin, masse). 1 schéma FIG (pont diviseur de tension). Additif → SRS préservé. */
/* ── v116 PHYSIQUE — CHAPITRE « 4. Circuit du premier ordre et oscillateurs libres » : 20 cartes (15 flash) programme TSI1 (RC/RL, constante de temps, charge/décharge, 5τ, régime libre/forcé, oscillateur harmonique LC ω0=1/√(LC), équa diff, RLC libre : régimes apériodique/critique/pseudo-périodique, facteur de qualité Q, énergie, décrément). 3 schémas FIG (charge, décharge, pseudo-périodique). Additif → SRS. */
/* ── v117 SCHÉMAS DENSIFIÉS — OPTIQUE : un schéma sur CHACUNE des 23 cartes (la physique demande un schéma quasi partout). Nouveau moteur lensConstruct (tracé de rayons automatique et exact : lentille, foyers, objet, image, 3 rayons, traits pleins/pointillés réel/virtuel) + schémas dédiés (fibre optique, foyers, conditions de Gauss, objet au foyer → image à l'infini, miroir plan). q/qHash inchangés → SRS préservé. Standard étendu aux prochains chapitres. */
/* ── v118 SCHÉMAS DENSIFIÉS — PROPAGATION : 21/21 cartes avec schéma (palette d'ondes : snapshot λ/T, transversale vs longitudinale, son longitudinal, retard, interférences, ondes stationnaires nœuds/ventres, battements). qHash inchangés → SRS. */
/* ── v119 FIX doublons Propagation : la v118 avait laissé les 21 anciennes cartes (clés non quotées non filtrées) → 42 cartes. Purge + réinsertion du seul bloc dense (21 cartes, 21 schémas). */
/* ── v120 SCHÉMAS DENSIFIÉS — ARQS : 21/21 cartes avec schéma de circuit (bibliothèque : résistance, condensateur, bobine, source, nœud, masse, diviseurs, Thévenin). qHash inchangés → SRS. */
/* ── v121 SCHÉMAS DENSIFIÉS — 1er ORDRE & OSCILLATEURS LIBRES : 20/20 cartes avec schéma (circuits RC/LC/RLC, courbes charge/décharge, oscillation harmonique, comparaison des régimes apériodique/critique/pseudo-périodique). Famille SIGNAUX désormais entièrement dense (Optique, Propagation, ARQS, 1er ordre). qHash inchangés → SRS. */
/* ── v122 PHYSIQUE — CHAPITRE « 5. Oscillateurs forcés (résonance) » : 20 cartes (17 flash) programme TSI1 (RLC forcé, impédances complexes Z_R/Z_L/Z_C, loi d'Ohm complexe, résonance d'intensité à ω0, facteur de qualité Q=ω0/Δω, bande passante -3dB, acuité, déphasage, surtension QE, capacitif/inductif). 20/20 schémas (courbe de résonance, acuité selon Q, RLC forcé, déphasage, plan complexe des impédances). FAMILLE SIGNAUX COMPLÈTE sauf Filtrage. */
/* ── v123 PHYSIQUE — CHAPITRE « 6. Filtrage linéaire et ALI » : 20 cartes (17 flash) programme TSI1 (fonction de transfert, gain dB, phase, Bode, passe-bas/haut/bande, pulsation de coupure -3dB, pente ±20dB/déc, filtre RC, ALI idéal + montages suiveur/inverseur/non-inverseur, saturation, analyse de Fourier). 20/20 schémas (Bode, RC, ALI, spectre). FAMILLE SIGNAUX (6 chapitres) COMPLÈTE ET DENSE. */
/* ── v124 FIX SCHÉMAS OPTIQUE : moteur lensConstruct corrigé — (1) AXE OPTIQUE désormais tracé (O/F/F' ne flottent plus), (2) hauteur de lentille calée sur l'objet et non sur l'image (fini la lentille géante en loupe / entre F et 2F). 23 schémas régénérés, géométrie revérifiée (passage par O et F', image bien placée). qHash inchangés → SRS. */
/* ── v125 PHYSIQUE — MÉCANIQUE 1/4 « 7. Cinématique du point » : 20 cartes (16 flash) programme TSI1 (référentiel, vecteur position, vitesse/accélération, cartésien & polaire, base polaire, mvt rectiligne/circulaire, base de Frenet a=dv/dt·uT+v²/R·uN, abscisse curviligne). 20/20 schémas (repères, vitesse tangente, cercle, Frenet) tous AVEC repère/axe. */
/* ── v126 PHYSIQUE — MÉCANIQUE 2/4 « 8. Lois de Newton » : 20 cartes (18 flash) programme TSI1 (quantité de mouvement, 3 lois de Newton, référentiel galiléen, poids, réaction du support, ressort -kx, frottement fluide -λv, tension, gravitation, projectile, équilibre, Coulomb, plan incliné, pendule). 20/20 schémas (diagrammes de forces : bilan, plan incliné, ressort, pendule, action-réaction, projectile, gravitation) avec sol/repère. */
/* ── v127 FIX CONFORMITÉ PROGRAMME — CHAPITRE 6 « Filtrage linéaire » RÉÉCRIT : retrait TOTAL de l'ALI (HORS programme TSI1, erreur). Recalé sur le programme officiel 1.6 : signaux périodiques (spectre : composante continue / fondamental / harmoniques), valeur moyenne & efficace, fonction de transfert, diagramme de Bode, FILTRES PASSIFS (passe-bas/passe-haut ordre 1, passe-bas/passe-bande ordre 2), comportement HF/BF, zones rectilignes, filtrage d'un signal non sinusoïdal, mise en cascade (Zs faible/Ze forte), filtrage MÉCANIQUE (sismomètre/amortisseur). 20/20 schémas. */
/* ── v128 FIX CONFORMITÉ — CHAPITRE 1 « Propagation » recalé sur programme 1.1 : RETRAIT des ondes stationnaires, battements et milieu dispersif (hors-programme ; le programme précise « non dispersive »). AJOUT : écriture f(x-ct)/f(t-x/c), diffraction à l'infini θ≈λ/d. Audit : ch3/ch4/ch5 conformes, ch7 OK. */
/* ── v129 FIX CONFORMITÉ — CHAPITRE 8 « Lois de Newton » recalé sur programme 2.2 : RETRAIT des lois de Coulomb du frottement SOLIDE (hors-prog ; seul le frottement FLUIDE est au programme). AJOUT : vitesse limite, équation du pendule + analogie oscillateur harmonique, gravitation/satellites (gravité = force centripète), 3e loi de Kepler (orbite circulaire). Audit conformité terminé pour les chapitres déployés. */
/* ── v130 (1) FIX LABELS SCHÉMAS : le fond opaque des labels (qui effaçait le tracé derrière) remplacé par un HALO fin (text-shadow couleur panneau) → le texte reste lisible SANS masquer le schéma. Global (tous schémas). (2) MÉCANIQUE 3/4 et 4/4 : chapitres « 9. Approche énergétique » (22 cartes) et « 10. Solide en rotation » (21 cartes), rédigés + VÉRIFIÉS conformes au programme 2.3/2.4 par workflow adversarial. 100% schémas (énergie : travail, TEC, graphe Ep puits/barrière/équilibres, échange Ec-Ep ; rotation : v=rω, J, moment/bras de levier, couple, pivot, TMC, pendule pesant, Ec=½Jω², tabouret). FAMILLE MÉCANIQUE COMPLÈTE. */
/* ── v131 FIX CONFORMITÉ + QUALITÉ (retours élève) : ch7 CINÉMATIQUE — RETRAIT de la base de Frenet (HORS-PROGRAMME TSI1 2021) ; remplacée par l'approche qualitative courbure/concavité (au programme) ; coordonnées cartésiennes/polaires/cylindriques explicitées + base polaire renforcée. ch8 NEWTON — ressort en CAS GÉNÉRAL F=-kΔx·ex avec Δx=ℓ-ℓ0 (schéma avec longueur à vide) ; frottement fluide reformulé (modèles faible/grande vitesse) ; schémas gravitation (2 masses) et orbite/satellite débuggés (labels décalés). ch9 — Ep élastique : x=allongement ℓ-ℓ0 + schéma ressort amélioré. Labels = halo (v130). */
/* ── v132 PHYSIQUE — FAMILLE INDUCTION COMPLÈTE (11-16) : 124 cartes (≈80% flash) rédigées + VÉRIFIÉES conformes au programme 1.7-1.12 par workflow adversarial (12 agents). 11 Champ magnétique (cartes de champ, moment magnétique), 12 Forces de Laplace (rails, couple sur spire, aimant dans B, champ tournant), 13 Lois de l'induction (flux, Faraday, Lenz), 14 Auto-induction & mutuelle (transformateur), 15 Circuit mobile (conversion de puissance, Foucault, MCC), 16 Convertisseurs (MCC, synchrone, asynchrone). 100% schémas FIG (cartes de champ, rails, flux, transformateur, courbe couple-vitesse...). Thèmes Signaux+Mécanique+Induction = 16 chapitres. */
/* ── v133 PHYSIQUE — FAMILLE THERMODYNAMIQUE COMPLÈTE (17-21) : 113 cartes (≈75% flash) rédigées + VÉRIFIÉES conformes au programme 3.1-3.5 par workflow adversarial (10 agents). 17 Gaz parfait & corps pur diphasé (PV=nRT, U=3/2nRT, diagramme de phases, dôme L-V, titre), 18 Énergie échangée (W=-PdV, aire Clapeyron, transferts), 19 Premier principe (ΔU=W+Q, enthalpie, transitions de phase), 20 Deuxième principe (ΔS=Séch+Scréée, Laplace), 21 Machines thermiques (ditherme, rendement, Carnot). 100% schémas. PHYSIQUE = 21/21 chapitres ; reste la Chimie (22-27). */
/* ── v134 FIX SCHÉMAS (retours élève) : ch4 figRLC reconstruit (la bobine L était dessinée sur la source E → RLC série propre : E à gauche, R et L en haut, C à droite) ; ch6 figRCfilter sortie décalée (les labels C et s ne se chevauchent plus). NB : la base de Frenet (ch7) était déjà retirée en v131 — captures concernées = cache navigateur, recharger. */
/* ── v135 AUDIT HEBDO 2026-06-22 (3 correctifs, tous SRS-safe) : (1) localStorage 'quiztsi_lastsync' désormais sous try/catch (évite un écran blanc si le stockage est bloqué — Safari/iOS « bloquer toutes les données », profils restreints) ; (2) ACCESSIBILITÉ : tous les schémas FIG reçoivent role="img" + aria-label (lecteurs d'écran) ; (3) hygiène : garde anti-conversion sur P() (hoisting requis par les fig: de QUESTIONS), en-tête sw.js clarifié, labo-3d.html confirmé absent du dépôt. Aucun énoncé/qHash touché. */
/* ── v136 CHIMIE — FAMILLE COMPLÈTE (22-27) : 140 cartes (≈75% flash) rédigées + VÉRIFIÉES conformes au programme 4.1-4.6 par workflow adversarial (12 agents). 22 Molécules/Lewis/VSEPR/cristaux, 23 Interactions (vdW, liaison H, solubilité), 24 Transformations (avancement, Q/K°, activité), 25 Cinétique (ordres, Arrhenius), 26 Acide-base & précipitation (Ka/Ks, diagrammes — AUCUN calcul de pH, conforme), 27 Oxydoréduction (n.o., Nernst, pile, dismutation). 100% schémas (Lewis, VSEPR, cristal, prédominance, cinétique, Arrhenius, pile...). ★ LES 27 CHAPITRES PHYSIQUE-CHIMIE TSI1 SONT COMPLETS. */
/* ── v139 IMPORT ANKI PC — 24 cartes ajoutées depuis le deck Anki personnel de l'élève (622 notes analysées par workflow : sélection conforme TSI1 + anti-doublon vs déployé + vérif adversariale, puis curation manuelle des plus pertinentes). Apport NOUVEAU non couvert : déphasage général φ(ω) RLC + résonance en tension (Q>1/√2, ω_r), série de Fourier (continu+harmoniques), passe-bas=intégrateur (créneau→triangle), choix de filtre par objectif spectral, réf. galiléen↔galiléen, système pseudo-isolé, piège du TEM (forces conservatives), réaction normale/frottement, relation de Mayer + Cv,m/Cp,m, adiabatique≠isolé, 2 lois de Joule, W isotherme=−nRT ln(Vf/Vi), L∝N², charges formelles de Lewis, équilibrage rédox basique, anode/cathode, projectile (flèche/portée), critère a·v>0, frigo monotherme. 21/21 schémas FIG (0 collision/hors-cadre vérifié), 0 <> brut. ADDITIF (q neufs → qHash/SRS/FSRS intacts ; aucune carte existante modifiée). 608 cartes ph_*. */
/* ── v140 MATHS — IMPORT « VRAI/FAUX » Math-Ellipse : 145 flashcards ajoutées (23 chapitres). Issu des sections Vrai/Faux du livre Ellipses, converties par workflow (2 passes : conversion + vérif adversariale) — conformes au programme TSI1 maths, NON-DOUBLONS vs déck déployé, reformulées en flashcards directes (108 flash / 37 qcm ; le « vrai/faux » n'est gardé que quand le piège EST la leçon). Pièges classiques : réciproque vs contraposée, ordre des quantificateurs, image réciproque vs bijection réciproque, somme géométrique vs produit, arg(0) indéfini, racines n-ièmes, etc. 3 schémas FIG (cercle+tangente, racines de l'unité, droite∩plan). ADDITIF (q neufs → qHash/SRS/FSRS intacts). 0 <> brut, node --check OK. */
/* ── v141 PHYSIQUE-CHIMIE — IMPORT « VRAI/FAUX » (livre Ellipses TSI1, scanné/OCR) : 99 flashcards ajoutées sur 16 chapitres. Sections Vrai/Faux des 24 chapitres lues PAGE PAR PAGE EN VISION par workflow (énoncé + corrigé scannés → bonnes réponses + formules), converties (conversion + vérif adversariale) : conformes programme TSI1, NON-DOUBLONS vs 608 cartes ph_ déployées, reformulées en flashcards directes (77 flash / 22 qcm). HORS-PROGRAMME ÉCARTÉS : référentiels non galiléens (ch10, TSI2), classification périodique, statique des fluides/potentiel/thermo chimique non exigibles. Pièges : v=c/n (eau plus lente), F' n'est pas l'image de F, dispersion réflexion vs réfraction, etc. (Schémas FIG ajoutés en passe suivante, SRS-safe.) ADDITIF (q neufs → qHash/SRS/FSRS intacts). 0 <> brut, node --check OK. */
/* ── v142 PHYSIQUE V/F — SCHÉMAS FIG (lot 1/2) : 30 schémas ajoutés aux flashcards Vrai/Faux importées (v141), rédigés par workflow (8 agents, mini-DSL FIG) puis RENDER-CHECKÉS en Node (rejet auto de tout schéma avec collision de label, élément hors-cadre, NaN ou rendu vide). Optique (prisme, dioptre, foyers, lentilles conv./div., grandissement), circuits (conventions récepteur/générateur, ampèremètre/voltmètre, parallèle, sources idéales), diagrammes (P,T)/Clapeyron, prédominance pH, pile, etc. AJOUT du champ fig uniquement (q INCHANGÉ → qHash/SRS/FSRS intacts). 13 schémas restants (collisions) en cours de correction. node --check OK. */
/* ── v143 PHYSIQUE V/F — SCHÉMAS FIG (lot 2/2) : +10 schémas (total 40/43 cartes V/F physique avec schéma) après re-rédaction des collisions par agent + render-check Node. Restent 3 cartes en texte seul (schéma écarté pour collision résiduelle). Optique (dioptre, foyers OF=-OF', accolées), cinématique (vitesse tangente, base polaire), ressort (longueur à vide), diagrammes (P,T) états/point triple, prédominance H3PO4, pile, échelle E°. Ajout du champ fig seulement (q INCHANGÉ → SRS intact). node --check OK. */
/* ── v151 AUDIT CONTENU (lot 1 — correctifs) : 12 corrections issues d'un audit multi-agents des 51 chapitres (correction sur answer/exp/choices, q INCHANGÉ → SRS intact). Notables : signe de P_Laplace en rails (P_Lap=-e·i) ; QCM optique « laquelle des directions » aux choix Vrai/Faux incohérents → 4 vraies directions ; matrices semblables : invariant TSI1 = RANG (trace/déterminant d'ordre n = hors-programme, vérifié au B.O.) ; « oscillations entretenues »→« libres non amorties » (LC) ; τ = durée du transitoire ; passe-haut f_c≪f ; P_frott≤0 (nul aux rebroussements) ; quasi-statique→mécaniquement réversible ; racines n-ièmes : polygone pour n≥3 ; théorème limite de la dérivée signalé hors-programme. node --check OK. */
/* ── v152 AUDIT CONTENU (lot 2 — ajouts) : 114 flashcards ajoutées, issues de l'audit multi-agents des 51 chapitres puis d'une passe de VÉRIFICATION adversariale (conformité programme TSI1 stricte + non-doublon vs déck + correction). 115 proposées → 114 retenues (1 doublon écarté). Comblent des capacités exigibles non couvertes : énergie du photon E=hν (§1.2, bien AU programme), λ=λ0/n, cône d'acceptance de fibre, condition quantitative ARQS L≪λ, régime permanent C/L, invariants de similitude (rang), etc. ~50 chapitres physique+maths enrichis. ADDITIF (q neufs → qHash/SRS/FSRS intacts), 0 <> brut. 22 schémas FIG à ajouter en passe suivante. node --check OK. Total ~1665 cartes. */
/* ── v153 AUDIT — FIX MOTEUR FIG (régression majeure) : le handler `angle` déclarait `var sx,sy` locales, hoistées en tête du callback forEach → elles masquaient le `sx` global de FIG, donc TOUTES les primitives {circle:{...}} rendaient r="NaN" (cercles INVISIBLES). Renommées en asx/asy → 146 schémas déployés réparés d'un coup (sources de circuit, spires, atomes, cercles trigo/cinématique, poulies...). Impact vérifié : 147→1 NaN sur les 702 figs. + retrait de 2 segments à coordonnées NaN littérales dans une carte ressort (ph_newton). Correctif moteur, aucun q modifié → SRS intact. node --check OK. */
/* ── v154 AUDIT — SCHÉMAS des ajouts (lot 1) : 17 schémas FIG ajoutés aux flashcards de l'audit (v152), rédigés par agents puis render-checkés en Node (moteur FIG corrigé v153) : 0 collision/hors-cadre/NaN. Fibre (cône d'acceptance), onde profil t↔x, ARQS L≪λ, diviseur GBF/charge, filtre passif, MCC bilan de puissance, gaz sous piston, Clapeyron rév./irrév., Lewis (charge formelle O), etc. Ajout du champ fig seulement (q INCHANGÉ → SRS intact). 5 schémas restants (agent calé) en cours. node --check OK. */
/* ── v155 AUDIT — SCHÉMAS des ajouts (lot 2, fin) : 5 derniers schémas (puits d'énergie potentielle Ep/Em, pendule simple, spires MCC dans B, couple-vitesse asynchrone moteur/génératrice, bilan MCC) rédigés en agents individuels + render-checkés (0 collision/NaN). 22/22 schémas des cartes d'audit posés. Ajout du champ fig seulement, q INCHANGÉ → SRS intact. AUDIT COMPLET (v151 correctifs, v152 ajouts, v153 fix moteur FIG, v154-155 schémas). node --check OK. */
/* ── v156 SRS — PERSONNALISATION DES POIDS FSRS (apprentissage optimisé sur le mémoire réel de l'élève). Le moteur restait déjà l'état de l'art (FSRS-6, fuzz d'intervalle, entrelacement due+fresh, plafonds 20 neuves/120 révisions, leeches, cap post-oubli, sync cloud) → seule vraie frontière : des poids GÉNÉRIQUES. Ajouté : (1) journal enrichi {t,h,g} (carte + note 1-4) = tuple d'entraînement FSRS ; (2) getFsrsW() lit des poids personnalisés (localStorage) validés, sinon défaut ; (3) optimizeFsrsWeights() (console admin) reconstruit les séquences par carte, ajuste les 21 poids par Adam (diff. finies, régularisé vers le défaut), split train/validation, et N'APPLIQUE QUE si la log-loss de validation s'améliore >0,5 % → JAMAIS PIRE QUE LE DÉFAUT. Testé sur données synthétiques (récupère l'optimum). Comportement par défaut STRICTEMENT INCHANGÉ tant qu'aucune optimisation n'est stockée. Aucun q touché → SRS/contenu intacts. node --check OK. */
/* ── v157 SI — NOUVELLE MATIÈRE « Sciences de l'Ingénieur » : 303 flashcards importées du deck Anki perso de l'élève (torseurs cinématiques/statiques, liaisons normalisées, SLCI/asservissements, chaînes d'énergie & d'information). Conversion par workflow (8 agents) : LaTeX [latex]→MathJax propre (\mbox→\text, torseurs en arrays, &amp;→&), chapitrage en 6 chapitres SI (si_analyse/statique/cinematique/slci/energie/information + 3 familles, subject:'si'). Images redondantes de rendu LaTeX (2latex-*) écartées (source LaTeX conservée) ; 13 cartes purement image-dépendantes non recréables écartées. Pour les cartes « identifier la liaison depuis le torseur », le format texte/MathJax est le bon (un schéma dans la question révélerait la réponse). ADDITIF (q neufs → SRS intact), 0 balise HTML accidentelle. La matière SI apparaît désormais dans le sélecteur. node --check OK. */
/* ── v158 SI — RÉORGANISATION CONFORME AU PROGRAMME. Lecture du programme officiel SI TSI (tsi1_2_si.pdf, colonne Semestre S1-S4) pour restreindre à la TSI1 (S1/S2) : structure passée de 6 chapitres ad hoc à 7 chapitres FIDÈLES au programme — 1.Analyse fonctionnelle & ingénierie système, 2.Chaîne d'information, 3.Chaîne d'énergie & électricité, 4.Liaisons & schéma cinématique (socle méca dédié), 5.Cinématique des solides, 6.Statique des solides, 7.Systèmes asservis (SLCI). TSI2 explicitement exclu (PFD/dynamique, RDM/cohésion, tracé de Bode, réglage correcteurs, machines, modulateurs). Les 303 cartes RE-CLASSÉES par workflow (structure+reclassement) : q INCHANGÉS → qHash/SRS INTACTS (le topic ne fait pas partie du hash). Couverture vérifiée : toutes les liaisons normalisées, 54 cartes torseur (2 sens), 55 définitions préservées. si_analyse vide → badge « bientôt ». node --check OK. */
/* ── v159 SI — SCHÉMAS AU RECTO (figures de changement de base). Nouveau mécanisme `qfig` : un schéma rendu CÔTÉ QUESTION (recto), pas dans l'explication — indispensable pour les cartes où l'on ne peut pas répondre sans voir la figure (ex. « figure de changement de base : exprimer x2 dans (x1,y1) », projections, vecteurs taux de rotation). Rendu via q._qfigHtml séparé de q.q → n'altère PAS le qHash (SRS/FSRS intacts). 21 figures de changement de base recréées en FIG (générateur paramétré axe/angle/bases : rotation θ ou α autour de x/y/z, deux bases orthonormées + angle + axe hors-plan ⊙), render-checkées (0 collision/NaN). Discernement : seules les cartes où la figure est NÉCESSAIRE à la compréhension reçoivent un qfig (les cartes torseur→liaison n'en reçoivent pas car la figure révélerait la réponse). node --check OK. */
/* ── v161 SI — SCHÉMAS NORMALISÉS DES LIAISONS (au recto). Les schémas normalisés de liaisons étant à connaître par cœur, chaque carte liaison/torseur affiche LE schéma normalisé de SA liaison, au recto (comme dans le deck Anki d'origine). Ces schémas ne sont PAS des recréations : ce sont les IMAGES EXACTES du cours de l'élève, récupérées du paquet Anki (colpkg → média zstd(protobuf) décompressé, mapping protobuf→n° de fichier, images elles-mêmes zstd) — perspective 3D + 2 projections planes avec repère. 10 liaisons (pivot, pivot glissant, hélicoïdale, glissière, linéaire annulaire, rotule, ponctuelle, appui plan, linéaire rectiligne, encastrement) définies UNE fois dans LIAISON_IMG (data-URI ~247 Ko, redimensionnées 420px) et référencées par clé sur 36 cartes via le champ `qimg` (rendu recto via q._qfigHtml, séparé de q.q → qHash/SRS INTACTS). node --check OK. */
/* ── v162 SI — SCHÉMAS DE LIAISONS : sphérique à doigt ajouté + corrections d'affectation. (1) Ajout du schéma normalisé du SPHÉRIQUE À DOIGT (11e liaison) : introuvable dans le paquet Anki de l'élève → récupéré sur le web (PDF de cours joho.p.free.fr, représentations plane NF EN ISO 3952-1 + spatiale NF E 04-015), page rendue puis recadrée à la région utile (pdftoppm -x -y -W -H) et redimensionnée (sips). (2) CORRECTIF : les 3 cartes « sphérique à doigt » étaient à tort affectées au schéma 'rotule' (la sous-chaîne « sphérique » matchait rotule avant « sphérique à doigt ») → corrigées. (3) Nettoyage : retrait du schéma sur 3 cartes de NOTIONS générales (classe d'équivalence, pivotement/roulement, positionner un point) qui mentionnaient une liaison sans en être le sujet. (4) Carte statique « torseur transmissible par encastrement » équipée. Bilan : 11 liaisons avec schéma normalisé (10 images exactes du cours + sphérique à doigt web), sur ~33 cartes liaison/torseur, au recto. Encastrement conservé = symbole normalisé minimal (norme : « raccordement de deux lignes »). q inchangés → SRS intact. node --check OK. */
/* ── v163 SI — SCHÉMAS DE LIAISONS : côté question vs côté réponse.
   Remarque élève : sur les cartes « Identifie la liaison à partir de ce torseur cinématique »,
   afficher le schéma normalisé AU RECTO donnait la réponse (le schéma montre la liaison à nommer).
   Nouveau champ `aimg` (answer-side image) : le schéma est accolé à `exp` et n'apparaît donc
   qu'avec la correction. Les 11 cartes « Identifie » basculées qimg→aimg (schéma côté réponse).
   Les 22 cartes où la liaison est NOMMÉE dans la question (« Donne le torseur cinématique de la
   liaison X », « Exprimer le torseur transmissible par une liaison X ») gardent le schéma au
   recto (il illustre sans spoiler — la réponse est le torseur). Champs qimg/aimg hors de q →
   qHash/SRS intacts. node --check OK. */
/* ── v164 SI — FICHE RÉCAP + CARTES DE SYNTHÈSE (liaisons). LOT 1 d'une série d'améliorations.
   (1) Fiche de synthèse « les 11 liaisons » : nouvelle carte si_liaisons avec champ `recap:"liaisons"` ;
       la normalisation appelle buildLiaisonRecap() qui construit un TABLEAU (schéma normalisé | liaison |
       DdL | torseur cinématique | torseur transmissible) à partir de const LIAISON_TAB + LIAISON_IMG.
   (2) 11 cartes de synthèse « schéma → nom + torseurs » (si_liaisons) : recto = schéma seul (qimg),
       réponse = nom + DdL + les deux torseurs. Chaque q rendue unique par une application typique
       (charnière, tiroir, vis-écrou…) pour éviter toute collision qHash.
   (3) 3 cartes « paires de confusion » (si_cinematique) : pivot glissant vs hélicoïdale (même torseur
       cinématique, 2 DdL indép. vs 1 DdL couplé par le pas), rotule vs rotule à doigt, appui plan vs ponctuelle.
   Torseurs EXTRAITS des cartes déjà déployées (source unique de vérité, aucun retype). 0 collision qHash
   (1283 q uniques). Rendu vérifié (serveur local + DOM) : tableau 11 lignes/11 images, réponses avec les 2
   torseurs MathJax. Additif, `q` inchangés → SRS intact. si_liaisons 6→18, total SI 303→318. node --check OK. */
/* ── v165 SI — LOTS 2 & 3. (2) CHAPITRE si_analyse REMPLI (était vide → badge « bientôt ») :
   15 cartes conformes au programme TSI1 compétence « A – Analyser » (semestres S1/S2) : besoin &
   exigences, diagrammes SysML (uc, req, bdd, ibd — à lire/compléter, PAS l'ancien SADT/APTE),
   analyse du cycle de vie, 3 piliers du développement durable, frontière d'étude & flux (matière/
   énergie/information), architecture fonctionnelle vs structurelle, chaînes fonctionnelles. Vérifiées
   par un agent adversarial contre le texte officiel du programme : 4 correctifs de conformité appliqués
   (retrait d'une formulation « bête à cornes » APTE → reformulée via le diagramme uc ; terme officiel
   « chaîne de puissance » au lieu de « chaîne d'énergie » ; ajout de « restituer » ; ACV multi-critères).
   (3) SCHÉMAS-BLOCS SLCI (moteur FIG, rendu vérifié, 0 NaN, 0 collision) : boucle d'asservissement
   fonctionnelle (consigne→comparateur→correcteur→système→sortie, retour capteur/mesure) attachée CÔTÉ
   RÉPONSE (fig) à « système asservi » ; schéma de Black E→ε→H(p)→S avec retour K(p) attaché au RECTO
   (qfig) aux cartes FTBO et formule de Black (FTBF). Additif, `q` inchangés → SRS intact. Total SI 318→333. node --check OK. */
/* ── v166 — MOTS DU JURY : PHYSIQUE-CHIMIE & SCIENCES DE L'INGÉNIEUR (auparavant maths only).
   Ajout d'un SÉLECTEUR DE MATIÈRE dans l'écran « mots du jury » (Mathématiques / Physique-chimie /
   Sciences de l'ingénieur) : JURY_THEMES_BY_SUBJECT (thèmes propres à chaque matière), JURY_SUBJECTS,
   filtrage de JURY_DATA par `subject` (défaut 'maths' pour l'existant → aucune entrée maths modifiée),
   couleurs et liens « s'entraîner sur ce thème » (JURY_THEME_TOPICS) étendus aux chapitres ph_* et si_*.
   Le conseil du jury du jour (accueil) affiche désormais la matière. 33 NOUVELLES entrées, rédigées comme
   SYNTHÈSES/citations FIDÈLES (dans nos mots, pas de copie in extenso) à partir des VRAIS rapports de jury
   publics : Centrale-Supélec TSI 2024 (Physique-chimie 1 & 2, Sciences industrielles S2I) et CCINP TSI 2023
   (Physique-chimie). 16 entrées physique + 17 entrées SI. Thèmes physique : méthode/rédaction, mécanique,
   électricité & électromagnétisme, ondes, thermodynamique, chimie. Thèmes SI : méthode, liaisons & schéma
   cinématique, cinématique & mouvement, statique & dynamique, asservissement (SLCI), chaîne de puissance,
   informatique & numérique. Rendu vérifié (harnais autonome + DOM). node --check OK. */
/* ── v167 SI — MODE « SPRINT AVANT UN DS » + SCHÉMA-BLOCS CHAÎNE INFO/PUISSANCE.
   (A) SPRINT (nouvelle fonctionnalité, bouton « 🏁 Sprint DS » à côté de l'Examen blanc) : révision
   intensive orientée échéance. On choisit dans combien de jours a lieu le DS/DM (aujourd'hui → 7 j),
   et `startSprint(days)` RAMÈNE toutes les cartes des chapitres sélectionnés qui seront dues d'ici cette
   date (pas seulement aujourd'hui), priorisées par urgence (retard) puis fragilité (oublis, intervalle
   court), + les cartes jamais vues. AUCUN plafond quotidien (bachotage assumé). La correction met à jour
   le SRS normalement (vraie révision). Cap 80/session (les plus prioritaires d'abord). Bouton + sélecteur
   injectés en JS (aucune modif de structure HTML). Vérifié : bouton, sélecteur, garde-fou « aucun chapitre ».
   (B) SCHÉMA-BLOCS chaîne d'information / chaîne de puissance (FIG, rendu vérifié, 0 NaN) : Acquérir→Traiter→
   Communiquer (haut), Alimenter→Distribuer→Convertir→Transmettre→action (bas), couplage « ordres » (info→
   puissance) et retour « compte-rendu (capteurs) » en pointillés. Attaché CÔTÉ RÉPONSE (fig) à la carte
   si_analyse « Qu'est-ce qu'une chaîne fonctionnelle ? ». Additif, `q` inchangés → SRS intact. node --check OK. */
/* ── v168 — 4 FONCTIONNALITÉS D'APPRENTISSAGE. (1) OBJECTIF QUOTIDIEN + SÉRIE : widget sous la barre
   SRS (accueil) montrant les cartes corrigées aujourd'hui (nouveau compteur d.daily.total dans SRS.review)
   vs une cible réglable (⚙, localStorage 10/20/30/50/80) + la série de jours consécutifs (déjà tenue par
   d.streak → SRS.streakCount()). (2) RADAR DE MAÎTRISE PAR FAMILLE : SVG dans le tableau de bord, score
   0-100 % par famille de la matière active (carte : jamais vue 0 · apprentissage 0,3 · jeune 0,6 · mature 1),
   met en évidence les familles à retravailler. (3) MODE COLLE (oral) : bouton « 🎤 Colle » ; chaque carte
   présentée en flashcard avec un CHRONO par question (réponds à voix haute → révèle → auto-évaluation qui
   écrit le SRS) ; puise dans les chapitres sélectionnés. (4) FORMULAIRE / RECHERCHE : bouton « 📖 Formulaire »,
   écran de recherche plein texte (question + réponse) dans la matière active, option « formules uniquement »,
   résultats groupés par chapitre. Boutons + écran + widget injectés en JS. Tout additif, `q` inchangés →
   SRS intact. Vérifié (DOM + rendus). node --check OK. */
/* ── v169 — CHAPITRE « CONTRIBUTION CITOYENNE » (socle pour l'import de cartes contribuées).
   Nouvelle matière TRANSVERSALE `contrib` (« Contributions », niveau Tr.) + famille `contrib_com`
   + chapitre `contrib_citoyenne` + 1 carte d'accueil/avertissement. But : accueillir des cartes
   proposées par la communauté (ex. générées à partir de photos de cours), VOLONTAIREMENT SÉPARÉES
   du contenu vérifié et ÉTIQUETÉES « non validées par un professeur ». La matière n'apparaît dans le
   sélecteur que parce qu'elle a désormais du contenu (subjectsWithContent). Additif, SRS intact. node --check OK. */
/* ── v170 — ACCÈS AUX ANNÉES INFÉRIEURES (les TSI2 peuvent réviser le TSI1). Auparavant chaque élève
   était verrouillé sur SA classe (lockedLevel → effLevel forçait lockedLevel ; menu de classe n'affichait
   que sa classe). Nouveau modèle : `allowedLevels()` = année de l'élève + TOUTES les années inférieures
   (TSI2 → {tsi0,tsi1,tsi2} ; TSI1 → {tsi0,tsi1} ; TSI0 → {tsi0}), JAMAIS au-dessus. `effLevel()` respecte
   désormais l'année choisie si elle est autorisée (sinon retombe sur la classe). Menu de classe : affiche
   les années autorisées (badge « ta classe » sur la sienne), bascule permise vers une année inférieure
   (avec garde `allowedLevels().includes`), + refresh matière/accordéon et réajustement de la matière active
   si indisponible au nouveau niveau. `startReviewForTopics` filtre sur allowedLevels. Admin inchangé (libre).
   Sécurité : un TSI1 ne peut toujours PAS accéder au TSI2 (montée interdite). Logique testée. node --check OK. */
/* ── v171 — (A) RETRAIT du chapitre « Contribution citoyenne » (contributions communauté abandonnées) :
   supprimés la matière transversale `contrib`, la famille `contrib_com`, le chapitre `contrib_citoyenne`
   et sa carte d'accueil (retour propre à l'état d'avant v169). (B) FIREBASE → TIER GRATUIT (Spark) : les
   2 Cloud Functions (qui exigeaient le plan payant Blaze) sont RETIRÉES du front. `setClassApproval` :
   l'écriture client du doc élève était déjà autoritative → on garde juste ça (approbation de classe OK).
   `deleteAccount` : la suppression passe désormais directement par le repli client `clientPurgeUser`
   (efface profil + sessions + pseudo + doc) avec messages propres — plus aucune erreur « fonction
   indisponible ». Seule limite du gratuit : le login Firebase (vide) d'un compte supprimé reste à retirer
   à la main dans la console → Authentication. Imports/défs getFunctions/httpsCallable supprimés. Auth +
   Firestore (comptes/synchro) tournent nativement sur Spark. Vérifié : init Firebase OK, 0 réf CF. node --check OK. */
/* ── v172 — PALIERS ENRICHIS + PARTAGE D'UNE IMAGE DE PROGRESSION. (Motivation #6.)
   Système de paliers étendu de 4 à 6 pistes : ajout de « 🧠 Rétention » (trueRetention mature, paliers
   70/80/90/95 %) et « 🗺️ Familles solides » (nb de familles à ≥70 % de maîtrise, via solidFamiliesCount()).
   Nouveau bouton « 📤 Partager ma progression » dans le tableau de bord : window.shareProgress() dessine
   un CANVAS 1080×1080 (dégradé, titre, 4 chiffres clés — série, cartes maîtrisées, % programme, rétention
   — + familles solides/réponses) puis PARTAGE natif (navigator.share avec le fichier PNG) si supporté,
   sinon TÉLÉCHARGEMENT. Aucune donnée personnelle (que des compteurs). Additif, SRS intact. Rendu vérifié. node --check OK. */
/* ── v174 — CLASSEMENT DE CLASSE (opt-in, anonymisable). (Motivation #7.) Bouton « 🏅 Classement » +
   écran injecté : participation VOLONTAIRE (défaut non), désactivable. À l'activation, publie une entrée
   MINIMALE dans la collection Firestore `leaderboard/{uid}` : nom affiché (au choix, ou pseudo), année de
   classe, série (SRS.streakCount), cartes des 7 derniers jours (reviewLog). L'écran lit la collection et
   filtre par année côté client, classé par série puis cartes de la semaine, l'élève surligné (« toi »).
   Aucune donnée sensible (ni note ni e-mail). NÉCESSITE des règles Firestore (leaderboard : read si
   authentifié, write si uid == auth.uid) — dégrade proprement si absentes. Additif, SRS intact. node --check OK. */
/* ── v175 — CLASSEMENT « D'OFFICE » + RETOUR ACCUEIL GLOBAL. (1) Participation AUTOMATIQUE au classement :
   retrait du panneau opt-in (case + nom) ; l'entrée est publiée dès qu'un élève connecté révise (hook fin
   de session flushSession) et à l'ouverture du classement (pseudo utilisé automatiquement). Un lien discret
   « Me retirer » en pied d'écran permet de sortir (localStorage quiztsi_lb_optin='0'). (2) RETOUR ACCUEIL :
   le TITRE du site (.brand) est désormais cliquable depuis n'importe quel écran → revient à l'accueil
   (flush si en plein quiz) ; l'écran classement a un bouton « 🏠 Accueil ». Additif, SRS intact. node --check OK. */
/* ── v176 — BOUTONS D'EN-TÊTE : 🏠 ACCUEIL + 🏅 CLASSEMENT. Ajout de deux boutons icône dans la barre
   d'outils de l'en-tête (.tool-bar, même format que 📊/📋/➕/🎓) : « 🏠 Accueil » (#homeIconBtn → goHomeSite,
   retour à l'accueil depuis tout écran) et « 🏅 Classement » (#lbIconBtn → showLeaderboard). Le titre du site
   reste aussi cliquable (goHomeSite factorisé). Le bouton Classement redondant de la rangée d'actions est
   retiré (il vit maintenant dans l'en-tête). Additif, SRS intact. node --check OK. */
/* ── v177 — FICHES DE COURS (lot 1/4) : SI complet + 6 chapitres Physique-Chimie. Signalement élève :
   « la partie cours est extrêmement incomplète » — audit : 1530 cartes/1998 n'avaient AUCUNE fiche (PC 0/763,
   SI 0/333, maths 434 manquantes). Ce lot : 110 NOUVELLES FICHES (NOTION_HTML, format maison cv-def/cv-theo/
   cv-prop/cv-meth/cv-ex/cv-warn) + 446 mappings CARD_NOTION — chapitres si_analyse, si_slci, si_chaine_energie,
   si_statique, si_liaisons, si_chaine_info, ph_optique_geo, ph_gaz_parfait, ph_oxydoreduction, ph_premier_ordre,
   ph_newton, ph_acide_base. Rédigées par agents-professeurs à partir des cartes ET des programmes officiels
   (SI TSI 2021 S1/S2, PC TSI1 2021), chaque fiche devant contenir exactement les définitions/lois/méthodes/pièges
   nécessaires à CHAQUE carte rattachée ; vérifiées par agents adversariaux (précision carte↔fiche, conformité,
   exactitude — corrections appliquées, ex. domaine de validité du torseur cylindre-plan, signes de la décomposition
   harmonique, conventions flux/effort). Intégration sous garde-fous (couverture 100 %, clés uniques, HTML whitelist,
   0 écrasement). `q` inchangés → SRS intact. node --check OK. Lots suivants : 9 chapitres PC du lot A, PC lot B (13), maths (24). */
/* ── v178 — FICHES DE COURS (lot 2/4) : SI cinématique + 8 chapitres Physique-Chimie → SI couvert à 100 %,
   lot A de PC (14 chapitres) complet. +79 fiches (NOTION_HTML) + 340 mappings (CARD_NOTION) : si_cinematique,
   ph_arqs, ph_machines_therm, ph_premier_principe, ph_molecules, ph_cinematique, ph_energie_echangee,
   ph_second_ordre, ph_energie_meca. Même méthode que v177 (rédaction vs programmes officiels, vérification
   adversariale carte par carte avec corrections appliquées : ex. règle de l'octet pour H, angle VSEPR H3O+,
   définition de l'ARQS, rigueur de la démonstration de Carnot irréversible, C_p/C_V définis sans dérivées
   partielles (hors TSI1), signes des angles des figures de changement de base). Total : 266 fiches, 1259 cartes
   avec cours. `q` inchangés → SRS intact. node --check OK. Reste : PC lot B (13 chapitres), maths (24). */
/* ── v179 — FICHES DE COURS (lot 3/4) : les 13 derniers chapitres Physique-Chimie → PC couvert à 100 %
   (SI l'était depuis v178). +106 fiches (NOTION_HTML) + 309 mappings (CARD_NOTION) : ph_second_principe,
   ph_filtrage, ph_solide_rotation, ph_structure_prop, ph_cinetique, ph_convertisseurs, ph_transfo_matiere,
   ph_propagation, ph_induction_lois, ph_circuit_fixe, ph_circuit_mobile, ph_champ_magnetique, ph_laplace.
   Même méthode (rédaction vs programme officiel PC TSI1 2021, vérification adversariale carte par carte —
   corrections : hydratation des anions = ion-dipôle et non liaison H (Cl hors N/O/F), hypothèse B ⊥ plan des
   rails pour la résultante de Laplace, loi de Dalton nuancée, f0 en Hz, transformateur ≠ machine tournante).
   Total : 372 fiches, 1568 cartes avec cours sur 1998. `q` inchangés → SRS intact. node --check OK.
   Reste : maths, 24 chapitres à trous (434 cartes). */
/* ── v180 — FICHES DE COURS (lot 4a) : 10 chapitres de MATHS (+63 fiches, +183 mappings) — integration,
   derivation, ev, dimension_finie, ensembles, trigo, matrices, matrices_al, applications_lineaires,
   tvi_bijection. Consigne : réutiliser une fiche existante SI elle couvre vraiment la carte, sinon en créer
   une. La vérification adversariale a montré que beaucoup de fiches historiques n'étaient que des résumés de
   2-3 lignes (int-tech ne donnait l'IPP que sous forme de formule sans hypothèses ni exemple ; int-prop
   écrivait « Linéarité » en gras sans la formule ; der-calc listait des dérivées sans l'argument de voisinage
   pour 1/f) → remplacées par de vraies fiches complètes (int-ipp, int-chgt-var, int-lin-chasles, int-ineg,
   int-formes, der-op, der-af, der-extremum, der-cinf…), avec hypothèses conformes au B.O. TSI1, exemples
   traités et pièges. Total : 435 fiches, 1751/1998 cartes avec cours. Contrôles : couverture 100 %, clés
   uniques, HTML whitelist, balises équilibrées (nouveau garde-fou : attrape un « < » mathématique suivi d'une
   variable qui ouvrirait une balise), 0 mapping cassé. `q` inchangés → SRS intact. node --check OK.
   Reste : 14 chapitres de maths (rédaction interrompue par des erreurs serveur 529, à relancer). */
/* ── v181 — CORRECTIFS D'AFFICHAGE LaTeX + un renvoi de fiche erroné (issus de la vérification des
   fiches de cours). (1) SUR-ÉCHAPPEMENT : 4 cartes contenaient « \\to », « \\vec », « \\alpha », « \\in »…
   Or « \\ » est un SAUT DE LIGNE pour MathJax : la formule s'affichait cassée. Corrigé À LA SOURCE dans les
   champs answer/exp (6 champs : q1ofrsaw, qlt5uzl ×2, q17ajzzw ×2, qbgq1yk) ; pour les 2 ÉNONCÉS concernés
   (qlt5uzl, q17ajzzw), q ne doit jamais changer (qHash/SRS) → réparation À L'AFFICHAGE dans qHTML, appliquée
   uniquement hors environnements (matrix/array/cases) où « \\ » sépare légitimement les lignes ; testé :
   énoncés réparés, matrices intactes, hash inchangés. (2) La carte « formule de Taylor-Young » renvoyait à la
   fiche der-classe (classes C^k), qui ne contient pas Taylor-Young → renvoi corrigé vers dl-def (qui l'énonce).
   Aussi vérifié : le « théorème de la limite de la dérivée » (q1ofrsaw) est bien signalé hors-programme TSI1
   dans son explication. Aucun énoncé modifié → SRS intact. node --check OK. */
/* ── v182 — FICHES DE COURS : COUVERTURE 100 % (lot 4b, dernier). +112 fiches, +251 mappings et 42 RENVOIS
   AMÉLIORÉS pour les 14 derniers chapitres de maths (fonctions, limites, va, proba, suites, sommes, geoespace,
   geoplan, systemes, polynomes, complexes, edl, dl, denombrement). BILAN DU CHANTIER (v177→v182) : au départ
   1530 cartes sur 1998 n'avaient AUCUNE fiche de cours (PC 0/763, SI 0/333, maths 434 manquantes) ; désormais
   **1998/1998 cartes (100 %) ouvrent un cours** — 547 fiches au total. Chaque fiche a été rédigée à partir des
   CARTES et du PROGRAMME OFFICIEL (maths TSI1, PC TSI1 2021, SI TSI S1/S2) puis relue par un vérificateur
   adversarial contrôlant carte par carte « un élève qui rate cette carte trouve-t-il ici de quoi comprendre ? ».
   Corrections notables de ce lot : justification de e^x ≥ 1+x par la convexité (HORS programme TSI1) remplacée
   par l'étude de φ(x)=e^x−1−x ; hypothèse P(A∩B)\gt 0 ajoutée à la forme « rapport » de Bayes (fausse pour des
   événements incompatibles) ; crible à 3 événements réétiqueté hors-programme (TSI1 n'exige que l'union de deux) ;
   accents retirés des \text{} en mode math (rendu KaTeX) ; formalisme quantifié des limites complété.
   Les 42 « renvois améliorés » réorientent des cartes DÉJÀ couvertes dont la fiche historique était un résumé de
   2-3 lignes (ex. « Produit scalaire » télégraphique) vers les nouvelles fiches complètes. Aucun énoncé modifié
   → qHash/SRS intacts. Contrôles : couverture 100 %, 0 mapping cassé, 0 clé dupliquée, balises équilibrées sur
   les 547 fiches, node --check OK. */
/* ── v183 — MODE « COURS » : les 547 fiches deviennent un vrai livre consultable. Jusqu'ici NOTION_HTML
   n'était accessible qu'en RATANT une carte (lien « 📖 » de la correction) : tout ce contenu était invisible
   en lecture directe. Nouveau bouton « 📚 Cours » dans la barre d'icônes + écran #coursScreen injecté, à
   3 niveaux : Chapitres (de la matière/année active, triés dans l'ordre du programme, avec le nombre de
   fiches) → Notions du chapitre (numérotées) → Fiche, avec navigation ◀ Précédent / Suivant ▶ et compteur
   « i / n ». L'index est reconstruit au vol depuis CARD_NOTION (une fiche appartient au chapitre des cartes
   qui la référencent ; l'ordre des cartes dans QUESTIONS donne l'ordre pédagogique) — donc aucune donnée
   nouvelle à maintenir : toute fiche ajoutée apparaît automatiquement. Lecture seule : aucune écriture SRS,
   aucun énoncé touché. Vérifié : 31 chapitres / 278 fiches en maths, navigation et rendu MathJax OK. node --check OK. */
/* ── v183 (session parallèle) MOT DU JURY : +15 entrées CCINP TSI 2025 (SI, physique-chimie, maths) + 4 correctifs de signalements (exp/answer). */  /* ── v185 — FRÉQUENCE AU CONCOURS : « pourquoi j'apprends ça ». Nouvelle table ANNALES_FREQ (56 chapitres)
   recensant les sessions où chaque chapitre est RÉELLEMENT tombé. DONNÉES ÉTABLIES SUR DOCUMENTS OFFICIELS,
   pas de mémoire ni d'estimation : 9 sujets CCINP TSI (maths, physique-chimie, SI — sessions 2024, 2025, 2026)
   téléchargés depuis concours-commun-inp.fr, et 4 rapports de jury Centrale-Supélec TSI (2019, 2021, 2022,
   2024) qui détaillent le contenu de chaque épreuve. Méthode : 13 agents-professeurs ont dépouillé un document
   chacun avec OBLIGATION DE CITER littéralement l'extrait prouvant qu'un chapitre est mobilisé (pas de citation
   = pas de chapitre) ; 13 vérificateurs adversariaux ont ensuite recherché chaque citation dans le fichier et
   supprimé les non retrouvées, les simples mentions et les mauvaises attributions. Résultat : 0 clé inventée.
   AFFICHAGE : (1) pastille « 🔥 7× / 🎯 2× » à côté du nom du chapitre dans la liste de sélection (tooltip :
   années + concours) pour prioriser les révisions à fort rendement AVANT de réviser ; (2) ligne détaillée sur
   la correction de chaque carte : « 🔥 Au concours — « SLCI » est tombé en 2019, 2021, 2022, 2024, 2025, 2026
   (CCINP, Centrale-Supélec) · chapitre à fort rendement ». Score = 2 par apparition majeure + 1 par mineure ;
   niveaux : ≥8 fort rendement (🔥), ≥4 fréquent, sinon déjà tombé. Un chapitre sans donnée n'affiche RIEN
   (absence de preuve ≠ preuve d'absence). Purement informatif : aucun impact SRS, aucun énoncé touché. */
/* ── v186 — CORRECTIF : le Cours et la Progression ne montraient QUE les mathématiques. Les deux écrans
   filtraient sur `inActiveScope()`, c'est-à-dire sur la matière active choisie depuis l'ACCUEIL : un élève
   qui n'y avait pas basculé ne voyait jamais la physique-chimie ni la SI (224 fiches PC et 100 fiches SI
   restaient invisibles, et le radar de maîtrise ne parlait que des maths). Ajout d'un helper de scope
   indépendant — `scopeLevelFor(subject)` + `inScopeOf(topic, subject)` — puis d'un SÉLECTEUR DE MATIÈRE
   propre à chaque écran : `_courseSubject` (barre de matières dans l'écran Cours) et `_radarSubject`
   (barre au-dessus du radar de maîtrise, re-rend les stats au clic). La matière active de l'accueil n'est
   plus touchée : basculer de matière dans le Cours ne perturbe plus la sélection de révision.
   Vérifié en conditions réelles : Cours → Mathématiques 31 chapitres, Physique-Chimie 27 chapitres /
   224 fiches, Sciences de l'Ingénieur 7 chapitres. node --check OK. */
/* ── v187 — FRÉQUENCE AU CONCOURS : base élargie de 13 à 44 DOCUMENTS, de 6 à 13 SESSIONS (2014→2026).
   Corpus téléchargé depuis les sites officiels : 40 sujets CCINP TSI (maths, physique-chimie, sciences
   industrielles, sessions 2014 à 2026 — liens relevés sur la page « Annales TSI » de concours-commun-inp.fr,
   dont les conventions de nommage changent chaque année) + 7 rapports de jury Centrale-Supélec TSI (2015,
   2016, 2017, 2019, 2021, 2022, 2024), qui détaillent le contenu de chaque épreuve. 44 agents-professeurs
   ont dépouillé un document chacun. NOUVEAUTÉ MÉTHODE : les citations ne sont plus relues par un modèle mais
   VALIDÉES MÉCANIQUEMENT (recherche exacte du passage dans le fichier, tolérante aux espaces, avec repli sur
   la plus longue suite de mots) — plus fiable et sans coût : 563 observations proposées, 558 retenues,
   5 rejetées automatiquement (citation introuvable ou trop courte). 63 chapitres documentés.
   Un cas notable : l'extraction du sujet PC 2014 sortait chiffrée (police à codage décalé de 29) ; contrôle
   fait, l'agent l'avait correctement déchiffrée et ses citations sont littérales vis-à-vis du fichier.
   AFFICHAGE RECALIBRÉ : le niveau se juge désormais au nombre de SESSIONS (≥8/13 = fort rendement 🔥,
   ≥4 = fréquent 🎯) et non plus au score brut ; la pastille affiche « 12/13 » ; au-delà de 5 sessions la
   ligne de correction résume (« tombé lors de 12 des 13 sessions analysées (2014-2026), dont 2024, 2025,
   2026 ») au lieu d'aligner douze années. Un chapitre sans donnée n'affiche toujours RIEN. SRS intact. */
/* ── v188 — GEOGEBRA REMPLACÉ PAR DES FIGURES 3D MAISON (signalement élève : « le module GeoGebra est bien
   insatisfaisant, quand il ne bugue pas c'est presque incompréhensible »). CAUSE : les 18 explorateurs
   chargeaient deployggb.js depuis geogebra.org — donc HORS SERVICE hors ligne et tributaires d'un tiers —
   puis affichaient une vue 3D brute, sans repères ni consigne de lecture.
   REMPLACEMENT : moteur FIG3D écrit pour l'app (projection orthographique paramétrée par un azimut, tri des
   faces façon peintre, primitives plane / para / box / sphere / vector / segment / point), rendu en SVG
   inline aux couleurs du thème, étiquettes MathJax comme partout ailleurs. Chaque figure porte une phrase
   « 👁 à observer » et deux boutons ◀ ▶ qui la font PIVOTER (l'exploration est conservée, sans la complexité).
   Les 18 specs GeoGebra ont été converties par des agents-professeurs, puis chacune a subi un CONTRÔLE DE
   RENDU automatique : JSON valide, aucun NaN, ≥2 éléments graphiques, et rendu re-testé sous 4 azimuts
   (0/90/180/270°) pour garantir qu'elle ne casse pas quand l'élève tourne — 18/18 validées, 0 rejet.
   Le module GeoGebra (GGB_REG, ggbOpen, ggbLoadDeploy, bouton « Explorer en 3D », CSS) est SUPPRIMÉ :
   plus aucun appel réseau vers geogebra.org, l'app redevient entièrement hors-ligne. Champ `fig3d` rendu
   dans `exp` comme `fig` → énoncés `q` inchangés, SRS intact. node --check OK. */
/* ── v189 — SCAN COMPLET DES 1998 CARTES : +71 FIGURES 3D (physique-chimie, SI ET maths) + anti-collision
   des étiquettes. Demande : « fais un scan entier des cartes et rajoute des schémas 3D quand nécessaire,
   je pense aussi aux cartes de physique et SI, pas seulement maths ».
   MÉTHODE : repérage mécanique de 452 cartes au vocabulaire spatial, puis TRI SÉVÈRE par 13 agents-professeurs
   (un par chapitre) avec un critère double — la notion doit être intrinsèquement spatiale ET la figure doit
   réellement aider à comprendre ; consigne explicite d'écarter définitions, formules, calculs numériques et
   cartes déjà pourvues d'un schéma 2D suffisant (schémas de Lewis, liaisons normalisées). Résultat : 288 cartes
   examinées → 71 retenues (25 %), soit 38 en physique-chimie, 20 en SI et 13 en maths (89 figures 3D au total
   avec les 18 issues de GeoGebra). Exemples : H2O et NH3 (les doublets non liants SORTENT du plan, d'où 104,5°
   et la pyramide), maille de NaCl (compter 8 sommets + 6 faces est impossible sur une coupe plane), partage
   1/8-1/4-1/2 d'un atome entre mailles, formule de Varignon (le terme BA∧Ω perpendiculaire aux deux vecteurs),
   vitesse d'un point en rotation (distance à l'AXE et non OM — l'erreur classique), moment d'une force avec
   bras de levier, liaisons sphère-cylindre et cylindre-plan (contact cercle / droite).
   MOTEUR AMÉLIORÉ : les étiquettes sont désormais placées avec ÉVITEMENT DE COLLISION (placement glouton en
   spirale, largeur estimée d'après le texte) — mesuré sur les 89 figures et sous 4 angles de rotation, les
   chevauchements tombent de 60 figures (dont 14 sévères) à 6 figures avec un seul chevauchement, 0 sévère.
   Relecture des 71 phrases « à observer » : 23 corrigées (accents et orthographe).
   Contrôles : 71/71 figures validées au rendu, 89/89 rendues sans erreur sous 4 azimuts, `q` inchangés → SRS intact. */
/* ── v190 — AUDIT COMPLET DU SITE : deux textes TRONQUÉS à l'affichage, corrigés. Un « < » brut suivi
   d'une lettre est interprété par le navigateur comme le début d'une balise : tout ce qui suit DISPARAÎT.
   Deux cartes étaient concernées et personne ne pouvait le voir dans le source : (1) l'énoncé « Relation de
   Chasles pour les sommes ($p\lt m\le n$) : … » ne s'affichait que jusqu'à « ($p » — la formule demandée
   était invisible ; (2) la réponse d'une carte SLCI sur les conditions de Heaviside coupait à « pour $0 ».
   CORRECTIFS : la réponse est corrigée à la source (\lt) ; l'énoncé, lui, ne doit JAMAIS changer (qHash/SRS)
   → réparation à l'AFFICHAGE dans qHTML, qui échappe les « < » bruts AVANT de reconstituer les balises de
   gras. Vérifié : hash inchangé (qxwotij), énoncé complet, \lt b\gt toujours converti, inégalités LaTeX et
   sauts de ligne des matrices intacts. AUDIT MÉCANIQUE par ailleurs : 1998 cartes, 749/749 figures 2D et
   89/89 figures 3D se rendent sans erreur, 0 collision de hash, 0 QCM sans bonne réponse, 0 renvoi de cours
   cassé, LaTeX équilibré partout. Restent signalés (sans correction unilatérale) : 1 carte en double entre
   deux chapitres, 6 cartes à trou utilisant « ___ » au lieu de « □ », 8 chapitres déclarés sans carte. */
/* ── v191 — AUDIT DE COHÉRENCE DES 89 FIGURES 3D : 27 figures corrigées + 1 défaut du moteur.
   Trois agents-professeurs ont REFAIT LES CALCULS de chaque figure (produits scalaires, produits vectoriels,
   produits mixtes, angles, décomptes cristallographiques). VERDICT DE FOND : aucun contresens, aucune erreur
   de calcul, rien de faux — les 20 produits vectoriels de physique (F=I·L∧B, Γ=m∧B, sens des courants
   induits) sont exacts, orientation comprise. Mais des défauts de FORME trahissaient le fond :
   (1) FIGURES QUI CONTREDISAIENT LEUR LÉGENDE : la flèche « champ faible à l'extérieur » du solénoïde était
   plus LONGUE que les flèches intérieures (et tracée dans la bobine) ; sur les bobines de Helmholtz, la
   distance annoncée « égale au rayon » était dessinée deux fois plus petite ; une flèche censée mesurer
   ‖u∧v‖=2,24 était tracée à 1,5. Corrigé : spires redessinées en vrais cercles parcourus par I, B_ext ramené
   au tiers et repoussé hors de la bobine, d=R lisible à l'œil, longueurs recalculées.
   (2) HORS-PROGRAMME : une figure introduisait le CHAMP ÉLECTROMOTEUR, explicitement exclu du programme
   TSI1, alors que la carte raisonne par le flux → figure et phrase recentrées sur Φ=Bℓx.
   (3) CONVENTION INCOHÉRENTE : le moment dipolaire allait de δ- vers δ+ sur une carte et l'inverse sur deux
   autres → convention unique (δ+ → δ-) appliquée aux trois figures et affirmée dans chaque légende.
   (4) Deux figures entièrement planes rendues en perspective → vue redressée (elev 90).
   (5) BUG DU MOTEUR : le cadrage n'échantillonnait que 2 des 4 coins d'un plan, d'où des étiquettes hors
   cadre sur 8 figures → les quatre coins sont désormais pris en compte ; mesuré : 0 débordement sur 89.
   Contrôles après correction : 27/27 specs valides et rendues sans erreur sous 4 azimuts, défauts re-mesurés
   un par un (B_ext 0,40 vs B_int 1,20 · d=1,00=R · flèche 2,00=‖u∧v‖ calculé · elev 90 · plus aucune mention
   du champ électromoteur). `q` inchangés → SRS intact. */
/* ── v192 — MODE COLLE : la consigne était INVISIBLE. Signalement élève : « je ne comprends pas le mode
   colle ». À l'usage il n'y avait qu'un chronomètre qui apparaissait en haut à droite : rien ne disait ce
   qu'on attendait, l'écran ressemblait à une révision ordinaire. Ajouts : (1) un BANDEAU DE CONSIGNE au-dessus
   de chaque question — « réponds à voix haute, comme au tableau devant le colleur : énonce la définition ou le
   théorème en entier, avec ses hypothèses ; vise moins d'une minute ; puis affiche la réponse et évalue-toi » ;
   (2) le chronomètre porte désormais son objet (« ta réponse orale ») et passe en ORANGE au-delà d'une minute,
   pour donner un repère de temps de colle ; (3) le bouton s'appelle « 🎤 Colle blanche » (au lieu de « Colle »),
   par analogie avec l'examen blanc déjà présent. Le bandeau disparaît en quittant le mode. Aucune modification
   du fonctionnement : mêmes cartes, même auto-évaluation qui alimente le SRS. node --check OK. */
/* ── v193 — LE MODE COLLE DEVIENT UN VRAI ENTRAÎNEMENT SUR EXERCICES. Signalement élève : le mode
   proposait des flashcards de révision chronométrées, or une khôlle ce n'est pas réciter des définitions,
   c'est CHERCHER un exercice au tableau avec un colleur qui relance. Le mode est entièrement refait :
   • NOUVELLE BANQUE : 61 exercices de colle rédigés, couvrant les 58 chapitres pourvus en cartes
     (24 maths, 27 physique-chimie, 10 SI) — chacun avec énoncé, durée conseillée, difficulté,
     3 à 4 RELANCES progressives (les questions que pose le colleur quand on sèche), une solution
     entièrement rédigée et un encart « ce que regarde le colleur » sur le piège classique.
     Ces exercices vivent dans COLLE_EX, séparés de QUESTIONS : ils n'entrent PAS dans le SRS
     (ce ne sont pas des cartes, aucun hash de carte n'est touché), mais leur historique est conservé
     dans d.colleEx pour ne pas retomber sur les mêmes.
   • NOUVEL ÉCRAN dédié (#colleScreen) : énoncé → recherche chronométrée (le chrono passe en orange
     au-delà de la durée conseillée) → coups de pouce à la demande → solution → auto-évaluation en
     3 niveaux (trouvé seul / avec les relances / pas trouvé).
   • TIRAGE : 3 exercices, en privilégiant les chapitres cochés, les exercices jamais traités puis ceux
     qui ont résisté ; un exercice par chapitre distinct tant qu'il y a assez de chapitres cochés
     (vérifié : 0 doublon sur 20 tirages). Si aucun chapitre coché n'a d'exercice, on élargit à la
     matière plutôt que de bloquer, en le disant.
   • BILAN de fin : note indicative sur 20, temps de recherche, relances utilisées, récapitulatif par
     exercice et appréciation adaptée au profil de la session.
   L'ancien mode (flashcards + chrono flottant, v192) est supprimé, ainsi que son couplage à renderQuestion.
   Vérifié en navigateur sur banc d'essai : lancement, relances, solution, notation, bilan, MathJax. */
/* ── v194 — LE MODE COLLE PREND LA STRUCTURE RÉELLE D'UNE KHÔLLE. Correction élève : « une khôlle =
   1 question de cours théorique, puis exo de chauffe, enfin exo difficile ». La v193 tirait 3 exercices
   de même nature dans 3 chapitres différents : c'était faux sur les deux plans. Refonte :
   • UNE KHÔLLE PORTE SUR UN SEUL CHAPITRE, tiré parmi ceux cochés (en privilégiant les moins collés
     récemment), et se déroule en TROIS TEMPS : question de cours → exercice de chauffe → exercice difficile.
   • NOUVELLE BANQUE COLLE_COURS : 58 questions de cours théoriques, une par chapitre pourvu — « énoncer
     et démontrer », avec l'ATTENDU ENTIÈREMENT RÉDIGÉ et une GRILLE DE 3 À 5 POINTS DE CONTRÔLE que l'élève
     coche (« a énoncé l'hypothèse de continuité », « a écrit F'O = -f' et non +f' »). Ce sont ces points
     qui font la note du temps 1, pas une impression globale.
   • 58 EXERCICES DE CHAUFFE ajoutés (d=1) : application directe en 5 à 10 min, 2-3 relances, solution
     rédigée, piège classique. Les 61 exercices de la v193 deviennent les exercices DIFFICILES ; trois
     d'entre eux, marqués d=1 à tort, sont reclassés d=2 (sinon leur chapitre perdait son exercice difficile).
   • BARÈME de khôlle : cours /6, chauffe /6, difficile /8. Le bilan diagnostique le PROFIL en 8 cas
     distincts et exacts — cours fragile mais exercices réussis, ou cours su et application ratée, ne
     reçoivent pas le même conseil.
   Contenu produit et vérifié par des agents correcteurs (calculs refaits, conformité au programme TSI1),
   puis validé mécaniquement : 0 défaut sur 116 productions (LaTeX apparié, aucun « < » avalé, accents, format).
   Déroulé complet rejoué en navigateur SUR LES 58 CHAPITRES : 0 échec, sans-faute = 20/20.
   CORRECTIF CONNEXE : les bascules d'écran étaient dupliquées à 12 endroits et coursScreen ne figurait
   dans AUCUNE — deux écrans pouvaient rester superposés. Remplacées par un hideScreens() unique. */
/* ── v195 — CORRECTIF URGENT : PERTE DE PROGRESSION EN MODE COLLE. Les v193/v194 appelaient
   SRS._save() SANS ARGUMENT à chaque notation d'exercice en colle. Or _save(d) attend l'objet de
   données : sans argument, JSON.stringify(undefined) vaut undefined et le stockage recevait la chaîne
   « undefined ». Au chargement suivant, JSON.parse échouait et l'application repartait sur
   {cards:{},sessions:[]} : TOUTE LA PROGRESSION SRS DE L'ÉLÈVE ÉTAIT EFFACÉE (cartes, séries, historique),
   dès la première note posée en mode colle. Corrigé par colleRecord(), qui lit, modifie et sauve le
   MÊME objet, comme le reste du code (SRS._save(d)). Les élèves qui n'ont pas lancé de colle depuis la
   v193 ne sont pas concernés ; ceux qui l'ont fait ont pu perdre leur progression locale — la sauvegarde
   distante du compte, elle, n'était pas touchée. Aucune autre modification dans cette version. */
/* ── v196 — HISTORIQUE DES COLLES + 4 correctifs issus d'une revue adversariale.
   NOUVEAU : chaque colle terminée est archivée (d.colleLog, 300 dernières) et consultable par
   « 📋 Mes colles » (accueil et bilan) : nombre de colles, moyenne, meilleure note, temps total,
   courbe d'évolution des notes, puis la liste dépliable — pour chaque colle, la date, le chapitre,
   la note, et POUR CHACUN DES TROIS TEMPS le résultat, le temps passé et le sujet exact traité.
   CORRECTIFS (revue par agents, 9 confirmations correspondant à 4 défauts distincts) :
   • Historique, dépliage : b.querySelector('span:last-child') ne désignait PAS le chevron mais la
     ligne « date · durée » (premier descendant dernier-enfant-de-son-parent en ordre document), qui
     était donc écrasée par « ▴ » au premier clic ; la date et le temps de la colle disparaissaient
     jusqu'à un rechargement de l'écran. Le chevron porte maintenant un marqueur data-fleche.
   • Tirage élargi : quand aucun chapitre coché n'a de colle complète, l'avertissement était écrit dans
     #poolInfo, qui appartient à l'écran d'accueil que showColleScreen() venait de masquer — l'élève
     était donc interrogé sur un chapitre non coché sans jamais voir l'explication. L'avertissement
     s'affiche désormais dans l'écran de colle et survit aux changements de temps.
   • Aperçu du sujet dans l'historique : le garde-fou de troncature comptait la parité des « $ » et ne
     voyait donc pas $$…$$ (deux dollars ouvrants = compte pair) ; une coupure au milieu d'une formule
     centrée était archivée définitivement et s'affichait en LaTeX source. Les délimiteurs sont
     maintenant rejoués ($, $$, \$ échappé) pour reculer avant toute formule ouverte. Vérifié sur les
     58 questions de cours et sur des cas construits : 0 formule laissée ouverte.
   • Bilan de fin : aucun typeset() n'était appelé, les intitulés d'exercices restaient en LaTeX brut. */
/* ── v197 — CLASSEMENT FIGÉ SUR L'ANCIENNE CLASSE. Signalement élève : « j'ai changé de classe et
   ça me met toujours dans le classement TSI1 ». Cause : l'année de classe vivait en QUATRE exemplaires
   — lockedLevel, activeLevel, quiztsi_profile.annee (déclaré à l'inscription) et le champ `annee` du
   document leaderboard — que rien ne resynchronisait. _lbClassYear() donnait la priorité au profil
   figé sur la classe réellement choisie : changer de classe dans l'application n'avait donc AUCUN effet
   sur le classement, et l'entrée publiée gardait indéfiniment l'ancienne année.
   Correction structurelle, pour que le cas ne se reproduise pas :
   • classeCourante() est désormais la SEULE source de vérité, avec un ordre explicite : classe
     verrouillée (élève membre d'une classe) > classe choisie dans l'application > année d'inscription
     en dernier recours. _lbClassYear() n'est plus qu'un alias.
   • changerClasse(lvl) est le SEUL point d'écriture : il met à jour l'état, le profil local ET republie
     l'entrée du classement. Le menu de classe passe par lui ; il refuse les valeurs invalides et les
     classes non autorisées.
   • Un élève VERROUILLÉ qui ouvre une année antérieure ne change pas de classe (il révise du programme
     plus ancien) : son profil n'est pas réécrit, sans quoi il aurait été reverrouillé sur la mauvaise
     classe au chargement suivant et sorti de son classement.
   Vérifié sur 5 scénarios : admin changeant de classe, profil figé, élève verrouillé consultant une
   année antérieure, classe non autorisée, valeur invalide. */
/* ── v198 — « JE SUIS EN TSI2 » : IL ÉTAIT IMPOSSIBLE DE CHANGER D'ANNÉE. La v197 corrigeait la
   source de vérité, mais le fond du problème restait : l'année vient du profil DISTANT
   (users/{uid}.profile.annee), écrit UNE SEULE FOIS à l'inscription et réappliqué à chaque
   chargement par applyPreferredLevel() — aucun écran ne permettait de le modifier. Tout élève
   passant de TSI1 en TSI2 restait donc classé, et orienté, dans son ancienne classe pour toujours.
   AJOUT : declarerAnnee(lvl) — le geste manquant, à distinguer de la navigation (qui sert seulement
   à consulter le programme d'une autre année). Il écrit le profil local ET le profil distant,
   met à jour la classe verrouillée, republie l'entrée du classement et rafraîchit l'interface.
   ACCÈS : dans le pied de l'écran Classement, là où le problème se constate — « Tu es classé en
   TSI1. Passé en année supérieure ? Déclare ta classe : TSI0 · TSI2 », avec confirmation. */
/* ── v199 — VUE PROF, « CARTES LES PLUS RATÉES » : LE CLASSEMENT DÉSIGNAIT LA MAUVAISE CIBLE.
   La section agrégeait les réponses de toute la classe sans jamais compter les ÉLÈVES : une carte
   ratée 9 fois par UN élève acharné passait devant une carte ratée par 10 élèves sur 12. Or pour
   préparer une colle ou un DS, c'est exactement l'inverse qui est utile — la première relève d'une
   remédiation individuelle, la seconde d'un point à reprendre en cours.
   • Le score de Wilson porte désormais sur la PART D'ÉLÈVES EN ÉCHEC (élèves ayant raté au moins une
     fois / élèves ayant vu la carte), et non sur le total des réponses. Le lissage joue le même rôle
     qu'avant : une carte vue par 2 élèves ne dépasse pas une carte vue par toute la classe.
     Sur un cas type : la carte à 1 seul élève passe de la 1re à la 4e place, celle à 10 élèves de la
     4e à la 2e.
   • Chaque ligne affiche la diffusion — « 8 élèves sur 12 » — en rouge au-delà de la moitié de la
     classe, avant le détail des réponses et du temps.
   • Performance : la table hash -> carte (≈2000 entrées) était reconstruite à CHAQUE frappe dans le
     champ de recherche, paintAdmin() étant rappelé sur oninput. Elle est mémoïsée : 1,27 ms -> 0,02 ms
     par frappe. Gain modeste mais gratuit.
   Bug évité au passage : le compteur d'élèves avait d'abord été nommé `rate`, déjà utilisé pour le
   TAUX d'échec — le spread de l'objet écrasait l'un par l'autre et la ligne aurait affiché
   « 0.75 élèves sur 4 ». Renommé enEchec. */
/* ── v200 — MODE « ORAL CENTRALE » : la forme réelle des épreuves du concours, informatique comprise.
   Demande élève : « je veux que les khôlles soient type concours oraux de Centrale, sans oublier l'info ».
   Format établi sur les RAPPORTS DE JURY officiels Centrale TSI (2015 à 2024, sources primaires) :
     • Mathématiques        — 30 min, SANS préparation, un ou deux exercices au tableau ;
     • Mathématiques-info   — 30 min de préparation puis 30 min ; le passage commence SYSTÉMATIQUEMENT
       par 5 minutes devant l'ordinateur, partie qui « représente entre 20 % et 25 % de la note finale » ;
     • Physique-chimie      — 30 min, SANS préparation, un exercice court proche du cours ;
     • PC-informatique      — 30 min de préparation puis 30 min, situation fortement contextualisée.
   Les TP (3 h en PC, 4 h en S2I) ne sont pas repris : ils supposent un système réel et du matériel.
   • 39 PLANCHES d'oral : 12 maths, 9 maths-info, 12 PC, 6 PC-info. Chacune enchaîne 2 à 4 questions
     progressives, avec les RELANCES de l'examinateur et une grille de critères du jury.
   • INFORMATIQUE : la matière était déclarée dans l'application mais n'avait AUCUN chapitre ni carte.
     Les 15 chapitres du programme officiel TSI sont créés (11 en TSI1, 4 en TSI2), en trois familles.
     Ce qui n'est pas au programme TSI a été écarté après vérification du texte officiel : Dijkstra,
     programmation dynamique, et l'obligation de numpy (« aucune connaissance sur un module particulier
     n'est exigible »).
   • BARÈME : informatique 4,5/20 (fourchette du jury), questions au prorata, et 3 points de
     COMMUNICATION — les rapports répètent que rester muet ou se précipiter coûte autant qu'une erreur ;
     l'élève coche la grille du jury en fin de passage.
   • Les oraux sont archivés dans le même historique que les khôlles (« 📋 Mes colles & oraux ») avec
     le temps de préparation, le temps de passage, le détail par question et la partie Python.
   VÉRIFICATION : les 29 blocs de code Python des planches ont été RÉELLEMENT EXÉCUTÉS par un
   interpréteur — 29/29 compilent et s'exécutent sans erreur (3 amorces à trous corrigées pour rester
   valides). Format contrôlé mécaniquement : 0 défaut. Déroulé complet rejoué en navigateur sur les
   quatre épreuves. La relecture scientifique de fond par agents correcteurs reste à terminer : elle a
   été interrompue par une limite de quota, les rédactions ayant abouti. */
/* ── v201 — CORRECTIF URGENT : SITE INUTILISABLE (page blanche) depuis la v200.
   Le moteur d'oral déclarait « function renderQuestion() », nom DÉJÀ utilisé par le moteur de quiz.
   Tout le code applicatif vit dans un <script type="module"> : une redéclaration au premier niveau y
   est une SyntaxError fatale — le module entier échoue et rien ne s'initialise. Renommée oralQuestion.
   POURQUOI MON CONTRÔLE NE L'A PAS VU : je vérifiais avec « node --check » sur les scripts concaténés,
   donc traités comme des SCRIPTS CLASSIQUES, où une redéclaration de fonction est légale (la seconde
   écrase simplement la première). Seul le mode MODULE la refuse. Le contrôle de déploiement vérifie
   désormais le <script type="module"> en tant que module, et liste les redéclarations au premier niveau. */
/* ── v202 — LES ORAUX COLLENT AU CONCOURS, ET LE MENU EST REMIS À PLAT.
   RÈGLES D'APPARIEMENT DU JURY, désormais reproduites :
   • Mathématiques — « Les candidats sont évalués en Algèbre/Probabilités/Géométrie en alternance avec
     l'Analyse et le second oral de mathématiques » : après un oral d'Analyse, le suivant porte sur
     Algèbre/Probabilités/Géométrie, et réciproquement. L'application le dit à l'élève.
   • Physique-chimie — « le jury s'assure que les thèmes proposés lors des deux épreuves soient
     nécessairement différents » : le second oral évite la famille du premier.
   Le domaine du dernier oral passé est mémorisé (d.oralDernier).
   MENU (demande élève) :
   • « Colle blanche » est REMPLACÉE par « Oral Centrale » — un seul mode d'oral, celui du concours.
   • « Formulaire » et « Mes colles » quittent le bloc qui lance une série : ce sont des outils de
     consultation. Ils rejoignent la barre d'outils du haut (📖 et 📋 « Mes oraux »).
   • Nuance Examen blanc / Sprint DS, qui n'était écrite nulle part : l'Examen blanc est une ÉPREUVE
     notée (QCM seuls, 90 s par question, correction à la fin) ; le Sprint DS est une RÉVISION ciblée
     avant une date (toutes les cartes, triées par retard puis par nombre d'oublis, correction immédiate).
   CONTENU : les 119 exercices de khôlle (chauffe + difficile) sont reversés en planches d'oral — une
   chauffe puis un exercice exigeant, ce qui est exactement la progression attendue dans une planche.
   66 planches au total, 51 chapitres couverts (contre 39 et 33).
   PRÉCISION IMPORTANTE : l'absence d'oral de SI et d'oral d'informatique n'est pas un manque, c'est le
   concours — en TSI la SI est un TP de 4 h, et l'informatique est évaluée DANS maths-info et PC-info. */
/* ── v203 — L'INFORMATIQUE DEVIENT RÉVISABLE + nettoyages demandés.
   • 79 CARTES D'INFORMATIQUE créées, couvrant les 15 chapitres du programme officiel TSI : la matière
     était déclarée depuis longtemps mais n'avait AUCUNE carte, et les 15 chapitres que la v200 avait
     ajoutés affichaient tous « bientôt ». Plus aucun chapitre d'informatique n'est vide.
     Bases Python, listes et chaînes, boucles et invariants, modules et fichiers, dichotomie,
     récursivité, tableaux 2D et images, tris, preuve et complexité, représentation des nombres,
     graphes, SQL, dictionnaires et hachage, k plus proches voisins, Euler et intégration numérique.
     Le code Python des cartes a été exécuté : 19 programmes complets tournent, 6 fragments
     illustratifs (« a, b = b, a ») sont syntaxiquement valides, 4 blocs sont des requêtes SQL.
   • FORMULAIRE DE RECHERCHE RETIRÉ (jugé inutile) : écran, rendu et bouton supprimés, 4 Ko de code
     en moins, aucune référence résiduelle.
   • CARTE EN DOUBLE corrigée : « Qu'est-ce qu'un référentiel galiléen ? » existait à l'identique dans
     ph_newton et si_statique avec DEUX RÉPONSES DIFFÉRENTES. Comme le hash porte sur l'énoncé, c'était
     une seule et même carte SRS et l'une des deux réponses était inatteignable. L'énoncé de la version
     SI est précisé (« En statique du solide, … »).
   • Les cinq cartes à trous qui utilisaient « ___ » au lieu de « □ » sont harmonisées À L'AFFICHAGE :
     modifier leur énoncé aurait changé leur hash et effacé la progression acquise dessus. */
/* ── v204 — GRILLE DU JURY : trois défauts d'affichage signalés sur une même ligne.
   • Le gras était écrit en MARKDOWN (**ainsi**) dans les exercices repris de la khôlle : le navigateur
     ne le rend pas, les astérisques s'affichaient telles quelles. 234 occurrences converties en <b>.
   • La grille n'était jamais passée à MathJax : les formules restaient en LaTeX source ($n\gt 0$).
     typeset() est maintenant appelé sur l'écran de grille.
   • Les critères dérivés du « piège classique » étaient coupés brutalement à 150 signes, en plein
     milieu d'une phrase (« justifie le passage à l'exponentielle par »). Ils reprennent désormais la
     PREMIÈRE PHRASE ENTIÈRE, sans jamais couper un mot ni une formule, et en reculant jusqu'à un mot
     porteur de sens quand la troncature est inévitable.
   INCIDENT ÉVITÉ DE JUSTESSE : la conversion des ** a d'abord corrompu QUATRE blocs de code Python,
   où ** est l'opérateur de puissance — « x ** i » était devenu « x <b> i », et « x**3/6 + x**5/120 »
   « x<b>3/6 + x</b>5/120 ». Détecté par un contrôle systématique des balises de gras à l'intérieur des
   blocs <pre> (où elles n'ont aucun sens), puis réparé. Les 30 blocs de code de l'application
   compilent de nouveau. */
/* ── v205 — LES 8 CHAPITRES « BIENTÔT » DEVIENNENT DES RENVOIS.
   Huit chapitres de la numérotation du cahier de prépa (3. Second degré, 4. Récurrence, 8. Complexes
   forme exponentielle, 10. Systèmes et matrices, 12. Opérations sur les vecteurs, 13. Limites de
   fonctions, 20. Limites de suites, 26. Dérivation et DL1) n'ont pas de cartes en propre : leurs
   notions sont traitées dans un chapitre voisin. Ils affichaient « ✅ 0/0 », ce qui laissait croire à
   un contenu manquant.
   Ils indiquent désormais où se trouve réellement le contenu — « ↪ contenu traité dans 27. Polynômes » —
   et un clic sélectionne le chapitre cible et y fait défiler la page. Leur pastille de sélection est
   désactivée : cocher un chapitre sans carte n'aurait rien donné.
   Les masquer aurait troué la numérotation de la prof (3, 4, 8, 10, 12, 13, 20, 26 auraient disparu) ;
   les peupler aurait dupliqué des cartes existantes et créé deux jeux à réviser pour une même notion.
   Vérifié : les 8 renvois pointent vers un chapitre effectivement pourvu (36 à 50 cartes), en tenant
   compte du remap appliqué au chargement. Plus aucun chapitre n'est sans carte ni renvoi. */
/* ── v206 — 90 PLANCHES D'ORAL : plus rien du contenu produit ne dort.
   La conversion des exercices de khôlle en planches (v202) n'avait traité que les chapitres qui
   n'avaient pas encore de planche rédigée : 65 exercices sur 119 restaient donc sans emploi depuis
   le retrait du mode « Colle blanche ». Les 24 chapitres manquants sont convertis à leur tour —
   90 planches désormais, et deux sujets disponibles sur les chapitres les mieux dotés, ce qui évite
   de retomber sur le même énoncé.
   RESTENT SANS EMPLOI : 17 exercices de sciences industrielles. Ce n'est pas un oubli — à Centrale TSI
   la S2I est un TP de 4 h sur système réel, il n'existe pas d'oral de SI de 30 minutes. Les intégrer
   au mode « Oral Centrale » serait donc contraire au format du concours. */
/* ── v207 — CORRECTIF URGENT : SITE INUTILISABLE. Une VIRGULE DOUBLE s'était glissée dans le tableau
   QUESTIONS, juste avant les cartes d'informatique ajoutées en v203 : « exp:""},, ».
   En JavaScript, [a,,b] est du code PARFAITEMENT VALIDE — cela crée un « trou » dont l'élément vaut
   undefined. La première boucle qui traverse le tableau (le reclassement vers les chapitres du prof,
   qui lit q.topic) a donc levé un TypeError, et tout le module a cessé de s'initialiser.
   C'est pourquoi ni node --check ni le contrôle de déploiement ajouté en v201 ne l'ont vue : la
   syntaxe est correcte, la faute est sémantique. Le contrôle de déploiement évalue désormais les
   grands tableaux de données et refuse tout trou. */
/* ── v208 — LE CCINP REJOINT CENTRALE : deux concours, deux formats distincts.
   Sources : RÈGLEMENT CCINP SESSION 2026 (tableau officiel « Filière TSI ») et rapports d'oraux TSI.
   Épreuves orales CCINP TSI, préparation / interrogation / coefficient :
     Mathématiques 30 min / 30 min / 9 — Physique-Chimie 30 min / 30 min / 7 —
     Langue vivante A 30 min / 30 min / 6 — TIPE / 30 min / 8 — TP de S2I 1 h / 3 h / 10.
   DÉROULÉ REPRODUIT, qui n'a rien à voir avec celui de Centrale :
   • 30 minutes de préparation sur UN exercice, puis une trentaine de minutes d'interrogation ;
   • le passage commence par la présentation au tableau de l'exercice préparé (une vingtaine de
     minutes), puis l'examinateur remet un SECOND EXERCICE, court, traité SANS PRÉPARATION — il
     évalue « la réactivité et l'autonomie face à une résolution de problème » ;
   • en mathématiques, l'exercice préparé porte une QUESTION PYTHON « en relation étroite avec
     l'énoncé mathématique », jamais de l'informatique pure : valeur approchée d'une intégrale,
     somme partielle d'une série, conjecture sur une suite, modélisation d'une expérience aléatoire.
     L'aide-mémoire Python reste disponible pendant la préparation ET la prestation.
   • la consigne de préparation reprend celle du jury : « le but n'est pas de résoudre entièrement
     les exercices, mais de mettre au point une stratégie et de rassembler les éléments de cours ».
   L'écran de choix est désormais groupé par concours. Les 90 planches servent les deux, l'exercice
   « à froid » étant tiré parmi celles que la planche préparée n'utilise pas.
   Vérifié en navigateur sur les quatre parcours (CCINP maths et PC, Centrale maths et maths-info) :
   enchaînement, question Python, annonce du second exercice, notation, aucune régression. */
/* ── v209 — RETRAIT DE TSI0 ET DE LA MATIÈRE INFORMATIQUE (demande élève).
   • La classe TSI0 (transition bac pro) disparaît : elle n'avait aucun contenu et affichait « bientôt ».
     Le sélecteur ne propose plus que TSI1 et TSI2, et toutes les listes de niveaux du code suivent.
   • La matière Informatique est retirée en entier : 79 cartes, 15 chapitres et 3 familles, ajoutés en
     v203. Le contenu est conservé hors ligne au cas où il serait redemandé.
     Attention, cela ne retire PAS Python des oraux : les questions Python vivent dans les planches
     elles-mêmes (15 en portent une), conformément aux deux concours — Centrale a deux épreuves « avec
     informatique », et au CCINP l'exercice de maths préparé porte une question Python. Vérifié :
     aucune planche n'était rangée dans un chapitre d'informatique.
   Intégrité contrôlée après retrait : aucun chapitre sans matière, aucune carte pointant vers un
   chapitre inexistant (une fois le remap de chargement appliqué), aucune famille orpheline.
   37 Ko en moins. */
/* ── v210 — LE PROGRAMME DE SECONDE ANNÉE ENTRE DANS L'APPLICATION (sections seules, sans cartes).
   Source : PROGRAMME OFFICIEL TSI 2021 (arrêté modifié, 157 pages, mathématiques + physique-chimie +
   sciences industrielles + informatique, première ET seconde années). Le programme de 2013 utilisé
   jusqu'ici pour la première année est OBSOLÈTE depuis la refonte de 2021 — c'est bien la version en
   vigueur qui a servi ici.
   39 CHAPITRES DE TSI2 déclarés, sans aucune carte comme demandé :
   • MATHÉMATIQUES (13) — titres repris tels quels de la table des matières officielle : compléments
     d'algèbre linéaire, déterminants, réduction des endomorphismes, fonctions vectorielles et courbes
     paramétrées, intégration sur un intervalle quelconque, séries numériques, séries entières, espaces
     préhilbertiens et euclidiens, séries de Fourier, probabilités sur un univers dénombrable,
     variables aléatoires discrètes, équations différentielles linéaires, fonctions de plusieurs variables.
   • PHYSIQUE-CHIMIE (17) — les cinq thèmes officiels détaillés en sous-parties : thermodynamique et
     mécanique des fluides (5), électronique (3), optique ondulatoire (2), électromagnétisme (4),
     transformations chimiques (3).
   • SCIENCES DE L'INGÉNIEUR (9) — le programme de SII n'est pas découpé en chapitres mais en
     compétences positionnées par semestre ; ces neuf sections reprennent les thèmes des SEMESTRES 3
     ET 4 (dynamique et matrice d'inertie, résistance des matériaux, correction des asservissements,
     performances, modélisation multiphysique flux/effort, machines et modulateurs, monophasé et
     triphasé, intelligence artificielle, résolution numérique). L'extraction du tableau à trois
     colonnes du texte officiel étant imparfaite, ce découpage demande une relecture humaine.
   Trois familles créées : Optique ondulatoire, Électromagnétisme, Énergie & puissance.
   L'application compte désormais 105 chapitres ; les 39 nouveaux s'afficheront « bientôt » tant
   qu'aucune carte n'y sera rattachée. */
/* ── v211 — FRANÇAIS-PHILOSOPHIE ET ANGLAIS : les sections sont posées (sans cartes).
   Ces deux matières sont TRANSVERSALES : même programme en première et en seconde année, d'où le
   niveau 'tr' — l'élève y accède quelle que soit sa classe.
   • FRANÇAIS-PHILOSOPHIE (9 sections) — bâties sur le thème de l'année : « LES ARCANES DE LA
     CRÉATION », programme 2026-2027 des classes préparatoires scientifiques, avec ses trois œuvres :
     Platon (Ion, et La République livre X, 595a-608b), Zola (L'Œuvre), Woolf (Un lieu à soi).
     Une section par œuvre, plus le thème, ses notions, ses citations, et les deux méthodes d'écrit
     (résumé de texte et dissertation).
     ATTENTION : ce thème CHANGE À CHAQUE ANNÉE SCOLAIRE. Les sections d'œuvres seront à remplacer
     chaque été — un commentaire le rappelle dans le code, à côté des déclarations.
   • ANGLAIS (13 sections) — la CPGE ne fixe pas de programme de contenu en langue mais des
     compétences : les sections couvrent donc la langue (temps et aspects, modaux, syntaxe, faux amis,
     idiomes), le vocabulaire thématique (sciences et techniques, société, économie, environnement),
     la civilisation (Royaume-Uni, États-Unis) et les méthodes d'épreuve (résumé et commentaire
     d'article — le format des oraux de langue —, thème et version).
   6 familles créées. L'application compte 127 chapitres : 66 en TSI1, 39 en TSI2, 22 transversaux.
   Aucune carte n'est rattachée à ces sections, comme demandé. */
const CACHE = 'quiz-tsi-v211';  /* ── v172 (session parallèle) MOT DU JURY : +13 entrées Centrale-Supélec TSI 2026 (maths, physique-chimie, SI), ajoutées à JURY_DATA. */  /* ── v160 SYNC AUTO 2026-08-21 : greffe sur HEAD v159 des 3 correctifs produits en local par la tâche signalements du matin (chapitre ph_laplace) — balises <b> échappées (\lt b\gt) restaurées dans deux champs answer, et explication de la carte « position theta=180° instable » enrichie (situation posée + argument énergétique E_p=-m.B). Champs answer/exp uniquement — aucun énoncé q modifié → qHash et progression FSRS intacts. */  /* ── v150 PERTINENCE DES SCHÉMAS + LISIBILITÉ DES CONSIGNES. (A) FIGURES MAL AFFECTÉES : la relecture des 96 planches a mis au jour un DÉCALAGE SYSTÉMATIQUE dans le bloc des cartes vrai/faux de physique — la figure portée par la carte N appartenait en réalité à la carte N-1. 12 réaffectations vérifiées une à une : ARQS (convention récepteur, loi d'Ohm en convention générateur, résistances internes ampèremètre/voltmètre, association en parallèle, source idéale de courant), cinématique (déphasage bobine/condensateur, relation a-v, vitesse tangente), mécanique (décomposition de la réaction, 3e loi de Newton Terre-Lune, travail du poids indépendant du chemin, travail de la réaction). La carte sur la convention récepteur affichait un schéma d'OPTIQUE. (B) 9 FLÈCHES DE TENSION INVERSÉES : sur les dipôles R, C et L, u était fléchée dans le MÊME sens que i, c'est-à-dire en convention générateur, alors que les cartes énoncent les relations de la convention récepteur (u=Ri, i=C du/dt, u=L di/dt). (C) LIGNES BRISÉES : un `segment` de plus de deux points n'était tracé que sur ses deux premiers points — le reste de la trajectoire disparaissait et les vecteurs posés dessus semblaient flotter. (D) CONSIGNES : l'amorce des QCM couvre désormais les énoncés suspendus par des points de suspension (« se comporte comme… », 29 cartes) ; et les flashcards dont l'énoncé est un simple INTITULÉ de point de cours (« Inégalité des accroissements finis. », une centaine de cartes) reçoivent une invite explicite « Énonce ce point de mémoire — définition, formule ou théorème — puis révèle », au lieu de l'invite générique. Aucun énoncé q modifié → qHash et FSRS intacts. */  /* ── v149 AUDIT COMPLET DES SCHÉMAS (702 figures rendues une à une avec MathJax et mesurées au pixel) — CORRECTIFS MÉCANIQUES. (1) 20 FIGURES NE S'AFFICHAIENT PAS : les champs fig de 10 cartes de filtrage appelaient L10() et 10 cartes de résonance appelaient Q, deux aides JAMAIS DÉFINIES ; l'exception était avalée par le try/catch du normaliseur, la carte s'affichait sans son schéma. L10 (log décimal) est ajouté à côté de P(), et Q est remplacé par sa valeur explicite 4 — celle pour laquelle les points à -3 dB codés en dur (0,883 et 1,133) sont exacts — sauf sur les 2 cartes « influence de Q » qui tracent trois courbes et reçoivent 1,5 / 4 / 12. (2) DIAGRAMMES DE BODE ÉCRASÉS : 4,6 unités en abscisse contre 53 en ordonnée, avec l'échelle isotrope de FIG, donnaient un dessin de 28 px de large sur 330 de haut. FIG accepte désormais un champ box:[largeur,hauteur] qui donne une échelle propre à chaque axe (défaut isotrope INCHANGÉ, indispensable aux cercles et aux angles) ; les 7 figures de Bode passent en box:[320,210]. (3) CINÉTIQUE : sur la figure partagée par 19 cartes, « ordre 0 » et « ordre 1 » tombaient chacune sur la MAUVAISE courbe (« ordre 1 » sur la droite, « ordre 0 » près de l'exponentielle) — étiquettes repositionnées sur leur courbe. (4) CONVENTION RÉCEPTEUR (2 cartes) : la flèche u était dans le MÊME sens que i, c'est-à-dire la convention générateur, en contradiction directe avec la carte #1464 qui enseigne que les flèches sont opposées ; flèche u inversée. (5) ACCENTS LaTeX non interprétés par MathJax dans \text{} : « dip\^ole », « r\'ecepteur », « ap\'eriodique »… s'affichaient littéralement sur 7 figures — remplacés par les caractères accentués. (6) BALISES DE GRAS ÉCHAPPÉES : 14 énoncés affichaient « \lt b\gt Rails de Laplace.\lt /b\gt » en clair ; comme q est la clé du SRS et ne doit jamais changer, la réparation se fait à l'AFFICHAGE (fonction qHTML, appliquée à la révision et au mode examen, sans toucher aux \lt/\gt légitimes des formules). Vérifs : 702 figures rendues, 0 exception (contre 20), 0 erreur MathJax, qHash et ordre des cartes inchangés. */  /* ── v148 QCM À ÉNONCÉ-PRÉMISSE — amorce d'affichage (signalement SYSTÉMIQUE : au moins 7 remontées, 3 comptes, sur Cramer x3, suites adjacentes, approche énergétique, nombres complexes et inégalité des accroissements finis, toutes du type « pas de question » / « pas lisible »). Beaucoup de QCM posent une PRÉMISSE : l'énoncé se termine par « : » (« Système de Cramer (…) : ») ou reste suspendu sur un opérateur (« $\cos(a+b)=$ ? »), et l'élève ne voit pas ce qui est demandé. Correctif au niveau du RENDU, PAS du contenu : nouvelle fonction isPremiseQ() (détection sur « : » final ou opérateur suspendu après retrait du « ? » et du « $ » de fin) ; quand elle répond vrai, une ligne discrète « Choisis la proposition qui complète l'énoncé. » (classe .qcm-lead, 13 px, italique, couleur --muted) est insérée entre l'énoncé et les propositions. Appliqué aux DEUX rendus de QCM : renderQCM (révision et quiz) et renderExamQuestion (mode examen). Mesure sur le corpus : 258 des 397 cartes QCM concernées ; les vraies questions interrogatives ne déclenchent jamais l'amorce (6 cas de contrôle vérifiés). AUCUN énoncé q n'est modifié → qHash et progression FSRS intacts ; design, thèmes et localStorage inchangés. Réglage/retrait = une ligne (PREMISE_LEAD / isPremiseQ). */  /* ── v147 RÉCUPÉRATION DU CORRECTIF DE LA TÂCHE SIGNALEMENTS DU MATIN : le run « signalements-check-tsi » du 2026-08-19 08h53 avait enrichi, dans le fichier LOCAL uniquement, l'explication de la carte « Inégalité des accroissements finis » (signalement yannnzali8 : énoncé-prémisse perçu comme sans question) en rappelant l'énoncé complet |f(b)-f(a)| <= M|b-a|. Ce correctif n'avait jamais été poussé et a failli être perdu lors de la resynchronisation du dossier local sur v146 ; il est ici regreffé sur HEAD. Champ exp uniquement, énoncé q inchangé → qHash et progression FSRS préservés. */  /* ── v146 SCHÉMAS SUR CARTES DOUBLONS (backlog signalements, dernier reliquat) : deux cartes existaient en double, l'une avec figure et l'autre sans. La figure de la jumelle leur est greffée à l'identique — « Distance d'un point M_0(x_0,y_0) à la droite ax+by+c=0 » (mode flash) reçoit le schéma point / projeté / distance d de la carte en mode saisie, et « s ∈ L(E) est une SYMÉTRIE ⟺ ? » reçoit le schéma x / p(x) / s(x) de la carte « Définis une symétrie ». Ajout du seul champ fig : énoncés q, choix, réponses et explications INCHANGÉS → qHash et progression FSRS préservés. Premier déploiement réalisé par la chaîne de push NON INTERACTIVE (git + jeton fine-grained, sans Chrome) avec passage par guard-srs.py. */  /* ── v145 SIGNALEMENTS ÉLÈVES — 7 correctifs de contenu (énoncés q INCHANGÉS → SRS/FSRS préservé). MATHS : (1) carte « 5 exemples de fonctions bornées qui n'atteignent pas leurs bornes » — l'exemple 4 était FAUX (sur $]0,2\pi[$ le sinus atteint bien $\pm1$ en $\pi/2$ et $3\pi/2$) → remplacé par $]-\pi/2,\pi/2[$ ; exemple 3 ($e^{-x^2}$) précisé : seule la borne INFÉRIEURE n'est pas atteinte ; (2) variation de la constante — explication étoffée (pourquoi le terme en C s'élimine, $C'=be^{A}$, forme intégrale) ; (3) contre-exemple d'implication — les symboles $\wedge$ et $\lnot$ sont désormais nommés (« c'est quoi le chapeau ? »). PHYSIQUE : (4) diagramme d'AMAGAT — la figure montrait des hyperboles en axes $(V,P)$, c'est-à-dire un diagramme de Clapeyron, en contradiction avec la réponse de la carte : refaite en axes $(P,Pv)$ avec isothermes horizontales, limite $Pv\to RT$ et écart du gaz réel ; (5) Clapeyron liquide-vapeur (figure partagée par 6 cartes) — ajout du POINT CRITIQUE, des courbes d'ébullition et de rosée et du prolongement de l'isotherme hors du palier ; (6) carte $u_C$/$i_L$ après commutation — le schéma ne comportait AUCUNE bobine : deux circuits (a) RC et (b) RL, et explication de la continuité par l'argument de puissance ; (7) décrément logarithmique — explication ajoutée (c'était la seule carte du fichier au champ exp vide) : $T$, $\tau$, l'enveloppe, et $Q\simeq\pi/\delta$. Vérifs : 1551 cartes, qHash et ordre identiques, 701 fig / 19 ggb, 0 artefact Cloudflare, node --check OK.  /* ── v144 RÉCONCILIATION BASE LOCALE → HEAD : greffe ADDITIVE sur v143 de (1) 20 entrées JURY_DATA de l'enrichissement hebdomadaire produites en local et jamais déployées (JURY_DATA 49 → 69) et (2) 6 correctifs de signalements élèves appliqués en local depuis le 2026-06-22 : racines n-ièmes (exp reformulée en groupe U_n), det(AB) (ajout det(AB)=detA·detB=det(BA) même si AB≠BA), C_{V,m} gaz parfait monoatomique (accept élargi : 3/2R, 3R/2, 1.5R, 1,5R…), oscillateur harmonique (exp : x = écart à l'équilibre, second membre nul ; forme amortie), capacité d'une pile (F = constante de Faraday), système pseudo-isolé (1\textsuperscript{re} → « première », commande non rendue par MathJax). Énoncés q / qHash / ordre des 1551 cartes INCHANGÉS → SRS/FSRS-6 préservé ; schémas FIG (701) et explorateurs GeoGebra (19) intacts ; 0 artefact Cloudflare ; node --check OK.  /* ── v138 INDUCTION — RE-VÉRIFICATION CONFORMITÉ (la vérif du run initial v131 avait échoué). Workflow adversarial 12 agents (conformité programme 1.7-1.12 + rigueur physique) sur les 6 chapitres déployés. 13 corrections SRS-safe (q jamais touché) : coeff. de couplage k / M²≤L1L2 / 'théorème de réciprocité' marqués COMPLÉMENTS hors-programme TSI1 (circuit_fixe) ; nuance 'courant induit sans mouvement si champ inducteur variable' (induction_lois) ; ajout dF=I dl∧B (laplace) et point de vue motionnel e=∫(v×B)·dl (circuit_mobile) ; 'force toujours résistante'→'ici, générateur' ; Helmholtz recentré sur solénoïde ; hypothèse rotation lente ; notation ω pulsation vs vitesse ; défluxage=extension. Haut-parleur CONFIRMÉ hors-programme 1.12 (chapeau seulement). ── v137 MOT DU JURY — +11 ENTRÉES ADDITIVES (Centrale-Supélec TSI 2025 ×5, CCINP TSI 2020 ×3, CCINP TSI 2019 ×3) extraites des rapports officiels du jury (rédaction, hypothèses de théorèmes, erreurs types : gradient = vecteur des dérivées partielles, théorème du rang sur le nb de colonnes, inversibilité ⟺ 0 ∉ Sp, matrice orthogonale AᵀA=I, V(X+a)=V(X), sin 2π-périodique, majoration ≠ équivalence). Ajout dans JURY_DATA uniquement → QUESTIONS/énoncés/qHash/SRS/FSRS/physique-chimie/schémas/design INCHANGÉS ; 0 artefact Cloudflare ; node --check OK. ── v109 PHYSIQUE-CHIMIE TSI1 — RUBRIQUES EN CONFORMITÉ PROGRAMME OFFICIEL 2021 (greffé sur v108 « Nettoyage fiches PDF », INTACT) : 27 chapitres réalignés sur les 4 thèmes officiels. RETIRÉS de TSI1 : diagrammes potentiel-pH (→ TSI2), aspect corpusculaire de la lumière, classification périodique. AJOUTÉS : oscillateurs forcés (1.5), approche énergétique du mouvement (2.3), énergie échangée (3.2), relations structure–propriétés (4.2). Libellés recalés sur l'officiel. Rubriques VIDES (0 carte → 0 qHash, aucun impact SRS/FSRS). Suppression du système de fiches PDF/JPG (v108) et tout le contenu maths/FSRS/schémas/Mot du jury/design INCHANGÉS. node --check OK. ── v107 FONDU INTER-CARTES DÉTERMINISTE : le fondu d'apparition entre cartes ne dépend plus de la vitesse du typeset MathJax (avant : visible seulement si le typeset était lent → « pop » sec sur les QCM perso rapides, sensation de bug). Remplacé par une animation CSS cardFade (classe .card-in, fondu + léger glissé 4px sur .24s) REJOUÉE à chaque carte via le code partagé renderReveal → quiz perso ET flashcards ont désormais le même fondu fluide ; anti-flash du LaTeX brut conservé (élément masqué pendant le typeset, l'animation prend le relais au dévoilement). CSS-only + 6 lignes JS, additif, AUCUN impact SRS/FSRS. ── v106 FIX TIMING SRS (file de session, moteur FSRS inchangé) : (1) réinjection des paliers d'apprentissage resserrée de 20 min → 60 s (SRS_LEARN_COLLAPSE_MS) — une carte notée « Correct/10 min » n'enchaîne plus tout de suite : elle attend son palier et d'AUTRES cartes sont proposées entre-temps ; (2) l'ENTRAÎNEMENT LIBRE n'inclut plus jamais une carte planifiée dans le futur (due > maintenant) — une carte notée « Correct, +2 j » ne réapparaît plus le jour même et n'est plus re-planifiée en double (timing cassé corrigé). Conséquence : une session ILLIMITÉE (∞) se conclut par le bilan « à jour » quand tout le dû/nouveau/pratiquable est fait, au lieu de recycler le programme. Énoncés q / qHash / review() / _project() / poids FSRS INCHANGÉS → progression SRS préservée (8/8 cas de timing simulés OK, node --check OK). ── v105 FIX EXPLORATEUR 3D (mobile) : l'applet GeoGebra s'ouvre désormais dans une FENÊTRE MODALE plein écran (overlay .modal-overlay + bouton ✕, fermeture clic-dehors / Échap) au lieu d'être inline dans la carte. Corrige le « piège de défilement » mobile (l'applet 3D capturait le doigt pour tourner → impossible de scroller jusqu'aux boutons de note) + les soucis de taille ; l'applet est dimensionné à la fenêtre et DÉTRUIT à la fermeture (api.remove(), perf). Compatible plein écran .fs-active (modale ajoutée à #quizScreen comme le modal de signalement). Bouton « Explorer en 3D » réutilisable (plus masqué au clic). ── v104 SCHÉMAS 3D — PROJECTEURS / SYMÉTRIES : explorateur « Explorer en 3D » (GeoGebra) ajouté EN COMPLÉMENT du schéma 2D sur 5 cartes (projecteur ×2, symétrie, supplémentaires ×2 ; chapitres ev + applications_lineaires) — cas canonique R³ : projection sur un plan F parallèlement à une droite G (P=p(x) = point où la parallèle à G passant par x perce F ; décomposition x=p(x)+(x−p(x))), et symétrie oblique (Sx=2P−M). Additif (champ ggb, énoncés q INCHANGÉS → SRS préservé) ; le 2D reste affiché pour le concept, le 3D se charge au clic pour le cas spatial. 18 explorateurs GeoGebra + 52 figures FIG au total. ── v103 UX : retrait du champ « N° étudiant ou remarque » à l'inscription ET au profil (inputs authNote/pgNote + lectures JS retirés ; profil sans note) ; retrait du SWIPE mobile de notation (fonction setupGradeSwipe + indice « glisse pour noter ») qui faisait avancer la carte par glissement accidentel et buggait — la notation se fait désormais uniquement au TAP sur les boutons. Schémas (52 figures FIG + 13 explorateurs GeoGebra) et fonctions classes v102 INCHANGÉS. ── v102 CLASSES TSI0/1/2 + GESTION DES MEMBRES + SUPPRESSION ROBUSTE : à l'inscription l'élève CHOISIT sa classe (boutons TSI0/TSI1/TSI2 sur l'accueil ET dans le verrou d'accès) → écrit filiere=TSI + annee, regroupé automatiquement dans la console prof. Console admin : bouton « ✗ Retirer » + menu déroulant « changer de classe » sur CHAQUE membre approuvé (avant : aucune action possible une fois approuvé). Approbation / retrait / déplacement / réparation écrits en REPLI CLIENT direct (un compte enseignant a le droit d'écrire profile.classStatus/annee par les règles Firestore) si la Cloud Function setClassApproval est indisponible. SUPPRESSION DE COMPTE durcie : quand deleteAccount renvoie « internal » (fonction non déployée / plan Blaze), repli client qui efface les DONNÉES (doc users + sessions + pseudo, teacher-allowed) ; le login Firebase restant est clairement signalé (console Authentication / redéploiement). Cloud Function deleteAccount durcie séparément (message lisible au lieu d'« internal », fallback manuel si recursiveDelete indispo). Énoncés/SRS/FSRS-6/32 chapitres/schémas/design/Mot du jury INCHANGÉS. ── v101 GÉOMÉTRIE 3D (GeoGebra) : explorateurs 3D interactifs « Explorer en 3D » sur 13 cartes geoespace (produit vectoriel ⊥ plan + norme, produit mixte = volume du parallélépipède, plans parallèles ⟺ normales colinéaires, intersection de deux plans, vecteur normal au plan, sphère). Champ additif ggb:{obs,leg,cmds} → bouton + hôte ajoutés à exp au chargement (énoncés q INCHANGÉS → SRS préservé) ; applet GeoGebra 3D (vue 3D seule) chargé LAZY au clic depuis geogebra.org (en ligne) avec bandeau « À observer » + légende couleurs (thémés). Reste de la carte et app = légers/hors-ligne/thémés ; CSP déjà permissive. Page de test temporaire labo-3d.html. ── v100 ANNULATION (anti-miss-click) : bouton « ↶ Annuler » dans la barre du quiz + raccourci Ctrl/Cmd+Z. Un clic accidentel sur une note (Oubli/Difficile/Correct/Facile, confiance QCM, « Je ne sais pas ») fait avancer la carte ET corrompt la planification SRS — désormais réversible. Avant chaque notation, instantané MINIMAL (état SRS de la carte via qHash + daily/streak/reviewLog + compteurs de session score/streak/count) ; l'annulation restaure cet état et ré-affiche la carte vierge pour la re-noter. Multi-niveaux (pile bornée à 60), SRS-safe (énoncés q INCHANGÉS → hash préservés ; restauration chirurgicale validée par 26 tests sur le vrai moteur FSRS, dont oubli accidentel sur carte mûre restaurée à l'identique), mobile-safe (snapshot léger). En révision (file dynamique) l'annulation jette la carte piochée à la suite ; en quiz (pool fixe) le pool n'est pas tronqué. Ne vole pas l'annulation native pendant la saisie d'une réponse. ── v99 SCHÉMAS — PROBABILITÉS (+3 arbres pondérés composés avec segment+label, sans nouvelle primitive ; additif, SRS préservé ; 47 cartes à figure au total) : formule de Bayes, formule des probabilités totales (système complet), définition de la probabilité conditionnelle — arbre à 2 niveaux A/Ā puis B/B̄ avec probabilités sur les branches. Reste hors-FIG : géométrie 3D (~10 cartes) → décision GeoGebra parkée. ── v98 SCHÉMAS — LOT 3 (+16 figures FIG + nouvelle primitive `area` remplissage sous-courbe ; additif, SRS préservé ; 44 cartes à figure au total) : intégrale=aire (∫₀^π sin=2), croissance f≤g, ∫ fonction impaire=0 (aires +/− qui se compensent), Chasles (aire découpée en a<c<b), convexité/position courbe-tangente, équivalents en 0 (ln(1+x)∼x, 1−cos x∼x²/2, eˣ−1∼x, sin x∼x), suites adjacentes (intervalles emboîtés), domaine de ln, arccos (domaine/image), amplitude de a cos x+b sin x. ── v97 SCHÉMAS — LOT 2 (+21 figures FIG, additif, énoncés q INCHANGÉS → SRS préservé ; 28 cartes à figure au total) : cercle trigonométrique (cos π/6, sin π/3, tan π/4, cos π, identité cos²+sin²=1, arcsin), plan complexe (module |3+4i|, arg(−1), conjugué, e^{iπ}, e^{iπ/2}), racines n-ièmes (hexagone régulier), arctan (asymptotes ±π/2), croissance comparée ln≪x≪eˣ, valeur absolue |x|, parité, théorème de Rolle, accroissements finis (TAF), distance point-droite, vecteur normal. ── v96 GÉNÉRATEUR DE SCHÉMAS (FIG) : fonction FIG ajoutée (mini-DSL SVG inline — 1 SEUL repère pour formes ET labels, flèches/arcs générés, currentColor → 3 thèmes, labels rendus par MathJax) ; champ déclaratif fig:{window,items} converti en SVG dans exp AU CHARGEMENT (énoncés q INCHANGÉS → SRS préservé ; try/catch : une figure invalide ne casse jamais l'app). 7 cartes équipées : ln, Al-Kashi, tangente, TVI, suite récurrente (escalier/cobweb), produit scalaire (angle), somme de Riemann. Tâche « signalements-check-tsi » branchée : une demande de schéma fondée → ajout d'un champ fig (catalogue de figures-types) au lieu de « non fondé ». ── v94 FIX LABELS MATH (alpha/vec) : en v93, le re.sub de génération avait collapsé les doubles antislashs des labels en simple → après eval JS, la commande LaTeX (alpha, vec) perdait son antislash et s'affichait en toutes lettres (ex. « ialpha ») dans les schémas rotation et droite. Correctif : doublage des antislashs dans les régions figure → eval JS redonne la bonne commande → MathJax rend α et le vecteur. Cercle/monotone non touchés (labels sans commande). ── v93 SCHÉMAS — LABELS MATHJAX : les écritures des schémas sont désormais rendues par MathJax (le moteur mathématique de l'app), typographie STRICTEMENT identique au reste des cartes (vraies écritures mathématiques, fini le Computer Modern de TikZ jugé incohérent). Géométrie = SVG inline (currentColor → thèmes), labels = spans $...$ positionnés en % et typeset par MathJax. AUCUNE dépendance ajoutée (MathJax déjà chargé + en cache offline). Énoncés q inchangés (figure dans exp) → SRS préservé. ── v92 FIX THÈME NUIT : dans les schémas TikZ, les labels et points (glyphes sans attribut fill) héritaient du NOIR par défaut → invisibles sur fond sombre (thème Nuit). Correctif : fill='currentColor' ajouté sur la racine <svg> → labels + points adoptent la couleur d'encre du thème (vérifié sur fond Nuit : tout visible). ── v91 SCHÉMAS PRO (TikZ) : les 4 schémas refaits avec TikZ + dvisvgm (qualité publication : typographie LaTeX, flèches Stealth, géométrie précise) ; labels tracés en chemins (--no-fonts, autonomes), couleurs #000 → currentColor (compatibles thèmes). Remplacent les schémas tracés main de v90. Énoncés q inchangés (schéma dans exp) → SRS préservé. ── v90 SCHÉMAS : schémas SVG inline (currentColor, compatibles thèmes Papier/Nuit/Contraste) ajoutés dans le champ exp de 4 cartes (énoncés q inchangés → SRS préservé) — cercle |z-a|=r, rotation par e^{iα}, fonction monotone (limites latérales en un point intérieur), droite paramétrique M=A+t·u. ── v89 SIGNALEMENTS + CONFORMITÉ PROGRAMME : retrait du terme « sous-espace affine » (HORS-PROGRAMME TSI1, explicite au programme) de 6 cartes (systèmes ×2, équations différentielles/exp ×4 ; maths inchangées) ; « accept » de l'espérance E(X) élargi (formes commutées + notation p_i) ; enrichissements (définition des bases de la composée, « théorème des bornes atteintes / Weierstrass », récurrence sur Z, invariants de similitude). Énoncés (q) inchangés → SRS préservé. ── SRS — FSRS-6 : rétention cible IMPOSÉE à 92 % (curseur élève RETIRÉ). Décision : l'optimum d'ancrage est ~90 % (difficulté désirable + équilibre Anki), PAS plus haut ; on penche très légèrement vers la rétention (92 %, lean concours) sans l'excès contre-productif de 95 %+. Modifiable seulement via setFsrsRetention (console prof/admin), pour éviter qu'un élève sous-révise. ── v87 PASSAGE À FSRS-6 (algo avancé d'Anki, option recommandée — PAS le défaut SM-2 d'Anki) : le moteur de révision n'utilise plus SM-2 mais FSRS (mémoire Stabilité/Difficulté par carte ; intervalle = f(rétention cible)). Paliers d'apprentissage courts conservés (1m/10m) ; max interval 365 j (horizon prépa). Paliers d'apprentissage en minutes conservés ; migration DOUCE des cartes existantes (S amorcée depuis l'intervalle, D depuis l'ease, progression qHash préservée, dues inchangées jusqu'à la prochaine révision) ; port FIDÈLE de ts-fsrs validé numériquement (0 écart / 152 cas + 9 tests d'intégration). Poids FSRS-6 par défaut (optimisation perso possible plus tard via reviewLog déjà synchronisé). ── v86 SRS — MOTEUR DE PROGRESSION (6 correctifs) : #1 réinjection des paliers d'apprentissage EN session (dueLearning, collapse 20 min : les étapes 1/10 min vivent enfin) ; #2 détection LEECH (carte oubliée ≥8× signalée élève+prof) ; #3 oubli ADOUCI des cartes mûres (≥21 j → intervalle post-oubli plafonné à 7 j au lieu d'un reset à 1 j) ; #4 reviewLog SYNCHRONISÉ cloud (rétention vraie + heatmap multi-appareils) ; #5 LISSAGE du backlog (plafond 120 révisions/jour, « +N en attente ») ; #7 compteurs valides-only (plus d'orphelines dans globalStats). ── v85 RESTRUCTURATION CHAPITRES — les 20 chapitres maths regroupés deviennent les 32 chapitres NUMÉROTÉS de la prof (cahier de prépa tsi2-chaptal-paris) ; re-classement des 469 cartes selon la fiche rattachée à chacune (remap au chargement : seul le champ topic change, énoncés inchangés → progression SRS préservée) + 6 cartes « 15. TVI et bijections » créées (programme TSI1). ── v77 (conservé) PLEIN ÉCRAN + TRANSITIONS : zoom des cartes en plein écran agrandi (1.34em, énoncé 52px, choix 25px, colonne 1180px) + transition sans flash (typeset MathJax avant affichage + fondu .mj-pending + scrollQuizTop). ── v76 (conservé) ACCÈS CLASSE — fix « re-demande d'adhésion fantôme » : un élève DÉJÀ approuvé était renvoyé vers « Rejoindre la classe » (accueil + verrou révision) et sa re-demande était AVALÉE côté prof (la liste « en attente » filtrait via l'ancien roster). Corrigé : accueil/verrou respectent classStatus==='approved' (+ cache anti-aléa réseau) ; la console prof détecte les demandes via le doc de l'élève, plus le roster ; auto-réparation des membres de l'ancien roster sans classStatus. ── v75 (conservé) : le push v74 avait déployé une copie locale périmée (pré-v72) écrasant les raccourcis clavier + la fiche de cours en plein écran ; base v72 (GitHub HEAD f996b48a) restaurée + chapitre « Variables aléatoires » reconservé */const CORE = [
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

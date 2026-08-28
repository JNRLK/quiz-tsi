#!/bin/bash
# Contrôle avant tout déploiement d'index.html.
# Motif : la v200 a rendu le site inutilisable (page blanche). Le code applicatif vit dans un
# <script type="module"> ; une redéclaration au premier niveau y est une SyntaxError fatale, alors
# qu'elle est LÉGALE dans un script classique. Vérifier avec « node --check » sur les scripts
# concaténés ne la voit donc pas : il faut contrôler le module EN TANT QUE MODULE.
set -e
cd "$(dirname "$0")"
ERR=0

python3 - <<'PY'
import re, sys
src = open('index.html', encoding='utf-8').read()

# 1) le script de module, extrait tel quel
m = re.search(r'<script type="module">(.*?)</script>', src, re.S)
if not m:
    print("❌ aucun <script type=\"module\"> trouvé"); sys.exit(1)
open('/tmp/_verif_mod.mjs', 'w', encoding='utf-8').write(m.group(1))

# 2) les scripts classiques
autres = re.findall(r'<script(?![^>]*\bsrc=)(?![^>]*type="module")[^>]*>(.*?)</script>', src, re.S)
open('/tmp/_verif_cls.js', 'w', encoding='utf-8').write('\n;\n'.join(autres))

# 3) redéclarations au premier niveau du module — la panne de la v200
mod = m.group(1)
noms = {}
for mm in re.finditer(r'^(?:async\s+)?function\s+(\w+)\s*\(', mod, re.M):
    noms.setdefault(mm.group(1), []).append(mod[:mm.start()].count('\n') + 1)
for mm in re.finditer(r'^(?:const|let|var)\s+(\w+)\s*=', mod, re.M):
    noms.setdefault(mm.group(1), []).append(mod[:mm.start()].count('\n') + 1)
dup = {k: v for k, v in noms.items() if len(v) > 1}
if dup:
    print(f"❌ {len(dup)} redéclaration(s) au premier niveau du module — SyntaxError fatale :")
    for k, v in dup.items():
        print(f"     {k}  (lignes {v})")
    sys.exit(1)
print("✓ aucune redéclaration au premier niveau")
PY

node --check /tmp/_verif_mod.mjs && echo "✓ le module ES compile" || ERR=1

# Trous de tableau : « [a,,b] » est du JavaScript PARFAITEMENT VALIDE (l'élément vaut undefined),
# donc node --check ne le voit pas — mais la première boucle qui traverse le tableau plante et tue
# tout le module. C'est ce qui a rendu le site inutilisable en v206. On cherche donc les virgules
# consécutives en ignorant le contenu des chaînes de caractères et des commentaires.
python3 - <<'PYEOF' || ERR=1
import re, sys
src = open('index.html', encoding='utf-8').read()
m = re.search(r'<script type="module">(.*?)</script>', src, re.S)
code = m.group(1)

hors = []          # positions des virgules situées hors chaîne et hors commentaire
i, n = 0, len(code)
chaine = None; ligne = 1
while i < n:
    c = code[i]
    if c == '\n': ligne += 1
    if chaine:
        if c == '\\': i += 2; continue
        if c == chaine: chaine = None
        i += 1; continue
    if c in '"\'`': chaine = c; i += 1; continue
    if code.startswith('//', i):
        j = code.find('\n', i); i = n if j < 0 else j; continue
    if code.startswith('/*', i):
        j = code.find('*/', i); i = n if j < 0 else j + 2; continue
    if c == ',': hors.append((i, ligne))
    i += 1

# deux virgules hors chaîne séparées uniquement par des espaces ou un commentaire
pb = []
for k in range(len(hors) - 1):
    a, la = hors[k]; b, _ = hors[k + 1]
    entre = code[a + 1:b]
    if re.fullmatch(r'[\s]*(?:/\*.*?\*/[\s]*)*', entre, re.S):
        pb.append((la, code[max(0, a - 70):b + 40].replace('\n', ' ')))
if pb:
    print(f"❌ {len(pb)} virgule(s) double(s) — trou de tableau, le module plantera au chargement :")
    for la, ctx in pb[:5]:
        print(f"     ligne {la} du module : …{ctx}…")
    sys.exit(1)
print("✓ aucune virgule double (aucun trou de tableau)")
PYEOF

node --check /tmp/_verif_cls.js && echo "✓ les scripts classiques compilent" || ERR=1
node --check sw.js && echo "✓ sw.js compile" || ERR=1

# la version du cache doit avoir été incrémentée
V=$(grep -oE "quiz-tsi-v[0-9]+" sw.js | head -1)
echo "✓ version du cache : $V"

[ $ERR -eq 0 ] && echo "" && echo "✅ prêt à déployer" || { echo "❌ NE PAS DÉPLOYER"; exit 1; }

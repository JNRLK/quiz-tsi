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
node --check /tmp/_verif_cls.js && echo "✓ les scripts classiques compilent" || ERR=1
node --check sw.js && echo "✓ sw.js compile" || ERR=1

# la version du cache doit avoir été incrémentée
V=$(grep -oE "quiz-tsi-v[0-9]+" sw.js | head -1)
echo "✓ version du cache : $V"

[ $ERR -eq 0 ] && echo "" && echo "✅ prêt à déployer" || { echo "❌ NE PAS DÉPLOYER"; exit 1; }

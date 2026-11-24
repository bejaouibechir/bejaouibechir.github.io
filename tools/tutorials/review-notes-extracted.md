# Notes de revue retirees du livre blanc

Extraites le 2026-11-25 par `strip_review_comments.py`.
Elles etaient publiees en commentaires HTML dans les pages `/dsl/*`.
**Interne. Ne pas republier.** A verser dans le registre des points bloquants.


## 02-jobs-part1.md

- **l.142** — REVIEW (décision H) : extract.limit est accepté pour tous les types mais n'est appliqué que par MongoDB ; ignoré en silence ailleurs (CSV, SQL…). Le documenter comme MongoDB seulement, ou l'implémenter partout ?
- **l.146** — REVIEW (décision E) : base_path relatif est résolu depuis le répertoire courant et non depuis le dossier du job. Exemple avec base_path non publié tant que ce point n'est pas tranché.
- **l.534** — REVIEW (décision G) : MongoDB en destination — le connecteur utilise les modes insert / upsert / replace et `upsert_key` (défaut _id). Correspondance avec load.mode / load.key à confirmer avant de publier un exemple.

## 02-jobs-part2.md

- **l.206** — REVIEW (décision I) : le parseur accepte `date`, mais le moteur le refuse (« Unsupported type »). `date` non documenté tant que ce n'est pas corrigé. Les alias integer/string/boolean sont refusés par le parseur.
- **l.582** — REVIEW (décision B) : le code transmet `func` à pandas sans contrôle (median, std, nunique… fonctionnent). Seules les 8 fonctions annoncées sont documentées.
- **l.735** — REVIEW (décision D) : `right` accepte aussi une source inline (dict avec `type`). Non documenté tant que ce n'est pas décidé.
- **l.1143** — REVIEW : `amount != amount` est l'idiome pandas pour « valeur vide ». Pas de fonction isnull() documentée dans les expressions. À confirmer ou à remplacer par une opération dédiée.
- **l.1259** — REVIEW : la ligne de log de l'exemple 1 est en français dans le code (executor.py, large_volume.decide). À traduire côté code (Règle −2) ou à retirer de la page.

## 04-actions.md

- **l.239** — REVIEW (décision J) : sujet par défaut « (sans objet) » en français dans le code.

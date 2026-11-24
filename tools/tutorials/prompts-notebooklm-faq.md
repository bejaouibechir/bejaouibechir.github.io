# Prompts NotebookLM — FAQ hydraetl.com (jeu révisé)

Version : 2026-11-24, 23 h 40. Remplace intégralement le jeu précédent.
Produit : Hydra ETL 0.22.0.

## Ce qui a changé, et pourquoi

| Avant | Maintenant |
|---|---|
| Prompt 1 « inventaire des FAQ existantes » | **Supprimé.** Remplacé par `extract_faq_index.py` : 541 questions recensées sans erreur. Un LLM boucle et tronque sur ce genre de tâche — constaté. |
| « exclure ce qui existe déjà » (à deviner) | La liste d'exclusion est fournie comme source : `faq-index.md` |
| Migration = une intention comme les autres | Migration **saturée** : 189 questions sur 9 pages concurrents. Seules les questions inter-outils ont droit de cité |
| « ne compare jamais à un concurrent nommé » | Faux pour ce site : 9 pages de comparaison assumées. On autorise, à condition de citer la page |
| Sorties non bornées | Chaque prompt borne sa sortie et interdit de recommencer la liste |

## Les 7 sources du notebook

```
faq-index.md              ← la liste d'exclusion, indispensable
pillars.md                ← /migrate (9 pages), get-started, install, license, playground, firstjob, vscode, changelog
lessons-01-studio.md
lessons-02-orchestration.md
cli-guides.md
guide.md
reference.md              ← /cli (45 pages) + /dsl (39 pages)
```

Les 6 cases cochées ne suffisent pas : vérifie que `faq-index.md` en fait partie, sinon tous les prompts reproduiront l'existant.

## Règles de passation

- **Un prompt = un chat neuf.** Jamais deux prompts à la suite dans la même conversation.
- Si la sortie **se répète ou se coupe**, ne corrige pas en langage naturel : relance en réduisant le nombre demandé de moitié.
- Colle la sortie brute dans `out-P2.md`, `out-P3.md`, … sans nettoyer.
- Une réponse sans citation de source est nulle : relance.

---

## P1 — Questions transverses non couvertes

À lancer **une intention à la fois** : remplace la ligne `INTENT:` et relance dans un chat neuf. Sept passages. C'est plus long, mais une seule intention par réponse évite la troncature qui a ruiné l'ancien prompt 1.

> You are auditing coverage gaps in this documentation set.
>
> INTENT: licensing and commercial use
> (replace with one of: installation and Python version and Windows vs Linux differences | choosing between Hydra Studio and the hdrctl command line | cross-tool migration questions | project job workflow and thread concepts | configuration environments and secrets | running in production, scheduling and reliability)
>
> The per-page FAQ already answers page-specific questions. I need the cross-cutting ones for that single intent: what a user asks before or across pages, which no single page owns.
>
> Exclusions, applied strictly:
> - The source "faq-index.md" lists the 541 questions already published, grouped by page. It is a blocklist. Drop any question that matches one of them in meaning, not merely in wording.
> - Migration is saturated: /migrate already carries 189 questions across 9 competitor pages. A migration question qualifies only if it is cross-tool — true whatever the user is coming from. Anything tool-specific is already owned.
>
> For each question you keep:
> - `Q:` the question in the words a real user would type into a search engine or ask an AI assistant. Not documentation phrasing.
> - `Closest existing:` the nearest question from faq-index.md, and in one clause why yours is not it. If you cannot name a real difference, drop the question instead.
> - `A:` a direct answer of 40 to 60 words, grounded only in these sources.
> - `Source:` page title + slug for every factual part of the answer.
> - If the sources do not fully answer it, replace `A:` with `INSUFFICIENT SOURCE` and state precisely what is missing.
>
> Produce at most 8 questions for this intent. Fewer is better than padded. Answer in one pass: never restart the list, never repeat a block. If you have more, end with the single line `MORE AVAILABLE`.

---

## P2 — Erreurs et dépannage

À lancer **une source à la fois** : `lessons-01-studio.md`, puis `lessons-02-orchestration.md`, puis `cli-guides.md`, puis `guide.md`. Quatre passages.

> Restrict yourself to the single source named here: SOURCE: lessons-01-studio.md
>
> Scan it for every error message, failure mode, warning, traceback and "common errors" or "what if something goes wrong" table.
>
> For each distinct error:
> - `Query:` what the user would type when they hit it. Include the verbatim error string when the source reproduces one.
> - `Error:` the exact string as written in the source, or `not reproduced in sources`.
> - `Cause:` one sentence, from the source only.
> - `Fix:` the steps, from the source only.
> - `Source:` page title + slug.
>
> Absolute rules: never reconstruct, translate, complete or guess an error message. If the source only paraphrases it, write `not reproduced in sources`. Never merge two different errors into one entry. Never carry an error from one page onto another.
>
> Produce at most 20 entries, ordered from most to least likely for a new user, and state in one line what that ordering rests on. Answer in one pass: never restart the list, never repeat an entry. If more remain, end with the single line `MORE AVAILABLE`.

---

## P3 — Décision, capacité et limites

> A user evaluating Hydra ETL asks decision questions. Generate them from these sources only.
>
> Three categories:
> - **Internal choices**: a genuine fork the product offers — Studio vs the CLI, job vs workflow vs thread, Error Scope vs Retry Scope, which trigger type, and any other the sources describe.
> - **Capability**: "can it do X", "does it support X", where the sources explicitly confirm or explicitly rule out X.
> - **Boundaries**: what the tool is not meant for, and what it requires that a user may not have.
>
> Constraints:
> - You may repeat a comparison with a named competitor ONLY where a `/migrate/<tool>/` page already states it. Cite that page. Never extend the claim, never soften it, and never apply a claim made about one tool to another.
> - Never introduce a competitor the sources do not already cover.
> - Never state a version number, a benchmark, a performance figure or a limit that is not written in the sources.
> - Drop any question already in faq-index.md.
> - If the sources do not settle a question, write `NOT SETTLED BY SOURCES` and stop there for it.
>
> For each: the question in a user's own words, a 40 to 60 word answer, the source reference.
>
> Produce at most 12 questions, grouped by the three categories. Answer in one pass: never restart the list. If more remain, end with `MORE AVAILABLE`.

---

## P4 — Les trous (le plus important)

Avec 541 réponses déjà en ligne, ce qui manque encore vaut plus que ce qui existe.

> Switch roles: you are a skeptical new user, not a writer.
>
> These sources document Hydra ETL across 118 pages and already answer 541 questions (see faq-index.md). List the questions you would genuinely ask that these sources **cannot** answer, or answer only partially.
>
> Be concrete. Not "more examples would help", but the actual question that goes unanswered.
>
> For each gap:
> - `Question:` what the user asks.
> - `Who is blocked:` one sentence — which user, at which moment.
> - `Closest page:` the page that comes nearest, its slug, and exactly where it stops short.
> - `What would close it:` the minimum content — a section, a lesson, a table, a screenshot.
> - `Evidence:` the sentence in the sources that shows the gap, or `nothing in sources addresses this`.
>
> Rank by how often you expect the question to arise. Produce at most 12 gaps. Ten real ones beat forty speculative ones.
>
> Do not answer any of these questions. Do not use anything outside these sources to fill them. Answer in one pass: never restart the list.

---

## P5 — Mise en forme finale

À lancer **après ton tri**, en recollant seulement les questions retenues.

> Reformat the question-and-answer pairs below into this exact structure, one block per question, nothing else:
>
> ```
> ## <question, in the user's own words, a full sentence ending in a question mark>
>
> <direct answer, 40 to 60 words, no preamble, first sentence answers the question>
>
> **Source:** <page title> — <slug>
> **Intent:** <one of: licensing | install | studio-vs-cli | migration | concepts | config-secrets | production | error | decision>
> **Anchor:** <kebab-case slug of 3 to 6 words, derived from the question>
> **Routes to:** <slug of the page that owns the full answer, or `none` if this FAQ entry is the owner>
> ```
>
> Rules:
> - Every answer strictly 40 to 60 words. Count them.
> - No headings, intros, conclusions or table of contents.
> - Change no factual claim and no source reference.
> - `Routes to` is the point of this page: most entries should route. Set it to `none` only where no existing page owns the answer.
> - If an answer cannot be accurate within 60 words, keep it accurate and put `TOO LONG — NEEDS SPLIT` on its own line above the `##`.

---

## Garde-fous (charte, à ne pas laisser sauter)

- Aucun chiffre, aucune version, aucun message d'erreur sans preuve dans les sources.
- Jamais de mention d'un client de l'auteur.
- URLs et secrets d'exemple inventés (`example.test`).
- Interpréteur Windows : `py`, jamais `python`. Linux/macOS : `python3`.
- Un conseil qui n'est pas une règle du produit est étiqueté `our recommendation`.
- Un comportement de Studio non observé en direct se formule `according to the source … we did not test this`.

## Après NotebookLM

1. Relancer `extract_faq_index.py` après chaque nouvelle leçon : la liste d'exclusion doit rester juste.
2. `/guide` n'est pas renommée : c'est une section de 41 pages, et GitHub Pages ne sait pas faire de 301.
3. `/faq` est un routeur, pas une page de contenu : questions transverses seulement, le reste en liens vers les ancres.
4. `llms.txt` pointe vers `/faq` ; `llms-full.txt` se génère depuis `faq-index.tsv`.

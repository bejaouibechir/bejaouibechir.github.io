
### Fixed

- `aggregate` with `sum` or `mean` on a text column concatenated the values instead of adding them
  (`"19.9" + "49.9"` → `"19.949.9"`), with no error: a CSV column read without `cast` is text, so a job that
  re-read a CSV written by another job produced a wrong total. The step now fails with
  `aggregate.agg.revenue: sum needs a numeric column ('amount' is object). Add a cast step before aggregate,
  for example: cast: {mapping: {amount: float}}`. Same message with the large-volume engine (DuckDB hands the
  step back to pandas instead of raising a Binder Error). `count`, `min`, `max`, `first` and `last` still
  accept text.
- The `log` action's message was written to the logger only, so `hdrctl run` did not show it. It is now the
  step's output: shown under the step, like the output of a script action, and kept in the run result.
- Error messages still in French are in English: transformations (`select`, `rename`, `cast`, `filter`,
  `calculate`, `clean`, `join`, `merge`, `union`, `script`, `transpose`, `aggregate`), manifest checks
  (`clean.case must be none, lower or upper`, `join.how`, cast types), the job runner (`Cannot create the
  source 'raw_orders' (type='csv')`, `Step 2/3: …` instead of `Erreur à l'étape 2/3`), parameters, `.env`
  files, the MCP workspace guard and the API routes.

### Added

- `examples/end-to-end-retail`: a master project runs two sub-projects in parallel, then a job and actions
  read what they returned. Files only, runs in a few seconds.

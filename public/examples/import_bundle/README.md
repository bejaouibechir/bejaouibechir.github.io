# import_bundle

This folder exists for one button: **Import workflow** in Hydra Studio.

Studio looks for a file named exactly `workflow.yaml` at the root of the folder
you select, then resolves each `job:` path from that same root. The canonical
project layout puts the workflow under `workflows/` and refers to jobs as
`../jobs/<name>`, which the importer cannot follow — a relative path never
climbs above the selected folder. Hence this second, self-contained copy.

## Use it

1. In Studio, open the project that should receive the workflow.
2. Select **Import workflow**.
3. Pick this folder — `import_bundle`, not `workflows`.

## What the import keeps, and what it drops

| | Import workflow | Open a project |
|---|---|---|
| Job steps | kept | kept |
| Action steps | **dropped from the canvas** | kept |
| Containers | **dropped** | kept |
| Job canvases | rebuilt from the YAML | read from the saved layout |

The importer only builds canvas nodes for `type: job` steps. The full YAML is
still stored, so nothing is lost on disk — but the canvas you get is not the
canvas this demo was designed to show.

**For a demo, prefer Open a project on the parent folder.** That route reads
`.hydra/` and restores the two containers, the three actions and every job
canvas exactly as designed.

## Data paths

The job manifests read `../../Data/orders.csv` and write to `../../output/`.
After an import, those resolve against the receiving project, so it needs its
own `Data/orders.csv`. Copy the one from the parent folder if it is missing.

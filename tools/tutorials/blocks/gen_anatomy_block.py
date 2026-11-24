"""Lesson 'Anatomy of a job' (plan n. 07b): slug anatomy-of-a-job."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
faq = [
 ("What files make up a Hydra job?", "A job is a folder with four YAML manifests: sources.yaml, transformations.yaml, destinations.yaml and pipeline.yaml. In the project created by hdrctl init 0.22 the folder is jobs/job1, and it also holds a README.md and a data folder with a sample input.csv."),
 ("Which manifest is optional?", "transformations.yaml. In our test a job without it validated and ran, and wrote all 3 rows read, where the job with it wrote 2. We removed destinations.yaml in a test and validate reported it as MISSING; we did not test removing the other files."),
 ("How does pipeline.yaml connect the other files?", "Through ids. pipeline.from names a source declared in sources.yaml, and pipeline.to names a destination declared in destinations.yaml. validate reports an id that is not found and tells you in which file it looked."),
 ("Where are the paths in a job resolved from?", "In the generated job, the source reads data/input.csv and the destination writes data/output.csv. After a run, output.csv appeared in jobs/job1/data, next to input.csv, so these relative paths start from the job folder."),
 ("How do I check a job without running it?", "Run hdrctl validate jobs/job1. It checks that each file is present and valid and that pipeline.from and pipeline.to resolve. hdrctl run . --dry-run validates the whole project and runs nothing."),
]
s = common(7, "Anatomy of a job", "What a Hydra job is made of: four YAML files",
 "A Hydra job is a folder of four YAML manifests. Create a project, read each file, break one on purpose and see what validate says.",
 '<span class="mono">hdrctl init</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A Hydra job is a folder with <code>sources.yaml</code>, <code>transformations.yaml</code>, <code>destinations.yaml</code> and <code>pipeline.yaml</code>. <code>pipeline.yaml</code> links the other files by id, and <code>hdrctl validate</code> checks the links before any data moves.",
 "Create a project, read the four manifests of its first job, run it, and see what validate reports when a file or an id is missing.",
 "What is a job made of?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li>')
s += step(1, "Create a project", "Let Hydra write a first job.",
 ["Open a terminal in an empty folder.", "Run the command below."],
 "hdrctl init anatomy-demo",
 "<p>The command creates the project folder and lists every file it writes. The job is <code>jobs/job1</code>. The default template is <code>csv</code>, a small CSV to CSV job with sample data.</p>",
 "A list of <code>ok</code> lines ending with <code>Project 'anatomy-demo' created (workflow1 with job1)</code>.",
 "ok  jobs/job1/sources.yaml\nok  jobs/job1/destinations.yaml\nok  jobs/job1/pipeline.yaml\nok  jobs/job1/transformations.yaml\nok  jobs/job1/data/input.csv\nok  jobs/job1/README.md\nok  workflows/workflow1.yaml\nok  workflows/thread.yaml\n...")
s += step(2, "Read the source and the destination", "Two files declare where data comes from and goes.",
 ["Open <code>jobs/job1/sources.yaml</code>.", "Open <code>jobs/job1/destinations.yaml</code>."],
 "jobs/job1/sources.yaml\njobs/job1/destinations.yaml",
 "<p>Each file declares one or more entries under an id you choose: <code>src_csv</code> and <code>dest_csv</code>. An entry has a <code>type</code> and the place to read or write, here a file path. The paths are relative to the job folder.</p><pre class=\"cmd\">sources:\n  src_csv:\n    type: csv\n    extract:\n      table: data/input.csv\n      batch_size: 50000\n\ndestinations:\n  dest_csv:\n    type: csv\n    load:\n      table: data/output.csv\n      mode: replace</pre>",
 "<code>src_csv</code> reads <code>data/input.csv</code>. <code>dest_csv</code> writes <code>data/output.csv</code> and replaces it at each run.",
 "")
s += step(3, "Read the transformations", "The steps applied between the two.",
 ["Open <code>jobs/job1/transformations.yaml</code>."],
 "jobs/job1/transformations.yaml",
 "<p>The file is an ordered list of steps. This one keeps three columns, casts <code>value</code> to a float and keeps the rows where <code>value</code> is above zero.</p><pre class=\"cmd\">steps:\n  - select:\n      columns: [id, name, value]\n  - cast:\n      mapping:\n        value: float\n  - filter:\n      expr: \"value &gt; 0\"</pre>",
 "Three steps: select, cast, filter.",
 "")
s += step(4, "Read the pipeline", "The file that ties the others together.",
 ["Open <code>jobs/job1/pipeline.yaml</code>."],
 "jobs/job1/pipeline.yaml",
 "<p>The pipeline holds no data details. It names a source id and a destination id, and nothing else. It does not mention <code>transformations.yaml</code>: in our test the file was applied anyway because it sits in the job folder.</p><pre class=\"cmd\">pipeline:\n  from: src_csv\n  to: dest_csv</pre>",
 "Two lines: <code>from</code> and <code>to</code>.",
 "")
s += step(5, "Validate and run the job", "Check the links, then move the data.",
 ["Run <code>hdrctl validate jobs/job1</code>.", "Run <code>hdrctl run jobs/job1</code>."],
 "hdrctl validate jobs/job1\nhdrctl run jobs/job1",
 "<p><code>validate</code> checks each file and resolves <code>pipeline.from</code> and <code>pipeline.to</code> against the ids. The run reads three rows and writes two: the row with a negative <code>value</code> is filtered out. The result is <code>jobs/job1/data/output.csv</code>.</p>",
 "<code>DSL valid</code>, then <code>Pipeline completed successfully</code> with 3 rows read and 2 written.",
 "ok  sources.yaml                         — Pydantic valid\nok  destinations.yaml                    — Pydantic valid\nok  transformations.yaml                 — Pydantic valid\nok  pipeline.from                        — resolved: src_csv\nok  pipeline.to                          — resolved: dest_csv\nDSL valid — no errors detected.\n\nPipeline completed successfully in 3.0s\nRows read   : 3\nRows written: 2")
s += step(6, "Break it on purpose", "Read the errors you will meet.",
 ["Move <code>transformations.yaml</code> out of the folder and run the job again.", "Put it back. In <code>pipeline.yaml</code>, change <code>src_csv</code> to <code>src_missing</code> and validate.", "Restore it. Move <code>destinations.yaml</code> away and validate."],
 "hdrctl validate jobs/job1",
 "<p>Without <code>transformations.yaml</code> the job still runs and writes all three rows. A pipeline that names an unknown id is reported with the file where Hydra looked. A missing <code>destinations.yaml</code> gives two errors: the file is missing, and <code>pipeline.to</code> cannot be resolved.</p>",
 "<code>1 error(s) detected</code> for the unknown source, <code>2 error(s) detected</code> for the missing destinations file.",
 "err pipeline.from='src_missing' not found in sources.yaml\n1 error(s) detected.\n\nerr destinations.yaml — MISSING\nerr pipeline.to='dest_csv' not found in destinations.yaml\n2 error(s) detected.")
s += rules([("TIP", "Read <code>pipeline.yaml</code> first. It is two lines and shows which source feeds which destination."),
 ("TIP", "Run <code>hdrctl validate</code> after each edit. It costs nothing and reports the file and the id at fault."),
 ("TRAP", "Do not leave an old <code>transformations.yaml</code> in a job folder. In our test it was applied even though <code>pipeline.yaml</code> did not mention it."),
 ("TRAP", "Ids are free text. If you rename <code>src_csv</code> in <code>sources.yaml</code>, change <code>pipeline.from</code> too.")])
s += tail([["Files", "sources, transformations, destinations, pipeline"], ["Link", "pipeline.from and pipeline.to name ids"], ["Optional", "transformations.yaml only"], ["Check", "hdrctl validate jobs/job1"]],
 [["destinations.yaml MISSING", "The file is not in the job folder", "Restore it or recreate the job"], ["pipeline.from not found", "The id is not declared in sources.yaml", "Align the id in both files"], ["Rows read equals rows written", "No transformations.yaml in the folder", "Check the file name and place"], ["Not a job folder", "The command ran from the wrong folder", "Pass the job folder to the command"]],
 faq, REL + '<li><a href="/studio/05-add-a-source">Create a job, then give it a source</a></li><li><a href="/studio/08-see-the-yaml">Read the manifests Studio generates</a></li><li><a href="/studio/09-reach-valid">Resolve what the validity badge reports</a></li>',
 "A job is four files and two ids. Next, see how Studio writes them from the canvas.",
 '<a class="primary" href="/studio/08-see-the-yaml">See the YAML <span aria-hidden="true">→</span></a>') + CTA
publish(7, "anatomy-of-a-job", "Anatomy of a job", s,
 "What a Hydra job is made of: four YAML files", "What a Hydra job is made of", "Hydra Job Anatomy: the Four YAML Files | Hydra ETL",
 "Read the four YAML files of a Hydra job, run it, then break it on purpose and read what hdrctl validate reports. Tested with Hydra ETL 0.22.",
 ["Create a project", "Read the source and the destination", "Read the transformations", "Read the pipeline", "Validate and run the job", "Break it on purpose"], faq,
 "Anatomy of a job", "The four manifests of a job folder, how they link, and what validate says when one breaks.")

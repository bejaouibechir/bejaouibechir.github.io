"""Lesson 'File sources' : slug read-csv-json-and-parquet-files."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
faq = [
 ("How do I read a CSV, JSON or Parquet file in Hydra ETL?", "Declare a source in sources.yaml with type csv, json or parquet, and put the file path in extract.table. Nothing else changes between the three. In our test each job read 3 rows and wrote 3."),
 ("Is the path relative to something?", "In our test, a path such as data/people.csv was read from the job folder, so the files sat in jobs/<job>/data."),
 ("What shape must a JSON file have?", "We tested a file that holds a list of objects, one object per row, with the same keys in each. Other shapes were not tested."),
 ("Does Parquet need an extra package?", "According to pyproject.toml, Parquet support comes with the optional parquet extra, which installs pyarrow. Install it with pip install \"hydra-etl[parquet]\" if Hydra ETL complains. We created our Parquet file with pandas."),
 ("Can I read a CSV that uses semicolons?", "Not in our test on Hydra ETL 0.22. We set delimiter under connection and next to extract, and each time the file loaded as one column named id;name;value. Until this changes, convert the file to commas, or check the release notes of your version."),
]
s = common(19, "File sources", "Read CSV, JSON and Parquet files in a Hydra job",
 "CSV, JSON and Parquet sources are declared the same way: a type and a path. Build three jobs, run them, and read the error of a missing file.",
 '<span class="mono">type: csv | json | parquet</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A file source is a <code>type</code> (<code>csv</code>, <code>json</code> or <code>parquet</code>) and a path in <code>extract.table</code>. The path is read from the job folder. A missing file stops the job with <code>source file not found</code>.",
 "Prepare one small file in each format, declare three sources, run the jobs, and read what a missing file gives.",
 "How do I read a CSV, JSON or Parquet file?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed, and a project folder such as the one built in <a href="/studio/anatomy-of-a-job">Anatomy of a job</a>. See <a href="/studio/install-and-start">Install and start</a>.</li><li>For Parquet: <code>pyarrow</code> (<code>pip install "hydra-etl[parquet]"</code>), which pandas needs to write the file.</li>')
s += step(1, "Prepare one file per format", "The same three rows in three formats.",
 ["Create the folders <code>jobs/csv-job/data</code>, <code>jobs/json-job/data</code> and <code>jobs/parquet-job/data</code>.", "Save the CSV and the JSON content below in them.", "Create the Parquet file with the command below."],
 "jobs/csv-job/data/people.csv\njobs/json-job/data/people.json\npy -c \"import pandas as pd; pd.DataFrame({'id':[1,2,3],'name':['Alice','Bob','Charlie'],'value':[100,200,-5]}).to_parquet('jobs/parquet-job/data/people.parquet')\"",
 "<p>The CSV has a header and commas. The JSON file is a list of objects.</p><pre class=\"cmd\">id,name,value\n1,Alice,100\n2,Bob,200\n3,Charlie,-5</pre><pre class=\"cmd\">[\n  {\"id\": 1, \"name\": \"Alice\", \"value\": 100},\n  {\"id\": 2, \"name\": \"Bob\", \"value\": 200},\n  {\"id\": 3, \"name\": \"Charlie\", \"value\": -5}\n]</pre>",
 "Three <code>people</code> files, one per job folder.",
 "")
s += step(2, "Declare the three sources", "Only the type and the path change.",
 ["In each job folder, create <code>sources.yaml</code>, <code>destinations.yaml</code> and <code>pipeline.yaml</code> as below.", "Change <code>type</code>, the source id and the file name for the JSON and Parquet jobs."],
 "jobs/csv-job/sources.yaml\njobs/csv-job/destinations.yaml\njobs/csv-job/pipeline.yaml",
 "<p>The destination is a CSV file in every job, so the three results can be compared. The pipeline links the ids, as in <a href=\"/studio/anatomy-of-a-job\">Anatomy of a job</a>. These jobs have no <code>transformations.yaml</code>, which is allowed.</p><pre class=\"cmd\">sources:\n  src_csv_job:\n    type: csv          # json, parquet\n    extract:\n      table: data/people.csv   # people.json, people.parquet\n\ndestinations:\n  dest_csv:\n    type: csv\n    load:\n      table: data/out_csv-job.csv\n      mode: replace\n\npipeline:\n  from: src_csv_job\n  to: dest_csv</pre>",
 "Three job folders with three manifests each.",
 "")
s += step(3, "Validate and run each job", "Same result from three formats.",
 ["Run the two commands below for <code>csv-job</code>.", "Repeat for <code>json-job</code> and <code>parquet-job</code>."],
 "hdrctl validate jobs\\csv-job\nhdrctl run jobs\\csv-job",
 "<p>Each job reads three rows and writes three: nothing filters them. The output file is the same for the three formats.</p><pre class=\"cmd\">id,name,value\n1,Alice,100\n2,Bob,200\n3,Charlie,-5</pre>",
 "<code>Pipeline completed successfully</code> three times, with 3 rows read and 3 written.",
 "Pipeline completed successfully in 1.6s\nRows read   : 3\nRows written: 3")
s += step(4, "Read the error of a missing file", "Know the message when the path is wrong.",
 ["Copy <code>csv-job</code> to <code>missing-file</code> and set <code>table: data/nothing.csv</code>.", "Run the job."],
 "hdrctl run jobs\\missing-file",
 "<p>Hydra does not mention the folder. It names the connector and the source id. Check the path against the job folder, as the path is read from there.</p>",
 "A failed run with <code>source file not found</code>.",
 "Job 'missing-file' failed: ValueError: CSVConnector [src_missing_file]: source file not found.\nPipeline FAILED in 1.7s")
s += rules([("TIP", "Keep one small sample file next to each job. A three-row file makes every run take seconds."),
 ("TIP", "Add a <code>select</code> step in <code>transformations.yaml</code> when you need to prove the columns were split: it fails with the list of the columns that Hydra found."),
 ("TRAP", "On Hydra ETL 0.22 we could not read a semicolon-separated CSV into columns. The file loaded as one column named <code>id;name;value</code>, and a <code>select</code> of <code>name</code> failed. The run itself still reported success, so check the columns."),
 ("TRAP", "A CSV has no types: every value is text until you cast it. Cast before you compare numbers.")])
s += tail([["Type", "csv, json or parquet"], ["Path", "extract.table, read from the job folder"], ["Parquet", "needs pyarrow"], ["Check", "select a column to prove the split"]],
 [["source file not found", "The path is wrong or the file is in another folder", "Check extract.table against the job folder"], ["select: unknown columns", "The file was not split as you expect", "Look at the Available columns list"], ["Parquet cannot be read", "pyarrow is missing", "pip install \"hydra-etl[parquet]\""], ["Not a job folder", "The command ran from the wrong place", "Pass the job folder to the command"]],
 faq, REL + '<li><a href="/studio/anatomy-of-a-job">What a Hydra job is made of</a></li><li><a href="/studio/05-add-a-source">Create a job, then give it a source</a></li><li><a href="/studio/06-add-a-transformation">Reshape the data between source and destination</a></li>',
 "A file source is a type and a path. Next, reshape the rows between source and destination.",
 '<a class="primary" href="/studio/06-add-a-transformation">Transformations <span aria-hidden="true">→</span></a>') + CTA
publish(19, "read-csv-json-and-parquet-files", "File sources", s,
 "Read CSV, JSON and Parquet files in a Hydra job", "Read CSV, JSON and Parquet files in a Hydra job", "Hydra File Sources: Read CSV, JSON, Parquet | Hydra ETL",
 "Declare CSV, JSON and Parquet file sources in a Hydra job, run them, and read the error of a missing file. Tested with Hydra ETL 0.22.",
 ["Prepare one file per format", "Declare the three sources", "Validate and run each job", "Read the error of a missing file"], faq,
 "Configure CSV, JSON and Parquet sources", "Declare a CSV, JSON or Parquet source, run it and read the error of a missing file.")

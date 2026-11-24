"""Lesson 'Transformations 2' : slug clean-split-window-pivot-and-script."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
faq = [
 ("How do I clean spaces and letter case in Hydra ETL?", "Use the clean transformation: clean with columns and case set to lower or upper. It removed the spaces around values and lowered the case in our test. According to the source, without columns it applies to all text columns; we did not test that."),
 ("How do I split a value into several rows?", "Use text_to_rows with the column and a separator. In our test a tags value a;b became two rows, and the other columns were copied. 3 rows in, 5 rows out."),
 ("How do I number rows or compute a running total?", "Use window with partition_by, order_by and columns. row_number, cumsum and lag worked in our test. cumsum needs a numeric column, so cast a CSV column first."),
 ("What do pivot and unpivot do?", "pivot turns the values of a column into columns, with an aggregate such as sum. unpivot does the reverse and turns columns back into rows. Both ran on two small files in our test."),
 ("Can I write my own Python step?", "Yes, with the script transformation: you declare input columns, typed output columns and the code. It runs in a restricted environment: an import was refused in our test. The error message is in French in Hydra ETL 0.22."),
]
s = common(24, "Transformations 2", "Clean, split, window, pivot and script transformations",
 "Six transformations that the first lesson did not cover. Each one runs in a tiny job on three or four rows, and you see the rows before and after.",
 '<span class="mono">clean · text_to_rows · window · pivot · unpivot · script</span><span>about 20 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "Six more steps for <code>transformations.yaml</code>: <code>clean</code> tidies text, <code>text_to_rows</code> splits one value into rows, <code>window</code> numbers and accumulates, <code>pivot</code> and <code>unpivot</code> turn rows into columns and back, and <code>script</code> runs your own Python.",
 "Run six tiny jobs, one transformation each, and read the rows they produce.",
 "How do I clean, split, pivot and script data?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed, and the first transformations lesson, <a href="/studio/06-add-a-transformation">Reshape the data</a>. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A job folder with a CSV source and a CSV destination, as in <a href="/studio/read-csv-json-and-parquet-files">Read CSV, JSON and Parquet files</a>. Only <code>transformations.yaml</code> changes below.</li>')
s += step(1, "Clean spaces and case", "Make text comparable.",
 ["Use <code>orders.csv</code>, whose first row has spaces around <code>north</code> and <code>Apple</code>.", "Put the step below in <code>transformations.yaml</code> and run the job."],
 "steps:\n  - clean:\n      columns: [region, product]\n      case: lower\n\nhdrctl run jobs\\t-clean",
 "<p>Input and output, three rows each. <code>case</code> accepts <code>none</code>, <code>lower</code> and <code>upper</code>.</p><pre class=\"cmd\">id,region,product,qty,price,tags\n1,  north ,  Apple ,10,2.5,a;b\n2,SOUTH,Pear,5,4,c\n3,north,apple,7,2.5,a;c\n\nid,region,product,qty,price,tags\n1,north,apple,10,2.5,a;b\n2,south,pear,5,4,c\n3,north,apple,7,2.5,a;c</pre>",
 "3 rows read, 3 written, with <code>north</code>, <code>south</code> and <code>apple</code> in lower case and without spaces.",
 "Rows read   : 3\nRows written: 3")
s += step(2, "Split a value into rows", "One row per tag.",
 ["Use the same file.", "Put the step below in <code>transformations.yaml</code> and run the job."],
 "steps:\n  - text_to_rows:\n      column: tags\n      sep: \";\"\n\nhdrctl run jobs\\t-split",
 "<p>The <code>tags</code> value <code>a;b</code> becomes two rows, and every other column is copied. The step does not clean the other columns: the spaces around <code>north</code> are still there.</p><pre class=\"cmd\">1,  north ,  Apple ,10,2.5,a\n1,  north ,  Apple ,10,2.5,b\n2,SOUTH,Pear,5,4,c\n3,north,apple,7,2.5,a\n3,north,apple,7,2.5,c</pre>",
 "3 rows read, 5 written.",
 "Rows read   : 3\nRows written: 5")
s += step(3, "Number rows and add a running total", "Window functions keep every row.",
 ["Use <code>sales.csv</code>: region, month, amount, four rows.", "Put the steps below in <code>transformations.yaml</code> and run the job."],
 "steps:\n  - cast:\n      mapping:\n        amount: int\n        month: int\n  - window:\n      partition_by: [region]\n      order_by: [month]\n      columns:\n        step: {func: row_number}\n        running: {func: cumsum, col: amount}\n        previous: {func: lag, col: amount, default: 0}\n\nhdrctl run jobs\\t-window",
 "<p>Each region is its own partition. <code>window</code> adds three columns and keeps the four rows. The <code>cast</code> comes first because a CSV has no types and <code>cumsum</code> needs numbers.</p><pre class=\"cmd\">region,month,amount,step,running,previous\nnorth,1,10,1,10,0\nnorth,2,20,2,30,10\nsouth,1,5,1,5,0\nsouth,2,15,2,20,5</pre>",
 "4 rows read, 4 written, with three new columns.",
 "Rows read   : 4\nRows written: 4")
s += step(4, "Turn rows into columns", "Pivot the months.",
 ["Use the same <code>sales.csv</code>.", "Put the steps below in <code>transformations.yaml</code> and run the job."],
 "steps:\n  - cast:\n      mapping:\n        amount: int\n  - pivot:\n      index: [region]\n      column: month\n      values: amount\n      aggfunc: sum\n\nhdrctl run jobs\\t-pivot",
 "<p>One row per region and one column per month. The columns are named <code>1</code> and <code>2</code>, after the month values.</p><pre class=\"cmd\">region,1,2\nnorth,10,20\nsouth,5,15</pre>",
 "4 rows read, 2 written.",
 "Rows read   : 4\nRows written: 2")
s += step(5, "Turn columns into rows", "Unpivot the months back.",
 ["Use <code>wide.csv</code>: region, m1, m2, two rows.", "Put the step below in <code>transformations.yaml</code> and run the job."],
 "steps:\n  - unpivot:\n      id_vars: [region]\n      var_name: month\n      value_name: amount\n\nhdrctl run jobs\\t-unpivot",
 "<p>Every column that is not in <code>id_vars</code> becomes a row. The output lists <code>m1</code> for both regions first, then <code>m2</code>.</p><pre class=\"cmd\">region,month,amount\nnorth,m1,10\nsouth,m1,5\nnorth,m2,20\nsouth,m2,15</pre>",
 "2 rows read, 4 written.",
 "Rows read   : 2\nRows written: 4")
s += step(6, "Write your own step", "Compute a column with Python.",
 ["Use <code>orders.csv</code>.", "Put the steps below in <code>transformations.yaml</code> and run the job.", "Add <code>import os</code> on the first line of <code>code</code> and run it again."],
 "steps:\n  - cast:\n      mapping:\n        qty: int\n        price: float\n  - script:\n      inputs: [qty, price]\n      outputs:\n        total: float\n      code: |\n        total = qty * price\n\nhdrctl run jobs\\t-script",
 "<p>The code assigns each output column. By default it works on whole columns (<code>vectorized</code>). The new <code>total</code> column holds 25.0, 20.0 and 17.5. With <code>import os</code> added, the run fails: the restricted environment refuses imports.</p>",
 "A <code>total</code> column, then a failed run with the message below.",
 "id,region,product,qty,price,tags,total\n1,  north ,  Apple ,10,2.5,a;b,25.0\n\nJob 't-script-bad' failed: ValueError: Step 2/2: script: 'import' interdit dans le code")
s += rules([("TIP", "Test a transformation on three or four rows first. You can read the whole output by eye."),
 ("TIP", "Put <code>cast</code> before <code>window</code>, <code>pivot</code> and <code>script</code> when they compute on numbers."),
 ("TRAP", "<code>text_to_rows</code> keeps the other columns as they are. Run <code>clean</code> first if their spaces matter."),
 ("TRAP", "The <code>script</code> error is in French in Hydra ETL 0.22. <code>interdit</code> means forbidden.")])
s += tail([["Text", "clean, text_to_rows"], ["Order", "window with partition_by and order_by"], ["Shape", "pivot and unpivot"], ["Code", "script with typed outputs"]],
 [["unknown columns", "The column name changed in an earlier step", "Check the order of the steps"], ["script: import forbidden", "The restricted environment refuses imports", "Write the code with the inputs only"], ["window needs order_by", "Rank, offset and running functions need an order", "Add order_by"], ["Wrong numeric result", "The CSV column is text", "Add a cast step first"]],
 faq, REL + '<li><a href="/studio/06-add-a-transformation">Reshape the data between source and destination</a></li><li><a href="/studio/read-csv-json-and-parquet-files">Read CSV, JSON and Parquet files</a></li><li><a href="/studio/anatomy-of-a-job">What a Hydra job is made of</a></li>',
 "Six more transformations, tested on tiny files. Merge, Union, Trim and Transpose are not covered here. Next, close the job with a destination.",
 '<a class="primary" href="/studio/07-add-a-destination">Destinations <span aria-hidden="true">→</span></a>') + CTA
publish(24, "clean-split-window-pivot-and-script", "Transformations 2", s,
 "Clean, split, window, pivot and script transformations", "Clean, split, window, pivot and script in Hydra ETL", "Hydra Window, Pivot and Script Transforms | Hydra ETL",
 "Clean text, split values into rows, add window columns, pivot, unpivot and run a Python script step in Hydra ETL. Tested with 0.22.",
 ["Clean spaces and case", "Split a value into rows", "Number rows and add a running total", "Turn rows into columns", "Turn columns into rows", "Write your own step"], faq,
 "Transformations, second half", "Clean, split, window, pivot, unpivot and script steps, each run on a tiny file.")

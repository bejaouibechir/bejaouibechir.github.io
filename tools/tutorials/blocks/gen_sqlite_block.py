"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("How do I read a SQLite database with Hydra ETL?", "Declare a source of type sqlite with connection.path, the database file relative to the job folder, and extract.table or extract.query. SQLite is part of Python: there is no server and nothing to install. We tested it with Hydra ETL 0.22 on Windows."),
 ("Should I read a table or a query?", "Use table to read everything, and query to filter or select columns in SQL. In our test the query SELECT order_id, customer, amount FROM orders WHERE amount >= 50 read 3 rows out of 5, with only 3 columns."),
 ("Can Hydra ETL write to SQLite?", "Yes. A destination of type sqlite takes connection.path, load.table and load.mode: append, replace or upsert. The database and the table are created at the first run."),
 ("What does upsert do?", "With mode upsert and key: [order_id], a row whose key exists is updated and a new key is inserted. In our test the second run updated order 2, added order 6 and the table held 6 rows. A third run kept 6 rows. The key became the primary key of the new table."),
 ("What error do I get when the file or the table is missing?", "A missing file gives SQLiteConnector [src_app]: database file not found, followed by the full path. A missing table gives OperationalError: no such table. hdrctl validate passes in both cases: only the run fails."),
]
s = common(20, "Database sources", "Read from and write to a SQLite database in a Hydra ETL job",
 "A sqlite source reads a table or a query from a local file, and a sqlite destination writes it back with append, replace or upsert. No server, no install.",
 '<span class="mono">type: sqlite</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A source of type <code>sqlite</code> reads a table or a SQL query from a local database file. A destination of type <code>sqlite</code> writes to a table with <code>append</code>, <code>replace</code> or <code>upsert</code>. SQLite needs no server.",
 "Create a small SQLite file, read a table and a query into CSV files, upsert the table into a second database, run it again after a change, and read the two errors.",
 "How do I read from and write to SQLite?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>Python, to create the test database (<code>py</code> on Windows, <code>python3</code> elsewhere). SQLite is part of Python.</li><li>A job folder, for example from <a href="/studio/anatomy-of-a-job">Anatomy of a job</a>. Paths below are relative to the job folder.</li>')
s += step(1, "Create a test database", "Five orders in a file.",
 ["Create the folder <code>data</code> at the root of the project.", "Save the script below as <code>make_db.py</code> and run it."],
 "py make_db.py",
 "<p>The script creates <code>data/app.db</code> with one table, <code>orders</code>.</p><pre class=\"cmd\">import sqlite3\nc = sqlite3.connect(\"data/app.db\")\nc.execute(\"CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer TEXT, amount REAL, status TEXT)\")\nc.executemany(\"INSERT INTO orders VALUES (?,?,?,?)\", [\n (1,\"Alice\",120.5,\"paid\"),(2,\"Bob\",35.0,\"pending\"),(3,\"Carla\",80.0,\"paid\"),\n (4,\"Dan\",15.25,\"paid\"),(5,\"Eve\",60.0,\"pending\")])\nc.commit(); c.close()</pre>",
 "The file <code>data/app.db</code> exists.",
 "app.db created: 5 rows")
s += step(2, "Read a table", "One source, one CSV destination.",
 ["In a job folder, write <code>sources.yaml</code>, <code>destinations.yaml</code> and <code>pipeline.yaml</code> as below.", "Run <code>hdrctl run</code> on the job."],
 "hdrctl run jobs\\read-table",
 "<p><code>connection.path</code> is relative to the job folder, so a job in <code>jobs/read-table</code> reaches the database with <code>../../data/app.db</code>.</p><pre class=\"cmd\"># sources.yaml\nsources:\n  src_app:\n    type: sqlite\n    connection:\n      path: ../../data/app.db\n    extract:\n      table: orders\n\n# destinations.yaml\ndestinations:\n  dest:\n    type: csv\n    load:\n      table: data/out_read-table.csv\n      mode: replace\n\n# pipeline.yaml\npipeline:\n  from: src_app\n  to: dest</pre>",
 "<code>Rows read : 5</code> and <code>Rows written: 5</code>.",
 "Pipeline completed successfully in 1.9s\n  Rows read   : 5\n  Rows written: 5")
s += step(3, "Read a query", "Filter in SQL.",
 ["In the source, replace <code>table: orders</code> with the <code>query</code> below.", "Run the job again."],
 "hdrctl run jobs\\read-query",
 "<p>Use <code>query</code> instead of <code>table</code> to choose the columns and the rows in SQL.</p><pre class=\"cmd\">    extract:\n      query: \"SELECT order_id, customer, amount FROM orders WHERE amount >= 50\"</pre>",
 "3 rows read, and a CSV with 3 columns.",
 "Rows read   : 3\nRows written: 3\n\norder_id,customer,amount\n1,Alice,120.5\n3,Carla,80.0\n5,Eve,60.0")
s += step(4, "Write to SQLite with upsert", "Create the warehouse.",
 ["Keep the table source of step 2.", "Replace the destination with the one below.", "Run the job."],
 "hdrctl run jobs\\load-sqlite",
 "<p>The database <code>data/warehouse.db</code> and the table <code>orders</code> do not exist yet: the first run creates them. With <code>mode: upsert</code> and <code>key</code>, the key becomes the primary key of the new table.</p><pre class=\"cmd\">destinations:\n  dest:\n    type: sqlite\n    connection:\n      path: ../../data/warehouse.db\n    load:\n      table: orders\n      mode: upsert\n      key: [order_id]</pre>",
 "5 rows read and written. The table definition ends with <code>PRIMARY KEY (\"order_id\")</code>.",
 "Rows read   : 5\nRows written: 5\n\nCREATE TABLE \"orders\" (\"order_id\" INTEGER, \"customer\" TEXT, \"amount\" REAL, \"status\" TEXT, PRIMARY KEY (\"order_id\"))")
s += step(5, "Change the source and run again", "Watch the upsert.",
 ["Mark order 2 as paid and add order 6 in <code>app.db</code>.", "Run the same job."],
 "hdrctl run jobs\\load-sqlite",
 "<p>The existing keys are updated and the new key is inserted. Our script ran <code>UPDATE orders SET status='paid' WHERE order_id=2</code> and added order 6. The warehouse then held six rows, and order 2 was paid. A third run, with no change, left six rows.</p>",
 "6 rows read, 6 rows in the warehouse, no duplicate.",
 "Rows read   : 6\nRows written: 6\n\n(2, 'Bob', 35.0, 'paid')\n(6, 'Fay', 200.0, 'paid')\n\nSELECT count(*) after a third run: (6,)")
s += step(6, "Read the two errors", "Break the source on purpose.",
 ["Set <code>path</code> to <code>../../data/nope.db</code> and run the job.", "Set the file back and set <code>table</code> to <code>nothing</code>, then run it."],
 "hdrctl run jobs\\missing-db",
 "<p><code>hdrctl validate</code> passes in both cases: it does not open the database. Only the run fails, and the message names the file or the table.</p>",
 "A <code>Pipeline FAILED</code> block with the cause.",
 "ValueError: SQLiteConnector [src_app]: database file not found: C:\\...\\data\\nope.db\n\nOperationalError: no such table: nothing")
s += rules([("TIP", "Use <code>query</code> to filter early: fewer rows leave the database and reach the next step."),
 ("TIP", "Give an upsert a <code>key</code> that is unique in the source, so that each key lands on one row."),
 ("TRAP", "<code>connection.path</code> is relative to the job folder, not to the project: <code>data/app.db</code> alone looks inside <code>jobs/&lt;job&gt;/data</code>."),
 ("TRAP", "<code>hdrctl validate</code> does not check that the file or the table exists. Run the job to find out.")])
s += tail([["Source", "type: sqlite, connection.path, extract.table or extract.query"], ["Destination", "type: sqlite, connection.path, load.table, load.mode, load.key"], ["Modes", "append, replace, upsert"], ["Install", "none: sqlite3 is part of Python"]],
 [["database file not found: ...", "The path is wrong or relative to the wrong folder", "Count from the job folder, for example ../../data/app.db"], ["no such table: nothing", "The table name does not exist in the file", "List the tables with a SQLite client and fix extract.table"], ["Two rows for one key", "mode append or replace, or no key on the upsert", "Use mode: upsert with key"]],
 faq, REL + '<li><a href="/studio/anatomy-of-a-job">Anatomy of a job</a></li><li><a href="/studio/read-csv-json-and-parquet-files">File sources</a></li><li><a href="/studio/clean-split-window-pivot-and-script">Transformations 2</a></li>',
 "A local database as a source and as a destination, with no server. Not covered here: PostgreSQL, MySQL, SQL Server and MongoDB.",
 '<a class="primary" href="/studio/read-csv-json-and-parquet-files">Back to File sources <span aria-hidden="true">→</span></a>') + CTA
publish(20, "read-and-write-sqlite-databases", "Database sources", s,
 "Read from and write to a SQLite database in a Hydra ETL job", "Read and write a SQLite database in a Hydra ETL job", "Hydra SQLite Source and Destination: Upsert | Hydra ETL",
 "Read a SQLite table or query, write to SQLite with append, replace or upsert, and read the errors. No server. Tested with Hydra ETL 0.22 on Windows.",
 ["Create a test database", "Read a table", "Read a query", "Write to SQLite with upsert", "Change the source and run again", "Read the two errors"], faq,
 "Database sources", "Read a table or a query from SQLite and write to SQLite with append, replace or upsert, with no server.")

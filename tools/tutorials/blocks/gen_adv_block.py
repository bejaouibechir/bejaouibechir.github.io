"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("How do I check a Snowflake, BigQuery or CDC source without a server?", "Run hdrctl validate on the job folder. In our test on Hydra ETL 0.22, validate accepted a Snowflake, a BigQuery, a PostgreSQL CDC and a MySQL CDC source with made-up values and no server. It checks the shape of the YAML only, not the connection."),
 ("What does a run say when the server or the account is missing?", "It stops with a message that names the connector and the source. A PostgreSQL CDC run on a closed port answered Connection refused after 3.6 seconds, a BigQuery run without the driver answered that the driver is not installed after 1.6 seconds, and a Snowflake run with a made-up account failed after 13 seconds."),
 ("Is the password shown in the error?", "Not in our test. The PostgreSQL CDC and MySQL CDC messages print the connection address with the password replaced by three stars, and the Snowflake message prints the user without the password."),
 ("What do the CDC sources need on the database side?", "According to the connector documentation in the source, PostgreSQL needs a role with the REPLICATION attribute, and MySQL needs the binary log on in ROW format with full row images. We did not test either, because it needs a database server."),
 ("Does Hydra ETL read MongoDB with this configuration?", "We did not cover it. In our test, validate accepted a MongoDB source with extract.table, but a run asked for a collection name, and with extract.collection alone the engine asked for a table or a query. Check the current documentation before you rely on it."),
]
s = common(21, "Advanced sources", "Advanced sources: Snowflake, BigQuery and CDC",
 "Write a Snowflake, BigQuery, PostgreSQL CDC or MySQL CDC source, validate it without any server, and read what a run says when nothing answers.",
 '<span class="mono">hdrctl validate</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "Snowflake, BigQuery and the two CDC sources need an account or a server. <code>hdrctl validate</code> checks their YAML without one, and a run tells you which part is missing.",
 "Write four sources, validate them offline, run them against nothing, and read the four messages.",
 "How do I configure a Snowflake or CDC source in Hydra ETL?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>No account and no server: this lesson uses made-up values on purpose.</li>')
s += step(1, "Write the Snowflake source", "One job folder, three files.",
 ["Create the folder <code>jobs/snowflake</code>.", "Save the three files below in it. The source is the one that changes; <code>pipeline.yaml</code> and <code>destinations.yaml</code> stay the same for every source in this lesson."],
 "hdrctl validate jobs\\snowflake",
 "<p><code>sources.yaml</code>:</p><pre class=\"cmd\">sources:\n  src:\n    type: snowflake\n    connection:\n      account: xy12345.example\n      user: demo_user\n      password: demo-password\n      warehouse: COMPUTE_WH\n      database: SALES\n      schema: PUBLIC\n      role: ANALYST\n      column_case: lower\n    extract:\n      table: ORDERS</pre><p><code>pipeline.yaml</code>:</p><pre class=\"cmd\">pipeline:\n  from: src\n  to: dest</pre><p><code>destinations.yaml</code>:</p><pre class=\"cmd\">destinations:\n  dest:\n    type: csv\n    load:\n      table: data/out.csv\n      mode: replace</pre>",
 "Every line <code>ok</code>, then <code>DSL valid</code>.",
 "  ok  sources.yaml                         — Pydantic valid\n  ok  destinations.yaml                    — Pydantic valid\n  ok  pipeline.from                        — resolved: src\n  ok  pipeline.to                          — resolved: dest\n\n  ✅ DSL valid — no errors detected.")
s += step(2, "Run it against nothing", "Validate is not a connection test.",
 ["Run the job.", "Read the message: it names the connector, the source and the address."],
 "hdrctl run jobs\\snowflake",
 "<p>The account is made up, but the run still reaches for the network and fails after about 13 seconds. Use an account that you own when you test for real. The long certificate text is cut here.</p>",
 "A failure that starts with <code>connection failed</code>.",
 "ValueError: SnowflakeConnector [src]: connection failed.\n  DSN : snowflake://demo_user@xy12345.example/SALES/PUBLIC\n  Error: DatabaseError: 250001 (08001): Failed to login: HTTP request failed after retries: login request. invalid peer certificate: …\n\n❌ Pipeline FAILED in 13.4s")
s += step(3, "Swap in BigQuery", "A driver can be missing.",
 ["Create <code>jobs/bigquery</code> with the same <code>pipeline.yaml</code> and <code>destinations.yaml</code>.", "Use the source below, validate it, then run it."],
 "hdrctl run jobs\\bigquery",
 "<p><code>sources.yaml</code>:</p><pre class=\"cmd\">sources:\n  src:\n    type: bigquery\n    connection:\n      project: my-project\n      dataset: sales\n      location: EU\n      credentials_file: ../../keys/sa.json\n    extract:\n      table: orders</pre><p>Validation passed here too. The run stops in 1.6 seconds because the BigQuery driver was not installed on our machine.</p>",
 "A failure that names the driver and the install command.",
 "ValueError: BigQueryConnector [src]: query failed.\n  Error: ValueError: BigQueryConnector [src]: the BigQuery driver is not installed. Install it with 'pip install \"hydra-etl[bigquery]\"'.\n\n❌ Pipeline FAILED in 1.6s")
s += step(4, "Swap in a CDC source", "Same job, a server that is not there.",
 ["Create <code>jobs/pgcdc</code> with the same two other files.", "Use the source below, validate it, then run it."],
 "hdrctl run jobs\\pgcdc",
 "<p><code>sources.yaml</code>:</p><pre class=\"cmd\">sources:\n  src:\n    type: postgresql_cdc\n    connection:\n      host: 127.0.0.1\n      port: 5499\n      user: demo_user\n      password: demo-password\n      database: shop\n      slot: hydra_orders\n      publication: hydra_orders\n    extract:\n      table: public.orders</pre><p>Nothing listens on port 5499, so the run fails. The address in the message shows the password as three stars. A <code>mysql_cdc</code> source with <code>state</code> and <code>server_id</code> instead of <code>slot</code> and <code>publication</code> failed the same way in 4 seconds; its message follows the language of Windows.</p>",
 "A failure that starts with <code>database connection failed</code>.",
 "ValueError: PostgreSQLCDCConnector [src]: database connection failed.\n  DSN : postgresql://demo_user:***@127.0.0.1:5499/shop?slot=hydra_orders&publication=hydra_orders\n  Error: OperationalError: connection to server at \"127.0.0.1\", port 5499 failed: Connection refused …\n\n❌ Pipeline FAILED in 3.6s")
s += rules([("TIP", "Validate first, on every machine: it is the only step that needs nothing outside the YAML."),
 ("TIP", "Read the first line of a failure: it names the connector and the source, so you know which of several sources failed."),
 ("TRAP", "<code>validate</code> passing does not mean the account, the driver or the server exists. All four sources passed it and none could run."),
 ("TRAP", "A made-up Snowflake account still makes the run call the network for about 13 seconds. Do not leave a real-looking host name in a test file."),
 ("TRAP", "Keep real passwords out of <code>sources.yaml</code>. See <a href=\"/studio/store-and-use-secrets-with-hdrctl\">Store and use secrets</a>.")])
s += tail([["Snowflake", "type: snowflake, connection: account, user, password, warehouse, database, schema"], ["BigQuery", "type: bigquery, connection: project, dataset, credentials_file"], ["PostgreSQL CDC", "type: postgresql_cdc, connection: slot, publication"], ["MySQL CDC", "type: mysql_cdc, connection: state, server_id"], ["Check", "hdrctl validate jobs\\NAME"]],
 [["connection failed", "The account, user or address is wrong", "Check the DSN line in the message"], ["driver is not installed", "The optional package is missing", "Run the pip command in the message"], ["database connection failed", "Nothing answers on that host and port", "Start the server or fix the port"]],
 faq, REL + '<li><a href="/studio/read-and-write-sqlite-databases">Read and write SQLite databases</a></li><li><a href="/studio/store-and-use-secrets-with-hdrctl">Store and use secrets</a></li><li><a href="/studio/switch-environments-with-hdrctl-env">Switch environments</a></li>',
 "Four sources, one validation, four honest failures. Not covered here: a real account, a real server, and MongoDB.",
 '<a class="primary" href="/studio/read-and-write-sqlite-databases">Back to Database sources <span aria-hidden="true">→</span></a>') + CTA
publish(21, "configure-snowflake-bigquery-and-cdc-sources", "Advanced sources", s,
 "Advanced sources: Snowflake, BigQuery and CDC", "Advanced sources: Snowflake, BigQuery and CDC", "Hydra Advanced Sources: Snowflake, BigQuery, CDC | Hydra ETL",
 "Write Snowflake, BigQuery and CDC sources, validate them with no server, and read what a run says when the account, driver or server is missing.",
 ["Write the Snowflake source", "Run it against nothing", "Swap in BigQuery", "Swap in a CDC source"], faq,
 "Advanced sources", "Write a Snowflake, BigQuery or CDC source, validate it offline and read the failures.")

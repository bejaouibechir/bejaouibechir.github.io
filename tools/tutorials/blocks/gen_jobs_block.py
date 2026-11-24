"""Rewrites lessons 06 (transformations) and 07 (destinations) on the studio-course project."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
BY = ('<p class="byline">By <a href="https://github.com/bejaouibechir" rel="author">Bechir Bejaoui</a> (<a href="https://www.linkedin.com/in/bejaoui-bechir-06b2452b/" rel="author noopener">LinkedIn</a>) · Published 4 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)</p></div>')
def fig(folder, name, alt, cap):
    from PIL import Image
    W, H = Image.open(R / "public" / "tutorials" / folder / f"{name}.png").size
    W, H = W // 2, H // 2
    return f'<figure class="shot"><img src="/tutorials/{folder}/{name}.png" width="{W}" height="{H}" loading="lazy" decoding="async" alt="{alt}" /><figcaption>{cap}</figcaption></figure>'
def head(num, of, label, h1, lead, meta, quick, goal, pre2):
    return f'''<div class="crumbs"><a href="/get-started">Get started</a><span>›</span><a href="/studio">Hydra Studio</a><span>›</span><span>Lesson {num}</span></div>
<div class="lesson-head"><div class="eyebrow"><span></span>Lesson {num} of 65 · {label}</div><h1>{h1}</h1><p class="lead">{lead}</p>
{BY}
<div class="lesson-meta">{meta}</div>
<section class="doc">
  <div class="callout"><b>Quick answer</b><p>{quick}</p></div>
  <h2>What will you learn in this lesson?</h2>
  <h3>Goal</h3><p>{goal}</p>
  <div class="callout"><b>Course project</b><p>Keep one cumulative Studio project named <code>studio-course</code>, one manual workflow named <code>first-workflow</code>, and one job named <code>first-job</code>. Each lesson builds on the state saved by the previous one.</p></div>
  <h3>Prerequisites</h3><ul><li>Hydra ETL 0.22 installed with the server extra, and <code>hdrctl serve</code> running: Studio is then at <code>http://127.0.0.1:5678</code>. See <a href="/studio/02-check-the-api">lesson 3, Check the API</a> if the top bar does not say <b>API online</b>.</li><li>{pre2}</li></ul>
'''
CTA = '''  <div class="cta"><b>Try Hydra ETL</b><p>Install it in a minute, or explore a job in your browser first.</p><a class="primary" href="/get-started">Get started</a><a href="/playground">Open the Playground</a><a href="/license">Commercial license</a></div>
</section>
'''
def step(n, title, obj, actions, cmd, body, see, out, figs=""):
    acts = "".join(f"<li>{a}</li>" for a in actions)
    return f'''  <div class="step">
    <h3><i>{n:02d}</i>{title}</h3>
    <h4>Objective</h4><p>{obj}</p>
    <h4>Actions</h4><ol>{acts}</ol>
    <pre class="cmd">{cmd}</pre>
    {body}
    <div class="expect"><b>What you should see</b><p>{see}</p><pre class="out">{out}</pre>
      {figs}
    </div>
  </div>

'''
def rules(items):
    return '<div class="rules">\n  <h5>Tips and tricks</h5>\n' + "".join(f'  <p data-kind="{k}">{t}</p>\n' for k, t in items) + '</div>\n\n'
def table(h, rows):
    return "<table><thead><tr>" + "".join(f"<th>{x}</th>" for x in h) + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows) + "</tbody></table>"
def tail(verif, probs, faq, related, nxt, nav):
    f = "".join(f"  <h3>{q}</h3>\n  <p>{a}</p>\n" for q, a in faq)
    return f'''  <h2>What should I have at the end?</h2>{table(["Verification","Expected result"], verif)}

  <h2>What if something goes wrong?</h2>{table(["Symptom","Cause","Fix"], probs)}

  <h2>Frequently asked questions</h2>
{f}
  <h2>Related lessons</h2>
  <ul class="linklist">{related}</ul>

  <h2>Next lesson</h2><p>{nxt}</p>
  <div class="lesson-nav">{nav}<a href="/studio">Back to the course map</a></div>
'''
F6, F7, F9 = "studio-06-add-a-transformation", "studio-07-add-a-destination", "studio-09-see-the-yaml"

# ---------------- Lesson 06
faq6 = [
 ("How many transformations does Hydra Studio have?", "Twenty in Hydra ETL 0.22, from Filter to Script. Script closes the list and holds your own Python for what the other nineteen do not cover."),
 ("Does the order of transformations matter?", "Yes. The engine runs them top to bottom. In our test on the course job, a Select that dropped the status column before a Filter on status made the run fail with: name 'status' is not defined."),
 ("Which transformations combine two streams?", "Join, Merge and Union. According to the Studio node catalog, Join combines two flows on a key or as a cross product, Merge upserts a source into a target, and Union appends a source."),
 ("Why does Studio refuse an edge between two nodes?", "Studio checks every connection and shows a Connection rejected warning with the reason: the edge already exists, it would create a cycle, a node cannot have an input or an output, or a node has reached its maximum number of inputs or outputs."),
]
s6 = head(23, 65, "Add a transformation", "Add a transformation in Hydra Studio: the 20 operations",
 "Twenty operations sit between where data comes from and where it goes. Read the catalog, open the two already on your canvas, and learn why their order is their meaning.",
 '<span class="mono">Transformations</span><span>about 20 minutes</span><span>a job with a source and a destination</span>',
 "In Hydra Studio, a transformation sits between a source and a destination in <b>Jobs configuration</b>. The palette offers twenty operations, from Filter to Script. They run in the order of the chain, top to bottom, so the order of the nodes is part of the job: dropping a column before filtering on it makes the run fail.",
 "Read the twenty operations, open the Select and Filter nodes of <code>first-job</code>, see the chain become an ordered list in the manifest, and learn what Studio refuses when you connect nodes.",
 "A <code>first-job</code> that reads <code>src_orders</code> and writes <code>dest_paid</code>, as built in <a href=\"/studio/05-add-a-source\">lesson 5, Create a job and add a source</a>. Lessons 6 and 7 add the middle and the end of it.")
s6 += "  <h2>How do I add and chain transformations in Hydra Studio?</h2>\n\n"
s6 += step(1, "Read the twenty operations", "See the whole catalog once, so you stop writing by hand what already exists.",
 ["Open <b>Jobs configuration</b> of <code>first-job</code>.", "In the palette, collapse <b>Sources</b> and expand <b>Transformations</b>.", "Read the list from <b>Filter</b> to <b>Script</b>."],
 "Jobs configuration → Transformations (20)",
 "<p>Nineteen named operations, then one escape hatch. Grouping them by intent is faster than memorizing twenty names: when you know the family you need, the name follows.</p>" + table(["Family","Operations","What it does to the table"], [
  ["<b>Choose</b>", "Filter · Select · Deduplicate", "Keeps fewer rows, or fewer columns."],
  ["<b>Change</b>", "Rename · Cast · Derive · Fill Null · Trim · Clean · Window", "Same rows, new values or new headers."],
  ["<b>Reshape</b>", "Sort · Aggregate · Pivot · Unpivot · Transpose · Text to Rows", "The shape moves: order, grouping, rows becoming columns."],
  ["<b>Combine</b>", "Join · Merge · Union", "Bring a second flow into the first."],
  ["<b>Escape</b>", "Script", "Your own Python."]]),
 "The palette lists the operations in this order, with the count in brackets.",
 "Transformations (20)\nFilter  Select  Rename  Cast  Aggregate  Sort  Deduplicate  Derive  Join\nFill Null  Trim  Clean  Pivot  Unpivot  Transpose  Merge  Union  Text to Rows  Window  Script",
 fig(F6, "palette-transformations-expanded-light", "The job palette of Hydra Studio with Sources collapsed and Transformations expanded, listing Filter, Select, Rename, Cast, Aggregate, Sort, Deduplicate, Derive, Join, Fill Null, Trim and Clean, above a canvas with four connected nodes.", "<b>Transformations (20)</b> expanded. Collapse <b>Sources</b> first, or the list sits below the fold."))
s6 += step(2, "Open the Select and Filter nodes", "Read what a configured transformation looks like, before you place your own.",
 ["On the canvas, double-click the <b>select</b> node.", "Read its fields, then close the dialog.", "Do the same on the <b>filter</b> node."],
 "double-click a node → dialog",
 "<p>The two nodes between <code>src_orders</code> and <code>dest_paid</code> were created for you. <b>Select</b> keeps five columns: <code>order_id</code>, <code>customer</code>, <code>country</code>, <code>amount</code> and <code>status</code>. <b>Filter</b> keeps the rows where <code>status == 'paid'</code>. Each dialog holds a <b>Step name</b>, the operation's own fields and a <b>Node ID</b>.</p>" ,
 "Two dialogs with the same frame and different fields. Closing them without saving changes nothing.",
 "SELECT   Step name: transform_select   Columns: order_id, customer, country, amount, status\nFILTER   Step name: transform_filter   Expression: status == 'paid'",
 fig(F6, "dialog-select-node-open-dark", "The Select dialog of Hydra Studio over the job canvas, showing the Step name transform_select, the Columns field and the Node ID.", "The <b>Select</b> dialog: the columns the job keeps.") + fig(F6, "dialog-filter-node-open-light", "The Filter dialog of Hydra Studio over the job canvas, showing the Step name transform_filter and the expression status == 'paid'.", "The <b>Filter</b> dialog: one expression, evaluated row by row."))
s6 += step(3, "Chain them: the order is the meaning", "See that the chain on the canvas is an ordered list in the manifest.",
 ["Look at the canvas from left to right.", "Open <b>Hydra DSL</b> and select the <b>Transformations</b> tab.", "Match each node to its entry."],
 "Hydra DSL → Transformations",
 "<p>The canvas reads <b>src_orders → select → filter → dest_paid</b>: four nodes, three edges. The engine runs the steps top to bottom, so the order is part of the job. Filtering on <code>status</code> after a Select that kept it works. Dropping <code>status</code> from the Select and keeping the same Filter does not: <code>hdrctl validate</code> still passes, but the run stops on the second step.</p><div class=\"callout\"><b>Trap</b><p>Validation does not read your column names. When we dropped <code>status</code> in the Select, the job validated, then the run failed with <code>Step 2/2: filter: invalid expression 'status == 'paid''. Error: name 'status' is not defined</code> (Hydra ETL 0.22.0, Windows). Check the order of the chain when a Filter or a Derive cannot find a column.</p></div>",
 "One entry per node, in the order the edges describe. On the 20-row sample the nominal job reads 20 rows and writes 14.",
 "steps:\n  - select:\n      columns: [order_id, customer, country, amount, status]\n  - filter:\n      expr: \"status == 'paid'\"\n\nRows read   : 20\nRows written: 14",
 fig(F6, "canvas-first-job-chain-dark", "The Hydra Studio canvas of first-job showing four connected nodes: src_orders, select, filter and dest_paid, with the counter reading 4 nodes and 3 edges.", "<b>4 nodes · 3 edges</b>: the chain is the order.") + fig(F9, "job-dsl-transformations-tab-light", "The Transformations tab of the Hydra DSL panel showing the ordered select and filter steps of first-job.", "The same chain in the <b>Transformations</b> tab of <b>Hydra DSL</b>."))
s6 += step(4, "Add one, and connect it", "Insert a transformation between two nodes, and know what Studio refuses.",
 ["Drag an operation from the palette onto the canvas, between two nodes.", "Drag from the first node's <b>right handle</b> to the new node's <b>left handle</b>, then from its right handle to the next node.", "Double-click the new node and answer its required fields."],
 "Transformations → drag → connect → configure",
 "<p>A transformation reads what enters its left handle and passes the result out of its right one. Studio checks every connection and, when it refuses one, shows a <b>Connection rejected</b> warning with the reason. These are the reasons in Studio 0.22.0:</p>" + table(["Message","Meaning"], [
  ["<code>This connection already exists</code>", "The two nodes are already linked."],
  ["<code>This connection would create a cycle</code>", "The edge would let a node feed itself, through other nodes."],
  ["<code>“CSV” cannot have an output</code>", "A destination ends the job; nothing leaves it."],
  ["<code>“CSV” cannot have an input</code>", "A source starts the job; nothing enters it."],
  ["<code>… has reached its maximum number of inputs (or outputs)</code>", "The node type accepts a limited number of edges."]]),
 "A refused edge does not appear; the warning names the reason. A new node keeps its badge until its required fields are filled.",
 "Connection rejected\n“CSV” cannot have an output",
 "")
s6 += step(5, "Bring a second flow in", "Know which nodes combine flows, and what each one does.",
 ["Pick <b>Join</b>, <b>Merge</b> or <b>Union</b> in the palette.", "Read the description Studio gives for each when you hover its entry.", "Connect the flows that must meet."],
 "Join · Merge · Union",
 "<p>Three operations bring a second flow into the first. The Studio node catalog describes them this way:</p>" + table(["Operation","What the catalog says"], [
  ["<b>Join</b>", "Joins two flows on a key, or every row against every row (cross)."],
  ["<b>Merge</b>", "Upserts a source into a target, like a SQL MERGE."],
  ["<b>Union</b>", "Appends a source, as UNION or UNION ALL."]]) + "<p>None of the three sets a maximum number of inputs in the catalog, unlike the nodes in the table above that do. We did not build a two-source job in this lesson: lesson 12 composes jobs in a workflow, which is the other way to bring flows together.</p>",
 "The three entries are in the palette under <b>Transformations</b>, in the positions shown in step 1.",
 "Join   Merge   Union", "")
s6 += rules([("TIP", "Think in families before names: choose, change, reshape, combine. When you know the family, the name follows."),
 ("TIP", "Collapse <b>Sources</b> in the palette before you look for a transformation: the list is long and opens below the fold."),
 ("TRAP", "Steps run in the order of the chain, and validation does not check column names. If a step cannot find a column, read the <b>Transformations</b> tab of <b>Hydra DSL</b> and check what an earlier step dropped."),
 ("TRAP", "A refused edge is a rule, not a bug: read the <b>Connection rejected</b> warning, it names the reason.")])
s6 += tail([
 ["Palette", "Twenty transformations, <b>Script</b> last"],
 ["Nodes", "<b>select</b> and <b>filter</b> open and show the fields of step 2"],
 ["Chain", "<b>4 nodes · 3 edges</b>, and the order matches the list in the <b>Transformations</b> tab"],
 ["Run", "20 rows read, 14 written with the sample data"]],
 [["An edge will not connect", "Studio refuses it for a stated reason", "Read the <b>Connection rejected</b> warning and apply what it says"],
  ["A transformation keeps its badge", "A required field is empty", "Double-click it and fill the field marked with a red asterisk"],
  ["A run fails on a column the job should have", "An earlier step dropped it", "Reorder the nodes, or keep the column in <b>Select</b>"],
  ["No Transformations in the palette", "You are in the workflow scene", "Switch to <b>Jobs configuration</b>"]],
 faq6,
 '<li><a href="/studio/05-add-a-source">Create a job and add a source</a></li><li><a href="/studio/07-add-a-destination">Add a destination</a></li><li><a href="/studio/08-see-the-yaml">Read the YAML Studio generates</a></li><li><a href="/dsl/transformations-yaml">Transformations YAML reference</a></li>',
 "The data enters and is reshaped. One node is still to read closely, the one that makes the job write: the destination.",
 '<a class="primary" href="/studio/07-add-a-destination">Add a destination <span aria-hidden="true">→</span></a>') + CTA

# ---------------- Lesson 07
faq7 = [
 ("Which destinations does Hydra Studio offer?", "CSV, JSON, Parquet, MySQL, PostgreSQL, SQL Server, SQLite, Snowflake, BigQuery and MongoDB: ten in Hydra ETL 0.22."),
 ("Can a Hydra job write to two destinations?", "No. The pipeline names a single destination in its to key. We declared a second destination without referencing it and it was ignored; we wrote to as a list and hdrctl validate rejected it. To write to two places, use two jobs in a workflow."),
 ("Why is there no Web API destination?", "Web API is a source only in Hydra ETL 0.22, like PostgreSQL CDC and MySQL CDC. To send data out over HTTP, use the Webhook action in the workflow scene."),
 ("How do I keep a password out of a destination?", "Write a reference such as ${ENV:MY_SECRET} in the field and keep the value under Environments, never in the manifest."),
]
s7 = head(25, 65, "Add a destination", "Add a destination in Hydra Studio: one job, one place to write",
 "A destination ends the job. Read the ten Hydra can write to, open the one in your canvas, and learn the rule that sets it apart: a pipeline names exactly one.",
 '<span class="mono">Destinations</span><span>about 10 minutes</span><span>a job with a source and transformations</span>',
 "A destination ends a Hydra job. Drag one from <b>Destinations</b>, connect the last transformation to it and fill its path or connection. Hydra ETL 0.22 offers ten destinations. The pipeline names exactly one of them in <code>to</code>: to write elsewhere too, create a second job and orchestrate both in the workflow.",
 "Read the ten destinations, open the CSV destination of <code>first-job</code>, and see how the pipeline manifest ties one source to one destination.",
 "The <code>first-job</code> of the previous lesson, with its select and filter nodes in place.")
s7 += "  <h2>How do I add a destination to a job in Hydra Studio?</h2>\n\n"
s7 += step(1, "Read the ten destinations", "See what Hydra can write to, and notice what is missing.",
 ["In the job palette, collapse <b>Sources</b>.", "Read <b>Destinations</b>.", "Compare with the thirteen sources."],
 "Jobs configuration → Destinations (10)",
 "<p>Ten connectors: three file formats and seven databases or warehouses. Three of the thirteen sources have no counterpart: <b>PostgreSQL CDC</b>, <b>MySQL CDC</b> and <b>Web API</b>. Hydra reads from an HTTP endpoint but never writes to one.</p>" + table(["Destination","What the catalog says"], [
  ["<b>CSV · JSON · Parquet</b>", "Writes a file."],
  ["<b>MySQL · PostgreSQL · SQL Server · MongoDB</b>", "Inserts into the database."],
  ["<b>SQLite</b>", "Writes a table, built in."],
  ["<b>Snowflake · BigQuery</b>", "Writes a table: append, replace or upsert."]]),
 "Ten entries on the way out, thirteen on the way in. The three missing ones are deliberate.",
 "Sources       CSV  JSON  Parquet  MySQL  PostgreSQL  SQL Server  SQLite  PostgreSQL CDC  MySQL CDC  Snowflake  BigQuery  MongoDB  Web API\nDestinations  CSV  JSON  Parquet  MySQL  PostgreSQL  SQL Server  SQLite  Snowflake  BigQuery  MongoDB",
 fig(F7, "palette-destinations-expanded-light", "The job palette of Hydra Studio with Sources collapsed and Destinations expanded, listing CSV, JSON, Parquet, MySQL, PostgreSQL, SQL Server, SQLite, Snowflake, BigQuery and MongoDB.", "<b>Destinations (10)</b>, with <b>Sources</b> collapsed."))
s7 += step(2, "Open the CSV destination", "Read a configured destination, and recognize its dialog.",
 ["On the canvas, double-click the <b>dest_paid</b> node at the right end of the chain.", "Read its fields.", "Close the dialog."],
 "double-click dest_paid → dialog",
 "<p>The dialog follows the shape of the source dialog: a <b>Step name</b>, the connector's own fields and a <b>Node ID</b>. A file destination asks for a path. A database destination asks for a connection and a target table; write <code>${ENV:MY_SECRET}</code> for a password and keep the value under <b>Environments</b>.</p>",
 "The same frame as a source, with a file path. Nothing here is a connection to a server.",
 "CSV  DESTINATION   Writes a CSV file\n  STEP NAME   dest_csv\n  FILE PATH   ../../outputs/paid_orders.csv\n  LOCATION    local",
 fig(F7, "dialog-csv-destination-open-dark", "The CSV destination dialog of Hydra Studio over the job canvas, showing the Step name, the File path, the Location set to local and the Node ID.", "The <b>CSV</b> destination: a path, nothing more."))
s7 += step(3, "One destination, and only one", "Learn the rule that separates destinations from every other node.",
 ["Open <b>Hydra DSL</b> and select the <b>Pipeline</b> tab.", "Read the <code>from</code> and <code>to</code> keys.", "Select the <b>Destinations</b> tab and read the declared destination."],
 "Hydra DSL → Pipeline",
 "<p>The pipeline ties a source to a destination by identifier. We tested three shapes on the course job with Hydra ETL 0.22.0:</p>" + table(["What we wrote","Result"], [
  ["One destination, <code>to: dest_paid</code>", "Valid; the run read 20 rows and wrote 14."],
  ["A second destination declared, but <code>to</code> still names one", "Valid; the second one is ignored."],
  ["<code>to: [dest_paid, dest_copy]</code>", "Refused: <code>Input should be a valid string</code>, then <code>pipeline.to is missing or empty</code>."]]) + "<p>If you need the same data in two places, write two jobs and orchestrate them in the workflow, which the next lessons build towards.</p>",
 "One <code>from</code>, one <code>to</code>, and identifiers rather than paths.",
 "pipeline:\n  from: src_orders\n  to: dest_paid\n\ndestinations:\n  dest_paid:\n    type: csv\n    load:\n      table: ../../outputs/paid_orders.csv\n      mode: replace",
 fig(F9, "job-dsl-pipeline-tab-dark", "The Pipeline tab of the Hydra DSL panel showing from src_orders and to dest_paid.", "The <b>Pipeline</b> tab: one <code>from</code>, one <code>to</code>.") + fig(F9, "job-dsl-destinations-tab-dark", "The Destinations tab of the Hydra DSL panel showing the dest_paid CSV destination with its load settings.", "The <b>Destinations</b> tab: what <code>to</code> points at."))
s7 += rules([("TIP", "The destination dialogs follow the source dialogs: if you configured a source, you can configure its matching destination."),
 ("TRAP", "For a database, never type a real password in the node: write a reference such as <code>${ENV:MY_SECRET}</code> and keep the value outside the manifest."),
 ("TRAP", "<b>Web API</b>, <b>PostgreSQL CDC</b> and <b>MySQL CDC</b> have no destination. To send data out over HTTP, use the <b>Webhook</b> action in the workflow scene."),
 ("TRAP", "Do not list two destinations in <code>to</code>: the engine expects a single identifier. Use two jobs.")])
s7 += tail([
 ["Palette", "Ten destinations, no Web API"],
 ["Dialog", "<b>dest_paid</b> opens with a file path and a Node ID"],
 ["Pipeline tab", "One <code>from</code>, one <code>to</code>"],
 ["Validation", "<code>hdrctl validate jobs/first-job</code> reports <code>DSL valid</code>"]],
 [["No HTTP destination in the list", "Web API is a source only", "Use the <b>Webhook</b> action in the workflow scene"],
  ["<code>Input should be a valid string</code> on <code>pipeline.to</code>", "<code>to</code> holds a list", "Name one destination, and create a second job for the second place"],
  ["Nothing connects after the destination", "It has no output", "Expected: the destination ends the job"],
  ["The badge stays after saving", "The output path or table is empty", "Reopen the node and fill the field marked with a red asterisk"]],
 faq7,
 '<li><a href="/studio/06-add-a-transformation">Add a transformation</a></li><li><a href="/studio/08-see-the-yaml">Read the YAML Studio generates</a></li><li><a href="/dsl/destinations-yaml">Destinations YAML reference</a></li><li><a href="/playground">Hydra Playground</a></li>',
 "The job is complete: it reads, reshapes and writes. The next lesson opens the manifests Studio has been writing all along, and checks that they say what you meant.",
 '<a class="primary" href="/studio/08-see-the-yaml">See the YAML <span aria-hidden="true">→</span></a>') + CTA


# ---------------- Lesson 05
F5 = "studio-05-add-a-source"
faq5 = [
 ("What is a Hydra job made of?", "A job is a folder holding four manifests: sources.yaml, transformations.yaml, destinations.yaml and pipeline.yaml. Studio writes them from the canvas when you save, and hdrctl runs the same files whether you wrote them by hand or designed them."),
 ("How do I create a job in Hydra Studio?", "Open Jobs configuration and press the plus button in the tab bar at the bottom left. Studio adds a job named job1 and opens an empty canvas; double-click its tab, or use Rename in its options menu, to give it your name."),
 ("What is the difference between Archive and Delete for a job?", "Archive renames the job folder to name.backup, with a timestamp suffix if that name is taken, so nothing is lost. Delete asks whether to also remove the folder from disk. Both are refused while the job is still placed on the workflow canvas."),
 ("Which sources can I add to a job?", "CSV, JSON, Parquet, MySQL, PostgreSQL, SQL Server, SQLite, PostgreSQL CDC, MySQL CDC, Snowflake, BigQuery, MongoDB and Web API: thirteen in Hydra ETL 0.22."),
 ("Which HTTP methods does the Web API source offer?", "GET, POST, PUT and DELETE, with GET selected by default."),
]
s5 = head(9, 65, "Add a source", "Create a job in Hydra Studio and add its source",
 "A job is four manifests in a folder. Studio writes them for you from the canvas, and the first node you place is the source.",
 '<span class="mono">Sources</span><span>about 20 minutes</span><span>an open workflow with no job yet</span>',
 "To create a job in Hydra Studio, open <b>Jobs configuration</b> and press <b>+</b> at the bottom left of the canvas. Studio adds a job named <code>job1</code> and an empty canvas; rename it, then drag a source such as CSV onto the canvas and fill its required fields until the red badge clears.",
 "Create a job named <code>first-job</code>, see it appear in the workflow palette, place a CSV source and configure it, then read how a database source and a Web API source differ.",
 "A <code>studio-course</code> project with <code>first-workflow</code> open and no job yet. If you start from a project that already holds jobs, the steps are the same: your new tab sits next to the existing ones.")
s5 = s5.replace("  <h3>Prerequisites</h3>", """  <h3>What a job is</h3>
  <p>A job is not a file: it is a folder holding <b>four manifests</b>, and it is complete only when all four exist.</p>""" + table(["Manifest","Answers"], [["<code>sources.yaml</code>","Where does the data come from?"],["<code>transformations.yaml</code>","What happens to it along the way?"],["<code>destinations.yaml</code>","Where does it go?"],["<code>pipeline.yaml</code>","Which source feeds which destination?"]]) + """
  <p>You can write the four by hand and <code>hdrctl</code> will run them; Studio offers the other route and writes the same files. Neither is more legitimate.</p>
  <h3>Prerequisites</h3>""",1)
s5 += "  <h2>How do I create a job and add a source in Hydra Studio?</h2>\n\n"
s5 += step(1, "Create a job", "Add a job to the project without leaving the canvas.",
 ["Open the <b>Jobs configuration</b> tab.", "Find the <b>+</b> button at the bottom left, in the tab bar.", "Press it. Studio creates a job named <code>job1</code>; there is no name prompt."],
 "Jobs configuration → +",
 "<p>The new job opens on an empty canvas and the counter reads 0 nodes · 0 edges. At this point the job lives in the Studio editor: it is written to disk when you save. A job with no node is a valid, if idle, job.</p>",
 "A new tab at the bottom, already selected, and an empty canvas beside the source palette.",
 "job1   0 nodes · 0 edges",
 fig(F5, "jobs-tab-empty-canvas-light", "Jobs configuration of a workflow with no job yet: an empty canvas, the source palette on the left and the tab bar with the plus button at the bottom.", "Before: no job yet.") + fig(F5, "new-job-tab-created-dark", "The bottom tab bar of Hydra Studio after pressing the plus button: a job1 tab is selected.", "After: a <b>job1</b> tab."))
s5 += step(2, "Rename it, and know Archive from Delete", "Give the job its real name, and learn how a job leaves the project.",
 ["Open the options menu of the tab, or double-click the tab.", "Choose <b>Rename</b>, type <code>first-job</code> and press <b>Enter</b>.", "Read the other two entries without choosing them."],
 "Tab → options → Rename · Archive · Delete",
 "<p><b>Archive</b> and <b>Delete</b> look alike and are not. This is what Studio 0.22.0 does, read from its code:</p>" + table(["Action","What happens","Reversible"], [
  ["<b>Rename</b>","The tab takes the new name.","—"],
  ["<b>Archive</b>","The job folder is renamed <code>&lt;name&gt;.backup</code>, with a timestamp suffix if that name already exists. Every manifest survives.","<b>Yes</b>: rename the folder back."],
  ["<b>Delete</b>","A confirmation asks whether to also delete the folder from disk (OK), or only remove the job from Studio (Cancel).","Only if the folder was kept."]]) + "<div class=\"callout\"><b>Trap</b><p>A job still placed on the workflow canvas cannot be archived or deleted. Studio shows <code>Unable to archive…: remove it from the Workflow configuration canvas first.</code> Remove the node, then archive.</p></div>",
 "The tab and the breadcrumb both read <b>first-job</b>.",
 "first-workflow / first-job   0 nodes · 0 edges",
 fig(F5, "job-tab-options-menu-light", "The options menu of a job tab in Hydra Studio, listing Rename, Archive and Delete.", "The options menu: <b>Rename</b>, <b>Archive</b>, <b>Delete</b>.") + fig(F5, "job-tab-rename-input-dark", "The job tab in rename mode with first-job typed in.", "Rename mode, before <b>Enter</b>.") + fig(F5, "first-job-tab-renamed-light", "The job tab after renaming, now reading first-job.", "Renamed."))
s5 += step(3, "Find the job in the workflow palette", "See that a job needs no registration to be reusable.",
 ["Switch to <b>Workflow configuration</b>.", "Read the <b>Jobs</b> category of the palette."],
 "Workflow configuration → Jobs",
 "<p>Every job you create joins the <b>Jobs</b> category by itself. Nothing registers it: the category lists what the project contains. That is what makes a job reusable, since you design it once and orchestrate it in as many workflows as you like.</p>",
 "<b>Jobs (1)</b> with <code>first-job</code> under it.",
 "Jobs (1)\n  first-job",
 fig(F5, "workflow-palette-jobs-listed-dark", "The workflow palette of Hydra Studio showing Jobs (1) with first-job listed under Actions, Control Flow and Containers.", "<b>Jobs (1)</b>: <code>first-job</code>."))
s5 += step(4, "Drop a source, and read its warning", "Place a node, and learn what Studio says about a node it cannot use yet.",
 ["Go back to <b>Jobs configuration</b> and keep <code>first-job</code> open.", "Drag <b>CSV</b> from <b>Sources</b> onto the canvas.", "Look at the top right corner of the node."],
 "Sources → CSV → drag onto the canvas",
 "<p>A freshly dropped node carries a small red exclamation mark. It is not an error but an unanswered question: the type is chosen and the file to read is still missing. A single click opens a side panel on the node; a double-click opens its dialog.</p>",
 "A node named after its type, a red badge, and the counter at 1 node · 0 edges.",
 "source_csv_1\nCSV   (!)",
 fig(F5, "source-node-red-badge-light", "A CSV node dropped on the job canvas of Hydra Studio, with a red badge in its corner and its side panel open on the right.", "The badge stays until the required field is filled."))
s5 += step(5, "Configure the CSV source", "Answer the only question a CSV asks.",
 ["Double-click the node.", "Type <code>data/orders.csv</code> in the file path field, or use <b>Browse</b>.", "Set <b>Step name</b> to <code>src_orders</code>, the name the next lessons use, then press <b>Save</b>."],
 "double-click → file path → Save",
 "<p>One required field, and a <b>Location</b> set to <code>local</code>. The path is relative to the job folder. Prefer <b>Browse</b> to typing: it writes a path that exists, which removes the most common cause of a first run failing. Saved, the node becomes this entry of <code>sources.yaml</code>:</p>",
 "The badge disappears and the node takes the step name you gave it. That name is the identifier <code>pipeline.yaml</code> will refer to.",
 "sources:\n  src_orders:\n    type: csv\n    extract:\n      table: data/orders.csv\n      batch_size: 50000",
 fig(F5, "dialog-csv-source-configured-dark", "The CSV source dialog of Hydra Studio with the path data/orders.csv, Location set to local and the Node ID.", "The CSV dialog, before renaming the step."))
s5 += step(6, "Read a database source", "Read a connection form, and learn where a password belongs.",
 ["Drag <b>PostgreSQL</b> onto a canvas, or use <b>MySQL</b> or <b>MongoDB</b>.", "Double-click the node.", "Read the <b>Data source</b> choice and the required fields."],
 "Sources → PostgreSQL → Table | SQL query",
 "<p>A database asks more than a file, and the first choice shapes the rest. <b>Table</b> reads a whole table. <b>SQL query</b> lets the server filter and join before a row reaches Hydra, usually faster on a large table.</p><div class=\"callout\"><b>Never type a password here</b><p>Write <code>${ENV:MY_SECRET}</code> and define the real value under <b>Environments</b>, in a <code>.env</code> file kept out of Git. A manifest is a file you commit, share and paste into a ticket.</p></div>",
 "Required fields marked with a red asterisk: the table, the host, the database and the user. The host and port show the usual values as hints.",
 "PostgreSQL  SOURCE\n  DATA SOURCE   Table | SQL query\n  TABLE *  HOST *  PORT 5432  DATABASE *  USER *  PASSWORD",
 fig(F5, "dialog-postgres-source-open-light", "The PostgreSQL source dialog of Hydra Studio with the Table and SQL query choice, and the table, host, port, database and user fields.", "A database source: a connection and a table or a query."))
s5 += step(7, "Read an HTTP source", "Read from a service instead of a file or a table.",
 ["Drag <b>Web API</b> onto a canvas.", "Double-click the node.", "Read the URL field and the <b>Method</b> list."],
 "Sources → Web API → URL · Method",
 "<p>The URL is the only required field. The method defaults to <b>GET</b>, and the list also offers <b>POST</b>, <b>PUT</b> and <b>DELETE</b>: some services expect a POST to return a result, a search endpoint taking its criteria in the body for instance.</p><div class=\"callout\"><b>Web API reads, it never writes</b><p>There is no HTTP destination in the palette. To send data out over HTTP, use the <b>Webhook</b> action in the workflow scene.</p></div>",
 "A short form, and a method list holding four entries.",
 "Web API  SOURCE\n  URL *\n  METHOD   GET  POST  PUT  DELETE",
 fig(F5, "dialog-web-api-source-open-dark", "The Web API source dialog of Hydra Studio with the URL field and the Method set to GET.", "The <b>Web API</b> source: a URL and a method."))
s5 += rules([("TIP", "Every job you create joins the <b>Jobs</b> category of the workflow palette by itself. You never register it anywhere."),
 ("TIP", "Hydra ETL 0.22 offers 13 sources. Start with <b>CSV</b>: it needs only a path."),
 ("TRAP", "A node wears a red badge until its required fields are filled. A drawn node is not a configured node."),
 ("TRAP", "The new job lives in the editor until you save. Save before you close the tab."),
 ("TIP", "Writing the four files by hand and designing them on the canvas produce the same folder.")])
s5 += tail([
 ["Job", "A <b>first-job</b> tab, and <b>Jobs (1)</b> in the workflow palette"],
 ["Source node", "A CSV node named <code>src_orders</code> with no red badge"],
 ["Manifest", "<code>sources.yaml</code> holds <code>src_orders</code> of type <code>csv</code>"],
 ["Menu", "Rename, Archive, then Delete below a separator"]],
 [["No <b>+</b> button", "You are in the workflow scene", "Switch to <b>Jobs configuration</b>; the button is at the bottom left"],
  ["The badge stays after saving", "A required field is still empty", "Reopen the node and look for the red asterisk"],
  ["Archive or Delete is refused", "The job is placed on the workflow canvas", "Remove the node from the canvas, then retry"],
  ["A password ended up in the manifest", "The value was typed into the field", "Replace it with <code>${ENV:NAME}</code> and rotate the secret"],
  ["No HTTP destination in the palette", "Web API is a source only", "Use the <b>Webhook</b> action in the workflow scene"]],
 faq5,
 '<li><a href="/studio/04-use-the-palette">Use the palette</a></li><li><a href="/studio/06-add-a-transformation">Add a transformation</a></li><li><a href="/studio/08-see-the-yaml">Read the YAML Studio generates</a></li><li><a href="/dsl">Hydra DSL reference</a></li>',
 "The job exists and knows where its data comes from. The next lesson places what comes after it: the transformations that reshape the data on its way through.",
 '<a class="primary" href="/studio/06-add-a-transformation">Add a transformation <span aria-hidden="true">→</span></a>') + CTA


# ---------------- Lesson 03
F3 = "studio-03-read-the-canvas"
faq3 = [
 ("What is the difference between Jobs configuration and Workflow configuration?", "Jobs configuration shows one job as a line from source to destination, with the palette of Sources, Transformations and Destinations. Workflow configuration shows the orchestration graph of jobs and actions, with the palette of Actions, Control Flow, Containers and Jobs."),
 ("Which way do edges point in Hydra Studio?", "An edge leaves the right handle of one node and enters the left handle of another, so a graph reads from left to right. In workflow.yaml an edge becomes a name inside depends_on."),
 ("What do the counters beside the name mean?", "They count the nodes and the edges of the open scene, and a Valid or error status follows. In our course project the workflow reads 2 nodes · 1 edge, first-job reads 4 nodes · 3 edges and second-job 3 nodes · 2 edges."),
 ("Where do I see the YAML behind the canvas?", "Select Hydra DSL in the top bar. It shows workflow.yaml in the workflow scene and the four manifests of the job in the job scene."),
]
s3 = head(5, 65, "Read the canvas", "Read the Hydra Studio canvas: nodes, ports and edges",
 "Take a guided tour of <code>first-workflow</code> without changing anything: two jobs, the line each one draws from source to destination, and the YAML behind them.",
 '<span class="mono">Jobs configuration</span><span>about 15 minutes</span><span>API online</span>',
 "The Hydra Studio canvas has two scenes: <b>Jobs configuration</b>, where one job runs from source to destination, and <b>Workflow configuration</b>, where jobs and actions form a graph. Edges leave a right handle and enter a left one, and the counters beside the name tell you how many nodes and edges the open scene holds.",
 "Open <code>first-workflow</code> and read everything it holds without editing it: the two scenes, the two jobs, the dialog of a node, and the YAML each scene produces.",
 "A <code>studio-course</code> project holding <code>first-workflow</code> with <code>first-job</code> and <code>second-job</code>, the state reached in lesson 12. Reading it now is a preview of what lessons 5 to 7 build.")
s3 = s3.replace("  <h3>Prerequisites</h3>", """  <h3>Why this matters</h3><p>One screen hosts two different graphs. Confusing them is the most common beginner mistake: connector nodes belong inside a job, while Job and Action nodes belong to orchestration. Reading before editing makes the next lessons quick.</p>
  <h3>What you are looking at</h3>""" + table(["Piece","Where it lives","What it does"], [
  ["<code>first-job</code>","Jobs configuration","Reads <code>orders.csv</code>, keeps five columns and the paid rows, writes <code>paid_orders.csv</code>"],
  ["<code>second-job</code>","Jobs configuration","Reads that output, keeps three columns, writes <code>paid_summary.csv</code>"],
  ["<code>first-workflow</code>","Workflow configuration","Runs <code>first-job</code>, then <code>second-job</code>"]]) + """
  <h3>Prerequisites</h3>""",1)
s3 += "  <h2>How do I read the Hydra Studio canvas?</h2>\n\n"
s3 += step(1, "Read the workflow graph", "Identify the two nodes, the edge between them, and what the toolbar offers.",
 ["Open <code>first-workflow</code> and select the <b>Workflow configuration</b> tab.", "Read the counters beside the workflow name.", "Read the palette categories on the left."],
 "Workflow configuration",
 "<p>Each node is a step of the workflow, here a <b>Job</b> node. The edge runs from the right handle of <code>first-job</code> to the left handle of <code>second-job</code>: the second job waits for the first. The toolbar is that of orchestration: <b>Import</b>, <b>Rollback</b>, <b>Hydra DSL</b> and <b>Run Workflow</b>.</p>",
 "Two nodes, one edge, <b>Valid</b>. The palette lists <b>Actions (9)</b>, <b>Control Flow (2)</b>, <b>Containers (3)</b> and <b>Jobs (2)</b>.",
 "first-workflow   2 nodes · 1 edge   Valid\nfirst-job → second-job",
 fig(F3, "workflow-canvas-two-jobs-dark", "The Workflow configuration scene of Hydra Studio: first-job connected to second-job, with the palette of Actions, Control Flow, Containers and Jobs on the left.", "The workflow scene: orchestration, not data."))
s3 += step(2, "Open the first job", "Switch scenes and read a job as a straight line from source to destination.",
 ["Select the <b>Jobs configuration</b> tab.", "Pick <b>first-job</b> in the tab bar at the bottom.", "Read the counters, then the node labels from left to right."],
 "Jobs configuration → first-job",
 "<p>The palette changes with the scene: <b>Sources</b>, <b>Transformations</b> and <b>Destinations</b> replace <b>Actions</b> and <b>Jobs</b>, because those have no meaning inside a job. The line reads <b>src_orders</b> (a CSV source), <b>select</b>, <b>filter</b> and <b>dest_paid</b> (a CSV destination).</p>",
 "Four nodes in a row and three edges. The tab bar lists the jobs of the project, one tab each.",
 "first-workflow / first-job   4 nodes · 3 edges   Valid\nsrc_orders → select → filter → dest_paid",
 fig(F3, "job-canvas-four-nodes-light", "The Jobs configuration scene of Hydra Studio showing first-job: src_orders, select, filter and dest_paid connected from left to right.", "<b>first-job</b>: four nodes, three edges.") + fig(F3, "job-tab-bar-two-jobs-dark", "The bottom tab bar of Hydra Studio with two tabs, first-job and second-job, and the plus button.", "One tab per job."))
s3 += step(3, "Open the second job", "Confirm the shape repeats, and see how the jobs connect.",
 ["Select <b>second-job</b> in the tab bar.", "Read the three nodes and the two edges."],
 "Jobs configuration → second-job",
 "<p>The same source, transformation, destination line. Its source <code>src_paid_orders</code> reads the file the first job wrote, <code>paid_orders.csv</code>. That shared file, and the edge in the workflow, are what tie the two jobs together.</p>",
 "Three nodes and two edges. Each job is independent: its own folder, manifests and canvas.",
 "first-workflow / second-job   3 nodes · 2 edges   Valid\nsrc_paid_orders → select → dest_summary",
 fig(F3, "job-canvas-second-job-light", "The Jobs configuration scene showing second-job: src_paid_orders, select and dest_summary connected from left to right.", "<b>second-job</b>: three nodes, two edges."))
s3 += step(4, "Read what a node is configured with", "Open nodes of each kind and see that each holds only what its role needs.",
 ["Double-click the <b>select</b> node of <code>first-job</code>, read it, then close the dialog.", "Do the same with <b>filter</b> and with the destination <b>dest_paid</b>.", "Close each dialog without saving."],
 "double-click a node → read → Cancel",
 "<p>Every dialog shows the same frame: a <b>step name</b> you choose, the fields its node type requires, and a <b>node ID</b>. The name is what appears in the YAML. The dialog changes nothing until you save.</p>",
 "No dialog asks for anything it does not need: the form is the contract.",
 "SELECT   step name · columns · node ID\nFILTER   step name · expression · node ID\nCSV DESTINATION   step name · file path · location · node ID",
 fig("studio-06-add-a-transformation", "dialog-select-node-open-dark", "The Select dialog of Hydra Studio with its step name, columns and node ID.", "<b>Select</b>: the columns kept.") + fig("studio-06-add-a-transformation", "dialog-filter-node-open-light", "The Filter dialog of Hydra Studio with its step name and expression.", "<b>Filter</b>: one expression.") + fig("studio-07-add-a-destination", "dialog-csv-destination-open-dark", "The CSV destination dialog of Hydra Studio with its step name, file path, location and node ID.", "<b>CSV destination</b>: a path."))
s3 += step(5, "Read the DSL a job produces", "Connect what you read on screen to the four files on disk.",
 ["With a job open, select <b>Hydra DSL</b> in the top bar.", "Walk through the tabs in order: <b>Sources</b>, <b>Transformations</b>, <b>Destinations</b>, <b>Pipeline</b>.", "Close the panel."],
 "Jobs configuration → Hydra DSL",
 "<p>A job is not one file but four, and the panel gives one tab to each. Read in this order, the job explains itself: where the data comes from, what happens to it, where it goes, and how the three are wired. In <code>first-job</code> the pipeline names identifiers, not paths: <code>from: src_orders</code>, <code>to: dest_paid</code>.</p>",
 "One tab per manifest, with the YAML of the open job.",
 "sources:          src_orders → type csv, extract table\ntransformations:  steps      → select, then filter\ndestinations:     dest_paid  → type csv, load table\npipeline:         from: src_orders   to: dest_paid",
 fig(F9, "job-dsl-sources-tab-light", "The Sources tab of the Hydra DSL panel.", "<b>Sources</b>.") + fig(F9, "job-dsl-transformations-tab-light", "The Transformations tab of the Hydra DSL panel.", "<b>Transformations</b>.") + fig(F9, "job-dsl-destinations-tab-dark", "The Destinations tab of the Hydra DSL panel.", "<b>Destinations</b>.") + fig(F9, "job-dsl-pipeline-tab-dark", "The Pipeline tab of the Hydra DSL panel.", "<b>Pipeline</b>."))
s3 += step(6, "Read the workflow the canvas describes", "See the whole orchestration as one file, and find each thing you read on screen inside it.",
 ["Switch to <b>Workflow configuration</b> and select <b>Hydra DSL</b>.", "Compare each <code>name</code> with a node on the canvas.", "Compare <code>depends_on</code> with the edge."],
 "hdrctl workflow validate first-workflow",
 "<p>Two steps, in the order the graph imposes: <code>first-job</code> starts alone and <code>second-job</code> waits for it.</p><pre class=\"out\">version: \"1.0\"\nworkflow:\n  name: first-workflow\n  trigger:\n    type: manual\n  steps:\n    - name: first-job\n      type: job\n      job: ../jobs/first-job\n      depends_on: []\n      on_failure: fail\n    - name: second-job\n      type: job\n      job: ../jobs/second-job\n      depends_on:\n        - first-job\n      on_failure: fail</pre>" + table(["On the canvas","In the file"], [["A node","an entry under <code>steps</code>"],["An edge","a name inside <code>depends_on</code>"],["A Job node","<code>type: job</code> and a <code>job</code> path"],["An Action node","<code>type: action</code>, its <code>action</code> and its <code>params</code>"]]) + "<div class=\"callout\"><b>Containers</b><p>The palette also offers three containers (Sequence, Error Scope and Retry Scope). They group nodes on screen and apply a policy to their children; lesson 13 covers them.</p></div>",
 "The step count matches the number of nodes. The command confirms the file.",
 "Workflow valid — no errors detected.",
 fig(F9, "workflow-dsl-panel-open-light", "The Hydra DSL panel open on the workflow scene, showing workflow.yaml.", "<b>Hydra DSL</b> in the workflow scene."))
s3 += rules([("TIP", "Sources and transformations live in <b>Jobs configuration</b>. Jobs and actions live in <b>Workflow configuration</b>. Only <b>Containers</b> appear in both palettes."),
 ("TIP", "An edge leaves a <b>right handle</b> and enters a <b>left handle</b>, so direction is never ambiguous."),
 ("TIP", "Read before you edit: double-click a node, read it and press Cancel. The dialog changes nothing until you save."),
 ("TRAP", "Counters count nodes, not steps: containers are nodes on the canvas but never steps of the workflow.")])
s3 += tail([
 ["Workflow counters", "<code>2 nodes · 1 edge</code> for two job steps"],
 ["Scene switch", "The palette changes with the tab"],
 ["Job counters", "<b>first-job</b> reads 4 nodes · 3 edges and <b>second-job</b> 3 nodes · 2 edges"],
 ["Workflow file", "<code>hdrctl workflow validate first-workflow</code> reports <code>Workflow valid</code>"]],
 [["The palette has no Sources", "You are on <b>Workflow configuration</b>", "Switch to <b>Jobs configuration</b>"],
  ["No Actions in the palette", "You are inside a job", "Actions belong to orchestration; switch scenes"],
  ["An edge refuses to connect", "You started from a left handle", "Drag from a right handle to a left one"],
  ["The top bar does not say API online", "<code>hdrctl serve</code> is not running", "See lesson 3, Check the API"]],
 faq3,
 '<li><a href="/studio/01-open-a-project">Create a project in Hydra Studio</a></li><li><a href="/studio/04-use-the-palette">Use the palette</a></li><li><a href="/studio/08-see-the-yaml">Read the YAML Studio generates</a></li><li><a href="/studio/12-compose-jobs">Compose jobs in a workflow</a></li>',
 "You can now read a workflow without touching it. The next lesson opens the node palette properly: what each category holds, what the counts mean, and how to find the node you need.",
 '<a class="primary" href="/studio/04-use-the-palette">Use the palette <span aria-hidden="true">→</span></a>') + CTA

for n, s, faq, steps, desc in [
 ("03-read-the-canvas", s3, faq3, ["Read the workflow graph","Open the first job","Open the second job","Read what a node is configured with","Read the DSL a job produces","Read the workflow the canvas describes"], "Read the Hydra Studio canvas on the course project: the workflow and job scenes, node dialogs, and the YAML each produces. Hydra ETL 0.22."),
 ("05-add-a-source", s5, faq5, ["Create a job","Rename it, and know Archive from Delete","Find the job in the workflow palette","Drop a source, and read its warning","Configure the CSV source","Read a database source","Read an HTTP source"], "Create a job in Hydra Studio, rename it, drop a CSV source and configure it, then read the database and Web API sources. Hydra ETL 0.22."),
 ("06-add-a-transformation", s6, faq6, ["Read the twenty operations","Open the Select and Filter nodes","Chain them: the order is the meaning","Add one, and connect it","Bring a second flow in"], "Add and chain the 20 Hydra Studio transformations on the studio-course job, and see why their order matters. Hydra ETL 0.22."),
 ("07-add-a-destination", s7, faq7, ["Read the ten destinations","Open the CSV destination","One destination, and only one"], "Add a destination to a Hydra Studio job: the ten connectors, the CSV dialog, and why a pipeline names exactly one. Hydra ETL 0.22.")]:
    (R/"src/_mock"/f"studio-lesson-{n}.main.html").write_text(s, encoding="utf-8")
    p = R/"src/pages/studio"/f"{n}.astro"; a = p.read_text(encoding="utf-8")
    a = re.sub(r"dateModified: '[^']+'", "dateModified: '2026-11-23'", a)
    a = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+desc+m.group(2), a, 1)
    a = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", a, 1, flags=re.S)
    a = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", a, 1, flags=re.S)
    a = re.sub(r'(description=")[^"]*(" article)', lambda m: m.group(1)+desc+m.group(2), a, 1)
    p.write_text(a, encoding="utf-8")
print("ok")

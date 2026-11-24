"""Lesson 'Tour the pages' (plan n. 4): new lesson, slug tour-the-pages."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
src = (R/"tools/tutorials/blocks/gen_jobs_block.py").read_text(encoding="utf-8")
exec(src.split("F6, F7, F9 =")[0])   # helpers: fig, head, step, rules, table, tail, CTA
SLUG = "install-and-start"
FT, FB = "studio-tour-the-pages", "studio-bottom-panel"
faq = [
 ("How do I install Hydra ETL and start Studio?", "Create a virtual environment, install the package with its server extra using pip install \"hydra-etl[server]\", then run hdrctl serve. Studio opens at http://127.0.0.1:5678. On Windows, use py -m venv to create the environment."),
 ("Which Python version does Hydra ETL need?", "Python 3.9 or newer, according to the package metadata. In our test of Hydra ETL 0.22.0 we used Python 3.13.7 on Windows."),
 ("Why install the server extra?", "The base package gives you the engine and the hdrctl command line. The server extra adds the API and the web interface that hdrctl serve starts, so Studio needs it."),
 ("How do I start Studio on another port?", "Add --port to the command, for example hdrctl serve --port 5679. Other options are --host, --open to open the browser, --no-studio for the API alone, --workspace for the projects folder and --lang for the interface language."),
 ("Where does Studio keep my projects?", "In the workspace folder, ~/hydra-workspace by default. Pass --workspace to choose another folder. A new workspace gets a sample project named hydra-demo."),
]
s = head(1, 65, "Install and start", "Install Hydra ETL and start Hydra Studio with hdrctl serve",
 "Two commands install Hydra ETL with its server extra and start Studio. Check the version, read the banner, then open the address it prints.",
 '<span class="mono">hdrctl serve</span><span>about 10 minutes</span><span>Python 3.9 or newer</span>',
 "Install Hydra ETL with <code>pip install \"hydra-etl[server]\"</code>, then run <code>hdrctl serve</code>. Studio starts at <code>http://127.0.0.1:5678</code>. The <b>server</b> extra adds the API and the web interface; without it the command line works but Studio does not start.",
 "Create a virtual environment, install Hydra ETL 0.22 with its server extra, start Studio and confirm it is up.",
 "Python 3.9 or newer and an internet connection for pip. The commands below are the Windows ones, run in PowerShell, and were run as written on Hydra ETL 0.22.0 with Python 3.13.7.")
import re as _re
s = _re.sub(r'  <div class="callout"><b>Course project</b>.*?</div>\n', '', s, count=1, flags=_re.S)
s = _re.sub(r'<h3>Prerequisites</h3><ul>.*?</ul>', '<h3>Prerequisites</h3><ul><li>Python 3.9 or newer, available as <code>py</code> on Windows.</li><li>A terminal: PowerShell on Windows.</li><li>An internet connection to download the package from PyPI.</li></ul>', s, count=1, flags=_re.S)
s += "  <h2>How do I install Hydra ETL and open Studio?</h2>\n\n"
s += step(1, "Check Python", "Know which Python the next commands will use.",
 ["Open PowerShell.", "Run the command below."],
 "py --version",
 "<p>Hydra ETL needs Python 3.9 or newer. On Windows, the <code>py</code> launcher picks the installed Python. On Linux and macOS the same commands use <code>python3</code> and a <code>bin/</code> folder in place of <code>Scripts\\</code>; this lesson was run on Windows only.</p>",
 "A version number of 3.9 or higher.",
 "Python 3.13.7")
s += step(2, "Create a virtual environment", "Keep Hydra ETL and its dependencies apart from the rest of your Python.",
 ["Choose a folder for the environment.", "Run the command below."],
 "py -m venv hydra-env",
 "<p>A virtual environment is a folder that holds its own Python packages. Removing the folder removes the installation, which makes a clean start easy.</p>",
 "No output. A <code>hydra-env</code> folder now exists.",
 "")
s += step(3, "Install Hydra ETL with the server extra", "Get the engine, the command line, the API and Studio in one install.",
 ["Run the command below and wait for pip to finish."],
 'hydra-env\\Scripts\\python.exe -m pip install "hydra-etl[server]"',
 "<p>The quotes protect the square brackets. pip downloads <code>hydra-etl</code> and its dependencies, among them pandas, FastAPI and uvicorn. Without <code>[server]</code> you get the engine and the <code>hdrctl</code> command only.</p>",
 "pip ends with a line that lists the installed packages, including hydra-etl.",
 "Installing collected packages: … hydra-etl, fastapi\nSuccessfully installed … hydra-etl-0.22.0 …")
s += step(4, "Check the installation", "Confirm which version answers.",
 ["Run the command below."],
 "hydra-env\\Scripts\\hdrctl.exe --version",
 "<p>The command prints the version of Hydra ETL, the name of the framework and the Python it runs on.</p>",
 "The version, then the Python version, on one line.",
 "hydra 0.22.0  |  Hydra ETL Framework  |  Python 3.13.7",
 fig(FB, "bottom-panel-terminal-tab-dark", "The terminal of Hydra Studio in the dark theme showing hdrctl --version and its result, Hydra ETL 0.22.0 on Python 3.13.7.", "The same command, run from the Studio terminal."))
s += step(5, "Start Studio", "Start the API and the web interface with one command.",
 ["Run the command below.", "Leave the window open: closing it stops Studio."],
 "hydra-env\\Scripts\\hdrctl.exe serve",
 "<p><code>hdrctl serve</code> starts the Hydra API and Studio on one port. The default port is <b>5678</b>, on <code>127.0.0.1</code>, and the projects live in <code>~/hydra-workspace</code>. Add <code>--port 5679</code> to use another port, <code>--workspace</code> to choose the projects folder, <code>--open</code> to open your browser and <code>--no-studio</code> to serve the API alone.</p>",
 "An ASCII banner, then the address to open and the API and docs addresses. Press Ctrl+C to stop.",
 "Hydra Studio is ready. Open this address in your browser:\n\n    http://127.0.0.1:5678\n\n  API       http://127.0.0.1:5678/api\n  Docs      http://127.0.0.1:5678/docs\n\n  Press CTRL+C to stop.")
s += step(6, "Open Studio and check the API", "Confirm that the page and the API both answer.",
 ["Open <code>http://127.0.0.1:5678</code> in your browser.", "In another PowerShell window, run the command below."],
 "curl.exe http://127.0.0.1:5678/api/health",
 "<p>Studio opens on the <b>Overview</b> page. The top bar shows <b>API online</b> when the backend answers. The health route returns a small JSON document with the version and the build of the bundled Studio. <a href=\"/studio/02-check-the-api\">Check the API</a> explains the indicator in detail.</p>",
 "The Overview page with a project list, and a JSON answer with <code>status</code> set to <code>ok</code>.",
 '{"message":"Hydra ETL API is running","status":"ok","version":"0.22.0","dsl_version":"1.0","studio":"bundled","studio_build":"index-CxM6JVFV.js"}',
 fig(FT, "overview-page-start-actions-light", "The Overview page of Hydra Studio in the light theme, with the project list showing the sample project hydra-demo, the Get started card and the API online indicator in the top bar.", "Studio on a new workspace: the sample project <code>hydra-demo</code> is listed."))
s += rules([("TIP", "Use <code>--workspace</code> to keep course projects apart from your other work, for example <code>hdrctl serve --workspace C:\\data\\studio</code>."),
 ("TIP", "Run <code>hdrctl serve --help</code> to list every option."),
 ("TRAP", "Closing the window that runs <code>hdrctl serve</code> stops Studio. The browser page stays open but its data stops loading."),
 ("TIP", "Port 5678 busy? Start Studio on another port with <code>--port</code> and open that address instead.")])
s += tail([["Python", "3.9 or newer"], ["Install", "pip finishes without an error and lists hydra-etl 0.22.0"], ["Version", "<code>hdrctl --version</code> prints 0.22.0"], ["Studio", "The Overview opens at http://127.0.0.1:5678 and the health route returns status ok"]],
 [["<code>hdrctl</code> is not recognized", "The environment is not on the path", "Call it with its full path, <code>hydra-env\\Scripts\\hdrctl.exe</code>"], ["The page does not load", "The server is not running or uses another port", "Read the address in the banner, and keep the window open"], ["Studio does not start after install", "The package was installed without the server extra", "Install <code>\"hydra-etl[server]\"</code>"], ["pip cannot find the package", "No internet access or an old pip", "Check the connection, then run <code>python -m pip install --upgrade pip</code>"]],
 faq,
 '<li><a href="/studio/02-check-the-api">Check the Studio API connection</a></li><li><a href="/studio/tour-the-pages">Tour the Studio pages</a></li><li><a href="/get-started">Get started with Hydra ETL</a></li><li><a href="/cli">The hdrctl command line</a></li>',
 "Studio is running. The next lessons create a project and read the interface.",
 '<a class="primary" href="/studio/01-open-a-project">Create a project <span aria-hidden="true">→</span></a>') + CTA
s = s.replace("Published 4 November 2026", "Published 23 November 2026")
(R/"src/_mock/studio-lesson-01-install-and-start.main.html").write_text(s, encoding="utf-8")
t = (R/"src/pages/studio/all-or-nothing-load.astro").read_text(encoding="utf-8")
HEAD = "Install Hydra ETL and start Hydra Studio with hdrctl serve"
DESC = "Install Hydra ETL with its server extra, run hdrctl serve and open Hydra Studio at http://127.0.0.1:5678. Commands tested on Windows, Hydra ETL 0.22."
steps = ["Check Python", "Create a virtual environment", "Install Hydra ETL with the server extra", "Check the installation", "Start Studio", "Open Studio and check the API"]
t = t.replace("studio-lesson-42-all-or-nothing-load.main.html", "studio-lesson-01-install-and-start.main.html")
t = t.replace("all-or-nothing-load", SLUG)
t = re.sub(r'headline: "[^"]*"', lambda m: 'headline: '+json.dumps(HEAD), t, 1)
t = re.sub(r'(description: ")[^"]*(", datePublished)', lambda m: m.group(1)+DESC+m.group(2), t, 1)
t = re.sub(r"steps: \[.*?\],\n", lambda m: "steps: "+json.dumps(steps, ensure_ascii=False)+",\n", t, 1, flags=re.S)
t = re.sub(r"  faq: \[.*?\n  \],\n", lambda m: "  faq: [\n"+"".join(f"    [{json.dumps(q, ensure_ascii=False)}, {json.dumps(x, ensure_ascii=False)}],\n" for q, x in faq)+"  ],\n", t, 1, flags=re.S)
t = t.replace('["All-or-nothing load", ', '["Install and start", ')
t = re.sub(r'<BaseLayout title="[^"]*" exactTitle="[^"]*" description="[^"]*"', '<BaseLayout title="Install Hydra ETL and start Hydra Studio" exactTitle="Install Hydra ETL and Start Studio | Hydra ETL" description="'+DESC+'"', t, 1)
(R/("src/pages/studio/"+SLUG+".astro")).write_text(t, encoding="utf-8")
p = R/"src/data/studio-lessons.js"; h = p.read_text(encoding="utf-8")
h = h.replace('{"label": "Install and start", "group"', '{"slug": "'+SLUG+'", "label": "Install and start", "group"', 1)
p.write_text(h, encoding="utf-8")
print("ok", len(s))

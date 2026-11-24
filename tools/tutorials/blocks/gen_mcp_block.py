"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

import html as _h

CLIENT = '''import asyncio, sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

WORKSPACE, PYTHON = sys.argv[1], sys.argv[2]

async def main():
    params = StdioServerParameters(
        command=PYTHON, args=["-m", "hydra_etl.mcp", "--workspace", WORKSPACE])
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            print(len(tools.tools), "tools")
            for t in tools.tools:
                a = t.annotations
                print(t.name, "| readOnly =", a.read_only_hint, "| destructive =", a.destructive_hint)
            for path in ("jobs/job1", "../outside", "C:/Windows"):
                result = await session.call_tool("hydra_read_job", {"job_path": path})
                print("#", path)
                print(result.content[0].text[:120])

asyncio.run(main())
'''

faq = [
 ("What is the Hydra ETL MCP server?", "A local program, started with python -m hydra_etl.mcp, that lets an AI assistant call 21 Hydra ETL tools: list the vocabulary, read, validate, write and run jobs and workflows. In our test on Hydra ETL 0.22 with the MCP SDK 2.3.0, a client listed all 21 tools over stdio."),
 ("Does hdrctl mcp setup change my global Claude Code settings?", "No. According to the source and to our test, it writes a file named .mcp.json at the root of the project and nothing else. Existing servers of that file are kept, and a file that is not valid JSON is never overwritten."),
 ("Can the assistant read files outside my project?", "In our test, a path with .. and an absolute path were both refused with a message naming the allowed root. The server works inside the folder given by --workspace."),
 ("Can the assistant run a job without asking me?", "The tools that run or delete are flagged destructive, so a client can ask you first. The server description also tells the assistant to run a job only when you ask. Whether your client asks is a setting of the client, which we did not test."),
 ("Can I use it with a client other than Claude Code?", "The server speaks standard MCP over stdio, and hdrctl mcp setup supports only claude-code. According to the source, there is also an HTTP mode with no authentication, meant for your own machine. We did not test other clients or the HTTP mode."),
]
s = common(62, "MCP server", "Connect Claude Code to Hydra ETL with the MCP server",
 "Install the mcp extra, run hdrctl mcp setup to write .mcp.json, then check the 21 tools of the Hydra ETL MCP server and its guardrails from a small client.",
 '<span class="mono">hdrctl mcp setup</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl mcp setup</code> writes a <code>.mcp.json</code> file at the root of your project. It tells Claude Code to start the Hydra ETL MCP server, which gives the assistant 21 tools limited to that project folder.",
 "Install the extra, write <code>.mcp.json</code>, run setup again, then talk to the server from a short Python client to see its tools and its refusals.",
 "How do I connect Claude Code to Hydra ETL with MCP?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>Python 3.10 or later: the MCP SDK needs it.</li><li>A project: <code>hdrctl init mcp-demo --template csv</code>. Work in its folder.</li>')
s += step(1, "Install the MCP extra", "The server needs the MCP SDK.",
 ["Run the command below in the environment where <code>hdrctl</code> lives.", "Check the SDK with <code>py -m pip show mcp</code>."],
 'py -m pip install "hydra-etl[mcp]"',
 "<p>The extra installs the <code>mcp</code> package, for Python 3.10 or later. In our test, a clean environment got Hydra ETL 0.22.0 and mcp 2.3.0. Without the extra, <code>hdrctl mcp setup</code> stops and asks for it.</p>",
 "<code>pip show mcp</code> prints a name and a version.",
 "Name: mcp\nVersion: 2.3.0\nSummary: Model Context Protocol SDK")
s += step(2, "Run the setup", "One command, in the project.",
 ["Go to the project folder.", "Run the command below."],
 "hdrctl mcp setup",
 "<p>The command finds the root of the project from where you are, writes <code>.mcp.json</code> there, and prints the Python it will use and the folder the server may read and write. The project made by <code>hdrctl init</code> does not list <code>.mcp.json</code> in its <code>.gitignore</code>, so the command reminds you to add it if the project is shared.</p>",
 "A green line saying the file was created, then the notes.",
 '  ✅ Claude Code: ...\\mcp-demo\\.mcp.json created (server "hydra-etl").\n  Python: ...\\venv\\Scripts\\python.exe\n  Workspace: ...\\mcp-demo  (the server reads and writes only there)\n  .mcp.json holds paths of this computer: add it to .gitignore if the project is shared; each person runs `hdrctl mcp setup` once.\n\n  Next: open a terminal in the project, run `claude`, approve the hydra-etl server,\n  then type /mcp to see its tools, and ask for a pipeline in a sentence.')
s += step(3, "Read .mcp.json", "It starts the server with the Python that ran hdrctl.",
 ["Open the file."],
 "type .mcp.json",
 "<p>The command is the full path of the Python that runs <code>hdrctl</code>, so the server uses the Hydra ETL you installed, whatever is on the PATH. <code>--workspace</code> is the folder the server may touch. Because the file holds paths of your computer, each person of a team runs the setup once.</p>",
 "One server named <code>hydra-etl</code>.",
 '{\n  "mcpServers": {\n    "hydra-etl": {\n      "type": "stdio",\n      "command": "...\\\\venv\\\\Scripts\\\\python.exe",\n      "args": [\n        "-m",\n        "hydra_etl.mcp",\n        "--workspace",\n        "...\\\\mcp-demo"\n      ]\n    }\n  }\n}')
s += step(4, "Run it again", "Setup is safe to repeat.",
 ["Run <code>hdrctl mcp setup</code> a second time, then once from the <code>jobs</code> folder.", "Try <code>hdrctl mcp setup --path nope</code>."],
 "hdrctl mcp setup --path nope",
 "<p>Run again, even from a subfolder, the command finds the same project root and reports the file as <code>unchanged</code>. If the file already holds other servers, they are kept. According to the source, a <code>.mcp.json</code> that is not valid JSON is never overwritten: the command refuses and changes nothing. We tested the repeat and the wrong folder, not the invalid file.</p>",
 "<code>unchanged</code> on the repeats, and an error for the wrong folder.",
 '  ✅ Claude Code: ...\\mcp-demo\\.mcp.json unchanged (server "hydra-etl").\n\n  ❌ Folder not found: nope')
s += step(5, "Talk to the server", "A short client, as Claude Code would.",
 ["Save the script below as <code>check_mcp.py</code>.", "Run it with the Python of <code>.mcp.json</code>, giving the project folder and that Python."],
 'py check_mcp.py "%CD%" "<python from .mcp.json>"',
 "<p>The script starts the server over stdio, as Claude Code does, and lists its tools with the two flags a client reads before it asks you to confirm an action. It then reads a job and two paths that must be refused.</p><pre class=\"cmd\">" + _h.escape(CLIENT) + "</pre>",
 "21 tools, with the read-only ones flagged as such.",
 "21 tools\nhydra_list_operations | readOnly = True | destructive = False\nhydra_list_connectors | readOnly = True | destructive = False\nhydra_list_jobs | readOnly = True | destructive = False\nhydra_read_job | readOnly = True | destructive = False\nhydra_validate_job | readOnly = True | destructive = False\nhydra_write_job | readOnly = False | destructive = False\nhydra_delete_job | readOnly = False | destructive = True\nhydra_run_job | readOnly = False | destructive = True\nhydra_write_workflow | readOnly = False | destructive = False\nhydra_run_workflow | readOnly = False | destructive = True\n... (11 more, all read-only)")
s += step(6, "Read the refusals", "The server stays inside the project.",
 ["Look at the last lines of the output of the script."],
 "py check_mcp.py ...",
 "<p>The first path is a real job and is read. The two others are refused before any file is touched. In our test the server also refused a job written with invalid YAML (<code>REFUSED — sources.yaml is not valid YAML</code>), and refused to delete a job that a workflow still runs (<code>REFUSED — nothing was moved</code>). Deleting a job moves it to <code>.hydra/trash</code>, according to the source.</p>",
 "<code>REFUSED</code> for both bad paths.",
 "# jobs/job1\n### sources.yaml\nsources:\n  src_csv:\n    type: csv\n...\n# ../outside\nREFUSED — Path outside the workspace: '../outside'. Allowed root: ...\\mcp-demo\n# C:/Windows\nREFUSED — Absolute path refused: 'C:/Windows'. Give a path relative to ...\\mcp-demo")
s += rules([("TIP", "Open Claude Code in the project folder, approve the <code>hydra-etl</code> server when asked, then type <code>/mcp</code>. We did not run Claude Code in this test: the steps above check the server it will start."),
 ("TIP", "Ask the assistant to read and validate before it writes. The tool <code>hydra_write_job</code> validates first and writes nothing if the job is invalid, according to the source."),
 ("TRAP", "<code>hydra_run_job</code> writes real data to the destination. In our test, running <code>job1</code> through the server read 3 rows and wrote 2 to <code>data/output.csv</code>. Run only what you asked for."),
 ("TRAP", "Without the extra, setup stops. Install <code>hydra-etl[mcp]</code> in the same environment as <code>hdrctl</code>, because <code>.mcp.json</code> points to that Python."),
 ("TRAP", "Move the project or recreate the virtual environment and the paths in <code>.mcp.json</code> are wrong. Run <code>hdrctl mcp setup</code> again: it updates the entry.")])
s += tail([["Command", "hdrctl mcp setup [claude-code] [--path FOLDER]"], ["Writes", ".mcp.json at the project root (other servers kept)"], ["Server", "python -m hydra_etl.mcp --workspace FOLDER (stdio)"], ["Tools", "21, with read-only and destructive flags"], ["Scope", "files inside the workspace folder only"]],
 [["The MCP server needs its extra: pip install \"hydra-etl[mcp]\"", "The mcp package is missing, or Python is older than 3.10", "Install hydra-etl[mcp] with Python 3.10 or later"], ["Folder not found: nope", "--path is not a folder", "Give an existing folder of the project"], ["REFUSED — Path outside the workspace", "The assistant asked for a path with ..", "Give a path relative to the project"]],
 faq, REL + '<li><a href="/studio/manage-jobs-and-parameters-from-the-cli">Manage jobs and parameters from the CLI</a></li><li><a href="/studio/anatomy-of-a-job">Anatomy of a job</a></li><li><a href="/studio/run-hydra-in-production-with-hdrctl-serve">Run Hydra ETL in production</a></li>',
 "Setup, the file it writes, and the server seen from a client. Not covered here: Claude Code itself, other clients, and the HTTP mode.",
 '<a class="primary" href="/studio">Back to all lessons <span aria-hidden="true">→</span></a>') + CTA
publish(62, "connect-claude-code-to-hydra-etl-with-mcp", "MCP server", s,
 "Connect Claude Code to Hydra ETL with the MCP server", "Connect Claude Code to Hydra ETL with the MCP server", "Hydra ETL MCP Server: Connect Claude Code | Hydra ETL",
 "Run hdrctl mcp setup to write .mcp.json, then check the 21 tools of the Hydra ETL MCP server and its path guardrails. Tested with Hydra ETL 0.22.",
 ["Install the MCP extra", "Run the setup", "Read .mcp.json", "Run it again", "Talk to the server", "Read the refusals"], faq,
 "MCP server", "Write .mcp.json with hdrctl mcp setup and check the 21 tools and the path guardrails.")

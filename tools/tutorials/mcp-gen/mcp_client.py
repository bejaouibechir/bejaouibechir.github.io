import asyncio, sys, json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

WS = sys.argv[1]
PY = sys.argv[2]

def show(title, res):
    print("#####", title)
    for c in res.content:
        t = getattr(c, "text", None)
        print(t if t is not None else c)

async def main():
    params = StdioServerParameters(command=PY, args=["-m", "hydra_etl.mcp", "--workspace", WS])
    async with stdio_client(params) as (r, w):
        async with ClientSession(r, w) as s:
            init = await s.initialize()
            print("##### initialize")
            si=getattr(init,"server_info",None) or init.serverInfo
            print(si.name, getattr(si, "version", None))
            tools = await s.list_tools()
            print("##### tools", len(tools.tools))
            for t in tools.tools:
                a = t.annotations
                print(t.name, "| readOnly=%s destructive=%s" % (getattr(a, "read_only_hint", getattr(a, "readOnlyHint", None)), getattr(a, "destructive_hint", getattr(a, "destructiveHint", None))))
            show("hydra_list_jobs", await s.call_tool("hydra_list_jobs", {}))
            show("hydra_validate_job", await s.call_tool("hydra_validate_job", {"job_path": "jobs/job1"}))
            show("hydra_read_job", await s.call_tool("hydra_read_job", {"job_path": "jobs/job1"}))
            show("escape", await s.call_tool("hydra_read_job", {"job_path": "../outside"}))
            show("absolute", await s.call_tool("hydra_read_job", {"job_path": "C:/Windows"}))
            show("bad yaml", await s.call_tool("hydra_write_job", {"job_path": "jobs/bad", "sources_yaml": "a: [", "destinations_yaml": "b: 1", "pipeline_yaml": "c: 1"}))
            show("run", await s.call_tool("hydra_run_job", {"job_path": "jobs/job1"}))
            show("delete", await s.call_tool("hydra_delete_job", {"job_path": "jobs/job1"}))
asyncio.run(main())

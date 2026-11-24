import json, pathlib, urllib.request
from playwright.sync_api import sync_playwright
HERE = pathlib.Path(__file__).parent.resolve()
BASE = "http://127.0.0.1:5691"
proj = HERE.parent / "imp-probe" / "imp-demo"
def api(path, data=None):
    req = urllib.request.Request(BASE + path, data=json.dumps(data).encode() if data else None, headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())
pr = api("/api/projects/open", {"path": str(proj), "adopt": True})
wfs = api("/api/workflows?project_id=" + pr["id"])
out = {"project": pr["id"], "workflows": [(w.get("id"), w.get("name")) for w in wfs]}
wid = wfs[0]["id"]
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    page = b.new_page(viewport={"width": 1440, "height": 900})
    dialogs = []
    page.on("dialog", lambda d: (dialogs.append(d.message), d.accept()))
    url = f"{BASE}/workflows/{wid}?projectId={pr['id']}"
    page.goto(url); page.wait_for_selector("header"); page.wait_for_timeout(2000)
    page.get_by_text("Workflow configuration").first.click(); page.wait_for_timeout(1500)
    out["nodes_before"] = page.locator(".react-flow__node").count()
    page.locator("input[type=file][webkitdirectory] >> nth=1").set_input_files(str(HERE / "refunds-job")); page.wait_for_timeout(1500)
    out["nodes_after_import"] = page.locator(".react-flow__node").count()
    page.get_by_role("button", name="Save").first.click(); page.wait_for_timeout(3000)
    out["dialogs"] = list(dialogs)
    out["toast_or_text"] = page.locator("[role=status], .toast, [class*=toast]").all_inner_texts()
    page.screenshot(path=str(HERE / "imp-saved.png"))
    page.reload(); page.wait_for_selector("header"); page.wait_for_timeout(2000)
    page.get_by_text("Workflow configuration").first.click(); page.wait_for_timeout(1500)
    out["nodes_after_reload"] = page.locator(".react-flow__node").count()
    out["node_texts_reload"] = [t[:50] for t in page.locator(".react-flow__node").all_inner_texts()]
    b.close()
out["jobs_on_disk"] = sorted(x.name for x in (proj / "jobs").iterdir())
out["workflow_yaml"] = (next((proj / "workflows").glob("*.yaml"))).read_text(encoding="utf-8")
(HERE / "imp-save.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")

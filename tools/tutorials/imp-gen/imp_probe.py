import sys, json, pathlib
from playwright.sync_api import sync_playwright
HERE = pathlib.Path(__file__).parent.resolve()
out = {}
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    page = b.new_page(viewport={"width":1440,"height":900})
    dialogs = []
    page.on("dialog", lambda d: (dialogs.append(d.message), d.accept()))
    page.goto("http://127.0.0.1:5678/workflows/a991cb22?projectId=e84ae443")
    page.wait_for_selector("header"); page.wait_for_timeout(2000)
    page.get_by_text("Workflow configuration").first.click(); page.wait_for_timeout(1500)
    out["nodes_before"] = page.locator(".react-flow__node").count()
    page.get_by_text("Import", exact=True).first.click(); page.wait_for_timeout(500)
    out["menu_text"] = page.locator("text=Import a job").count()
    inp = page.locator("input[type=file][webkitdirectory] >> nth=1")
    out["dir_inputs"] = page.locator("input[type=file][webkitdirectory]").count()
    inp.set_input_files(str(HERE/"broken-job")); page.wait_for_timeout(1000)
    out["alert_broken"] = list(dialogs); dialogs.clear()
    inp.set_input_files(str(HERE/"refunds-job")); page.wait_for_timeout(2000)
    out["alert_ok"] = list(dialogs)
    out["nodes_after"] = page.locator(".react-flow__node").count()
    out["node_texts"] = [t[:60] for t in page.locator(".react-flow__node").all_inner_texts()]
    out["tabs_text"] = page.locator("header, [role=tablist]").all_inner_texts()[:3]
    page.screenshot(path=str(HERE/"imp-after.png"))
    b.close()
(HERE/"imp-probe.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")

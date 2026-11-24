"""Open the course workflow once and save, so Studio acknowledges files rewritten on disk (no 'Reloaded from disk' banner in captures)."""
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b=pw.chromium.launch(channel="msedge"); pg=b.new_page(viewport={"width":1440,"height":900})
    pg.goto("http://127.0.0.1:5678/workflows/a991cb22?projectId=e84ae443"); pg.wait_for_timeout(2500)
    for tab in ("Jobs configuration","Workflow configuration"):
        try: pg.get_by_text(tab,exact=True).first.click(); pg.wait_for_timeout(800); pg.get_by_text("Save",exact=True).first.click(); pg.wait_for_timeout(1500)
        except Exception as e: print("warm-up",tab,str(e)[:100])
    b.close(); print("warm-up done")

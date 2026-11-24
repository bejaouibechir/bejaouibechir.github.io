from playwright.sync_api import sync_playwright
import pathlib
out = pathlib.Path(__file__).parent / "guides-shots"; out.mkdir(exist_ok=True)
pages = {"guide": "/cli/guides/run-hydra-in-production-with-hdrctl-serve/", "index": "/cli/guides/", "serve": "/cli/serve/"}
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    pg = b.new_page(viewport={"width": 1440, "height": 1000})
    for k, u in pages.items():
        pg.goto("http://127.0.0.1:4398" + u); pg.wait_for_timeout(800)
        pg.screenshot(path=str(out / (k + ".png")), full_page=False)
        print(k, pg.title())
    b.close()

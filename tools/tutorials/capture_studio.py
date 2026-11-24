#!/usr/bin/env python3
"""Take the screenshots of a lesson from a running Hydra Studio, driven by the lesson's captures.json.

Run it ON YOUR MACHINE, with Studio running (hdrctl serve) and the lesson project open:
    py -m pip install playwright
    py capture_studio.py lessons/49-x/captures.json --channel msedge      # uses the installed Edge
    py capture_studio.py lessons/49-x/captures.json --channel chrome
    py capture_studio.py lessons/49-x/captures.json                       # needs: py -m playwright install chromium
    py capture_studio.py lessons/49-x/captures.json --check               # validate the spec, no browser
    py capture_studio.py lessons/49-x/captures.json --only some-shot --headed

captures.json
{
  "base_url": "http://127.0.0.1:5678",
  "viewport": {"width": 1440, "height": 900},
  "scale": 2,
  "theme_cycle": ["light", "dark"],             # shots with "theme": "auto" alternate through this list
  "replace_text": {"C:\\\\Users\\\\jane": "C:\\\\Users\\\\you"},   # privacy: replaced in the page before each shot
  "shots": [{
      "name": "project-settings-execution-order-define",   # becomes <name>-<theme>.png (3 words minimum)
      "path": "/settings/project",
      "theme": "auto",                          # auto | light | dark | midnight | ocean
      "steps": [{"click_text": "Execution order"}, {"wait_ms": 400}],
      "highlight": "[data-testid=job-engine]",  # optional: red outline around this element
      "clip": {"selector": "main", "padding": 12},     # or {"x":0,"y":0,"width":800,"height":500}
      "alt": "Define tab of the Execution order panel with two sequential stages"
  }]
}

Steps: {"goto": "/path"}, {"click": css}, {"click_text": text}, {"fill": css, "value": text},
       {"press": key}, {"hover": css}, {"scroll_into_view": css}, {"wait_for": css}, {"wait_ms": n},
       {"click_last_text": text}   # exact text, last match (e.g. a DSL tab rendered after the palette)
       {"drag": palette label, "x": 600, "y": 300}   # drop a palette item on the canvas
       {"click_xy": [1417, 140]}   # click at page coordinates (e.g. the close button of a banner)
       {"dblclick_node_event": 3}   # same, by a dispatched dblclick event (use when the side panel covers the node after a click)
       {"dblclick_node": 0}   # open the dialog of the n-th node (0-based)
       {"type": "text"}   # type on the keyboard (terminal)
       {"dblclick_last_node": 1}   # open the dialog of the last node
       {"block_api": "**/api/**"}   # simulates a stopped backend: every matching request fails, then the page reloads

Studio themes (localStorage key 'hydra-theme'): dark, midnight, ocean (dark) and light.
Output: <lesson folder>/images/<name>-<theme>.png and images/manifest.json (name, alt, theme).
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

THEMES = {"light", "dark", "midnight", "ocean"}
NAME_RE = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+){2,}")
STEP_KEYS = {"goto", "click", "click_text", "fill", "press", "hover", "scroll_into_view", "wait_for", "wait_ms", "block_api", "click_last_text", "drag", "dblclick_last_node", "dblclick_node", "dblclick_node_event", "click_xy", "drag_xy", "drag_visible", "type", "dblclick_text", "drag_node_into_last", "rightclick_node", "click_last_node_header", "select_option", "upload_dir"}


def load_spec(path) -> dict:
    spec = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    spec.setdefault("base_url", "http://127.0.0.1:5678")
    spec.setdefault("viewport", {"width": 1440, "height": 900})
    spec.setdefault("scale", 2)
    spec.setdefault("theme_cycle", ["light", "dark"])
    spec.setdefault("replace_text", {})
    return spec


def validate(spec: dict) -> list[str]:
    problems = []
    if not spec.get("shots"):
        problems.append("no shots defined")
    for t in spec["theme_cycle"]:
        if t not in THEMES:
            problems.append(f"unknown theme in theme_cycle: {t}")
    seen = set()
    for i, s in enumerate(spec.get("shots", [])):
        tag = f"shot #{i + 1}"
        if not NAME_RE.fullmatch(s.get("name", "")):
            problems.append(f"{tag}: name must be kebab-case with 3 words minimum")
        if s.get("name") in seen:
            problems.append(f"{tag}: duplicate name {s.get('name')}")
        seen.add(s.get("name"))
        if not s.get("path", "").startswith("/"):
            problems.append(f"{tag}: path must start with /")
        if len(s.get("alt", "")) < 20:
            problems.append(f"{tag}: alt text must describe the screenshot (20 characters minimum)")
        if s.get("theme", "auto") not in THEMES | {"auto"}:
            problems.append(f"{tag}: unknown theme {s.get('theme')}")
        for st in s.get("steps", []):
            if not STEP_KEYS & set(st):
                problems.append(f"{tag}: unknown step {st}")
        clip = s.get("clip")
        if clip and not ("selector" in clip or {"x", "y", "width", "height"} <= set(clip)):
            problems.append(f"{tag}: clip needs a selector or x, y, width, height")
    return problems


def resolve_themes(spec: dict) -> list[str]:
    cycle, out, k = spec["theme_cycle"], [], 0
    for s in spec["shots"]:
        t = s.get("theme", "auto")
        if t == "auto":
            t = cycle[k % len(cycle)]
            k += 1
        out.append(t)
    return out


REDACT_JS = """(map) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) { for (const [a, b] of Object.entries(map)) { if (n.nodeValue.includes(a)) n.nodeValue = n.nodeValue.split(a).join(b); } }
  document.querySelectorAll('input,textarea').forEach(e => { for (const [a, b] of Object.entries(map)) { if (e.value && e.value.includes(a)) e.value = e.value.split(a).join(b); } });
}"""


def run(spec: dict, out_dir: pathlib.Path, only: str | None, headed: bool, channel: str | None) -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright is not installed: py -m pip install playwright", file=sys.stderr)
        return 2
    themes = resolve_themes(spec)
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest = []
    with sync_playwright() as pw:
        launch = {"headless": not headed}
        if channel:
            launch["channel"] = channel
        browser = pw.chromium.launch(**launch)
        for shot, theme in zip(spec["shots"], themes):
            if only and shot["name"] != only:
                continue
            ctx = browser.new_context(viewport=spec["viewport"], device_scale_factor=spec["scale"])
            ctx.add_init_script(f"localStorage.setItem('hydra-theme', {json.dumps(theme)});")
            page = ctx.new_page()
            page.goto(spec["base_url"].rstrip("/") + shot["path"], wait_until="networkidle")
            for st in shot.get("steps", []):
                if "goto" in st:
                    page.goto(spec["base_url"].rstrip("/") + st["goto"], wait_until="networkidle")
                elif "click" in st:
                    try:
                        page.click(st["click"], timeout=8000)
                    except Exception:
                        page.screenshot(path="debug-fail.png")
                        print("DEBUG url:", page.url)
                        print("DEBUG buttons:", [b.inner_text()[:30] for b in page.locator("button").all()[:60]])
                        raise
                elif "click_text" in st:
                    page.get_by_text(st["click_text"], exact=False).first.click()
                elif "click_last_text" in st:
                    page.get_by_text(st["click_last_text"], exact=True).last.click()
                elif "drag_visible" in st:
                    page.locator("text='" + st["drag_visible"] + "' >> visible=true").first.drag_to(
                        page.locator("[data-testid=rf__wrapper]"),
                        target_position={"x": st.get("x", 500), "y": st.get("y", 300)})
                    page.wait_for_timeout(900)
                elif "drag" in st:
                    # {"drag": "Error Scope", "x": 600, "y": 300}: drop a palette item on the canvas
                    page.get_by_text(st["drag"], exact=True).first.drag_to(
                        page.locator("[data-testid=rf__wrapper]"),
                        target_position={"x": st.get("x", 500), "y": st.get("y", 300)})
                    page.wait_for_timeout(900)
                elif "drag_node_into_last" in st:
                    # {"drag_node_into_last": "first-job"}: drag that node into the body of the last node (a container)
                    a = page.locator(".react-flow__node").filter(has_text=st["drag_node_into_last"]).first.bounding_box()
                    c = page.locator(".react-flow__node").last.bounding_box()
                    ax, ay = a["x"] + a["width"] / 2, a["y"] + a["height"] / 2
                    cx, cy = c["x"] + c["width"] / 2, c["y"] + c["height"] * 0.65
                    page.mouse.move(ax, ay)
                    page.mouse.down()
                    page.mouse.move((ax + cx) / 2, (ay + cy) / 2, steps=12)
                    page.mouse.move(cx, cy, steps=12)
                    page.mouse.up()
                    page.wait_for_timeout(900)
                elif "rightclick_node" in st:
                    page.locator(".react-flow__node").filter(has_text=st["rightclick_node"]).first.click(button="right")
                    page.wait_for_timeout(600)
                elif "click_last_node_header" in st:
                    c = page.locator(".react-flow__node").last.bounding_box()
                    page.mouse.click(c["x"] + c["width"] * 0.5, c["y"] + 14)
                    page.wait_for_timeout(600)
                elif "upload_dir" in st:
                    # {"upload_dir": "input[type=file][webkitdirectory] >> nth=1", "path": "C:\\path\\to\\folder"}: pick a folder in a hidden folder input
                    page.locator(st["upload_dir"]).set_input_files(st["path"])
                    page.wait_for_timeout(1500)
                elif "select_option" in st:
                    # {"select_option": "[aria-label='x']", "value": "wf_load_backup"}
                    page.select_option(st["select_option"], st["value"])
                    page.wait_for_timeout(500)
                elif "dblclick_text" in st:
                    page.get_by_text(st["dblclick_text"], exact=True).first.dblclick()
                elif "drag_xy" in st:
                    x0, y0, x1, y1 = st["drag_xy"]
                    page.mouse.move(x0, y0); page.mouse.down(); page.mouse.move(x1, y1, steps=12); page.mouse.up()
                elif "click_xy" in st:
                    page.mouse.click(st["click_xy"][0], st["click_xy"][1])
                elif "dblclick_node_event" in st:
                    page.locator(".react-flow__node").nth(int(st["dblclick_node_event"])).evaluate("el => el.dispatchEvent(new MouseEvent('dblclick', {bubbles: true, cancelable: true, view: window}))")
                elif "dblclick_node" in st:
                    page.locator(".react-flow__node").nth(int(st["dblclick_node"])).dblclick()
                elif "type" in st:
                    page.keyboard.type(st["type"], delay=30)
                elif "dblclick_last_node" in st:
                    page.locator(".react-flow__node").last.dblclick()
                elif "fill" in st:
                    page.fill(st["fill"], st.get("value", ""))
                elif "press" in st:
                    page.keyboard.press(st["press"])
                elif "hover" in st:
                    page.hover(st["hover"])
                elif "scroll_into_view" in st:
                    page.locator(st["scroll_into_view"]).first.scroll_into_view_if_needed()
                elif "wait_for" in st:
                    page.wait_for_selector(st["wait_for"])
                elif "block_api" in st:
                    page.route(st["block_api"], lambda route: route.abort())
                    page.reload(wait_until="load")
                    page.wait_for_timeout(800)
                elif "wait_ms" in st:
                    page.wait_for_timeout(int(st["wait_ms"]))
            if spec["replace_text"]:
                page.evaluate(REDACT_JS, spec["replace_text"])
            if shot.get("highlight"):
                page.add_style_tag(content=f"{shot['highlight']}{{outline:3px solid #ef4444 !important;outline-offset:3px;border-radius:6px}}")
            target = out_dir / f"{shot['name']}-{theme}.png"
            clip = shot.get("clip")
            if clip and "selector" in clip:
                box = page.locator(clip["selector"]).first.bounding_box()
                if not box:
                    print(f"  ! {shot['name']}: selector {clip['selector']} not found, taking the full viewport")
                    page.screenshot(path=str(target))
                else:
                    pad = clip.get("padding", 0)
                    vw, vh = spec["viewport"]["width"], spec["viewport"]["height"]
                    x, y = max(0, box["x"] - pad), max(0, box["y"] - pad)
                    w, h = min(vw - x, box["width"] + 2 * pad), min(vh - y, box["height"] + 2 * pad)
                    page.screenshot(path=str(target), clip={"x": x, "y": y, "width": w, "height": h})
            elif clip:
                page.screenshot(path=str(target), clip={k: clip[k] for k in ("x", "y", "width", "height")})
            else:
                page.screenshot(path=str(target))
            manifest.append({"file": target.name, "name": shot["name"], "theme": theme, "alt": shot["alt"]})
            print(f"  saved {target.name}")
            ctx.close()
        browser.close()
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("spec")
    ap.add_argument("--out", help="images folder (default: <spec folder>/images)")
    ap.add_argument("--only")
    ap.add_argument("--headed", action="store_true")
    ap.add_argument("--channel", help="installed browser: chrome or msedge (no download needed)")
    ap.add_argument("--check", action="store_true", help="validate the spec only")
    a = ap.parse_args(argv)
    spec = load_spec(a.spec)
    problems = validate(spec)
    for p in problems:
        print("SPEC ERROR:", p)
    if problems:
        return 1
    themes = resolve_themes(spec)
    print(f"{len(spec['shots'])} shot(s); themes: {', '.join(themes)}")
    if a.check:
        return 0
    out = pathlib.Path(a.out) if a.out else pathlib.Path(a.spec).resolve().parent / "images"
    return run(spec, out, a.only, a.headed, a.channel)


if __name__ == "__main__":
    sys.exit(main())

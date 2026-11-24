import json, sys
port, wfjson, pid = sys.argv[1], sys.argv[2], sys.argv[3]
ids = {w["name"]: w["id"] for w in json.loads(open(wfjson, encoding="utf-8-sig").read())}
P = "/workflows/%s?projectId=%s" % (ids["workflow1"], pid)
def build(scope):
    return [{"wait_for": "header"}, {"wait_ms": 1500}, {"click_xy": [1417, 140]}, {"wait_ms": 400}, {"click_text": "Workflow configuration"}, {"wait_ms": 1600},
            {"click": "button:has(span:text-is(\"Actions\"))"}, {"wait_ms": 600},
            {"drag_visible": "Log", "x": 520, "y": 90}, {"wait_ms": 700},
            {"drag_visible": scope, "x": 60, "y": 330}, {"wait_ms": 900},
            {"drag_node_into_last": "Log"}, {"wait_ms": 1200}]
def shot(name, scope, theme, alt):
    return {"name": name, "path": P, "theme": theme, "steps": build(scope), "alt": alt,
            "clip": {"x": 0, "y": 0, "width": 1440, "height": 900}}
shots = [shot("retry-scope-container-canvas", "Retry Scope", "light", "The Hydra Studio workflow editor with a Retry Scope container dropped on the canvas, with its Retries field.")]
print(json.dumps({"base_url": "http://127.0.0.1:%s" % port, "viewport": {"width": 1440, "height": 900}, "scale": 2, "theme_cycle": ["light"],
  "replace_text": {"C:\\Users\\DELL": "C:\\Users\\you"}, "shots": shots}, indent=1))

import json, sys
port, wfjson, pid = sys.argv[1], sys.argv[2], sys.argv[3]
raw = open(wfjson, encoding="utf-8-sig").read()
wfs = json.loads(raw)
ids = {w["name"]: w["id"] for w in wfs}
def shot(name, wf, theme, alt):
    return {"name": name, "path": "/workflows/%s?projectId=%s" % (ids[wf], pid), "theme": theme,
            "steps": [{"wait_for": "header"}, {"wait_ms": 1800}, {"dblclick_last_node": True}, {"wait_ms": 1200}],
            "clip": {"x": 208, "y": 56, "width": 1232, "height": 844}, "alt": alt}
shots = [
 shot("webhook-action-dialog-fields", "wf-hook", "light", "The Webhook action dialog of Hydra Studio with the URL, the Method list, the JSON body and the JSON headers filled in."),
 shot("email-action-dialog-fields", "wf-mail", "dark", "The Email action dialog of Hydra Studio with the recipient, the subject, the body, the sender and the SMTP server and port filled in."),
]
print(json.dumps({"base_url": "http://127.0.0.1:%s" % port, "viewport": {"width": 1440, "height": 900}, "scale": 2, "theme_cycle": ["light", "dark"],
  "replace_text": {"C:\\Users\\DELL\\Desktop\\hydra-site\\tools\\tutorials\\act2s-probe": "C:\\Users\\you\\projects", "C:\\Users\\DELL": "C:\\Users\\you"}, "shots": shots}, indent=1))

import json, sys
pid, port = sys.argv[1], sys.argv[2]
P = "/settings/project/%s?tab=triggers" % pid
W = {"wait_for": "[data-testid=triggers-panel]"}
def add(name, typ=None):
    s = [W, {"click": "[data-testid=trigger-add]"}, {"wait_ms": 400}]
    if typ: s.append({"click": "[data-type=%s]" % typ}); s.append({"wait_ms": 300})
    s.append({"fill": "[aria-label='Trigger name']", "value": name})
    return s
def cron():
    return [{"fill": "[aria-label='Time zone']", "value": "Europe/Paris"}]
ok = [{"click": "[data-testid=trigger-dialog-ok]"}, {"wait_ms": 1800}]
shots = [
 {"name": "trigger-cron-dialog", "path": P, "theme": "light", "steps": add("nightly") + cron() + [{"wait_ms": 300}],
  "clip": {"selector": "[data-testid=trigger-dialog]", "padding": 10},
  "alt": "The Add a trigger box of the Triggers tab with the type At given times selected, the name nightly, the cron 0 2 * * * and the time zone Europe/Paris."},
 {"name": "trigger-cron-saved", "path": P, "theme": "dark", "steps": add("nightly") + cron() + ok,
  "clip": {"selector": "[data-testid=triggers-panel]", "padding": 12},
  "alt": "The Triggers tab with one row, nightly, of type cron, with its next run time and an enabled checkbox."},
 {"name": "trigger-webhook-dialog", "path": P, "theme": "light", "steps": add("deploy", "webhook") + [{"wait_ms": 300}],
  "clip": {"selector": "[data-testid=trigger-dialog]", "padding": 10},
  "alt": "The Add a trigger box with the type An HTTP call selected, the name deploy and the token field holding a secret reference."},
 {"name": "trigger-webhook-saved", "path": P, "theme": "dark", "steps": add("deploy", "webhook") + ok,
  "clip": {"selector": "[data-testid=triggers-panel]", "padding": 12},
  "alt": "The Triggers tab with the rows nightly and deploy; the deploy row says no token yet and has a key button."},
 {"name": "trigger-token-before", "path": P, "theme": "light", "steps": [W, {"click": "[aria-label='Token of deploy']"}, {"wait_ms": 500}],
  "clip": {"selector": "[data-testid=token-dialog]", "padding": 10},
  "alt": "The Token of deploy box before the token exists, with the explanation and a Create the token button."},
 {"name": "trigger-token-created", "path": P, "theme": "dark", "steps": [W, {"click": "[aria-label='Token of deploy']"}, {"wait_ms": 400}, {"click": "[data-testid=token-create]"}, {"wait_ms": 1200}],
  "clip": {"selector": "[data-testid=token-dialog]", "padding": 10},
  "alt": "The Token of deploy box after creation: the token value shown once, a Copy the token button, and PowerShell and curl commands with the webhook URL."},
 {"name": "trigger-run-now", "path": P, "theme": "light", "steps": [W, {"click": "[aria-label='Run nightly now']"}, {"wait_ms": 14000}],
  "clip": {"selector": "[data-testid=triggers-panel]", "padding": 12},
  "alt": "The Triggers tab after Run now on nightly: the last run column shows a green check and the origin api, and the History list has a nightly line with its duration."},
]
spec = {"base_url": "http://127.0.0.1:%s" % port, "viewport": {"width": 1440, "height": 1100}, "scale": 2, "theme_cycle": ["light", "dark"],
        "replace_text": {"C:\\Users\\DELL\\Desktop\\hydra-site\\tools\\tutorials\\tstud-probe": "C:\\Users\\you\\projects", "C:\\Users\\you\\Desktop\\hydra-site\\tools\\tutorials\\tstud-probe": "C:\\Users\\you\\projects", "C:\\Users\\DELL": "C:\\Users\\you"}, "shots": shots}
print(json.dumps(spec, indent=1))

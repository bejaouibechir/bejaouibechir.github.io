import json, sys
pid, port = sys.argv[1], sys.argv[2]
G = "/settings/global"
S = "/settings/project/%s?tab=secrets" % pid
EM = "[data-testid=environments-manager]"
SP = "[data-testid=secrets-panel]"
W = lambda sel: {"wait_for": sel}
def newenv(name): return [W(EM), {"click": "[data-testid=env-new]"}, {"wait_ms": 300}, {"fill": "[aria-label='Environment name']", "value": name}]
def addvar(k, v): return [{"click": "[data-testid=env-add-var]"}, {"wait_ms": 200}, {"fill": "[aria-label='Variable name'] >> nth=-1", "value": k}, {"fill": "[aria-label='Variable value'] >> nth=-1", "value": v}]
def secret(n, v): return [{"fill": "[aria-label='Secret name']", "value": n}, {"fill": "[aria-label='Secret value']", "value": v}]
shots = [
 {"name": "env-common-tab", "path": G, "theme": "light", "steps": [W(EM), {"wait_ms": 800}], "clip": {"selector": EM, "padding": 8},
  "alt": "The Environments card of Global settings on the Common tab, with the variables REGION and API_URL, an Add variable button and a Save common variables button."},
 {"name": "env-new-box", "path": G, "theme": "dark", "steps": newenv("prod") + [{"wait_ms": 300}], "clip": {"selector": EM, "padding": 8},
  "alt": "The Environments card with the New environment box open and the name prod typed, next to the tabs Common and New environment."},
 {"name": "env-prod-saved", "path": G, "theme": "light", "steps": newenv("prod") + [{"press": "Enter"}, {"wait_ms": 900}] + addvar("API_URL", "https://api.example.test") + [{"click": "[data-testid=env-save]"}, {"wait_ms": 500}], "clip": {"selector": EM, "padding": 8},
  "alt": "The Environments card on the prod tab after Save: one variable API_URL with the value https://api.example.test, the file name env.prod and the message Saved."},
 {"name": "env-active-selector", "path": "/projects/%s" % pid, "theme": "dark", "steps": [W("[data-testid=env-selector]"), {"wait_ms": 800}], "clip": {"selector": "[data-testid=env-selector]", "padding": 24},
  "alt": "The Active environment list on the project page, set next to a Manage link that opens the Environments card."},
 {"name": "secrets-form-filled", "path": S, "theme": "light", "steps": [W(SP), {"wait_ms": 600}] + secret("db.password", "change-me-demo"), "clip": {"selector": SP, "padding": 10},
  "alt": "The Secrets tab of the project settings with the name db.password typed and a hidden value, above an Add button, and the note that the file is ignored by git."},
 {"name": "secrets-row-added", "path": S, "theme": "dark", "steps": [W(SP), {"wait_ms": 600}] + secret("db.password", "change-me-demo") + [{"click": "form button[type=submit]"}, {"wait_ms": 1200}], "clip": {"selector": SP, "padding": 10},
  "alt": "The Secrets tab after adding db.password: one row with the name, six dots instead of the value, the source common, and a button copying the reference SECRET:db.password."},
 {"name": "secrets-prod-scope", "path": S, "theme": "light", "steps": [W(SP), {"wait_ms": 600}, {"select_option": "[aria-label='Secrets scope']", "value": "prod"}, {"wait_ms": 600}] + secret("api.token", "prod-token-demo") + [{"click": "form button[type=submit]"}, {"wait_ms": 1200}], "clip": {"selector": SP, "padding": 10},
  "alt": "The Secrets tab with the scope set to prod: the list shows db.password from common and api.token from prod, and the file name .hydra/secrets.prod."},
]
spec = {"base_url": "http://127.0.0.1:%s" % port, "viewport": {"width": 1440, "height": 1100}, "scale": 2, "theme_cycle": ["light", "dark"],
        "replace_text": {"C:\\Users\\DELL\\Desktop\\hydra-site\\tools\\tutorials\\secenv-probe": "C:\\Users\\you\\projects", "C:\\Users\\you\\Desktop\\hydra-site\\tools\\tutorials\\secenv-probe": "C:\\Users\\you\\projects", "C:\\Users\\DELL": "C:\\Users\\you"}, "shots": shots}
print(json.dumps(spec, indent=1))

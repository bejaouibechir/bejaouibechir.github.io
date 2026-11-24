import pathlib
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/studio_trig_patch.py").read_text(encoding="utf-8").split("def sched(")[0])
FW = "studio-notify-actions"
def steps(n, fw):
    s = step(n, "Open the Webhook action in Studio", "See the same parameters as a form.",
     ["Open the workflow in Hydra Studio and double-click its Webhook node."],
     "double-click the Webhook node",
     "<p>The dialog is titled <b>Webhook</b>, <b>Outgoing HTTP call</b>. The first three fields are common to every action: step name, <b>On failure</b> (default <b>fail</b>) and a run condition. Below them come the four parameters of the YAML: <b>URL</b> (marked required), <b>Method</b> (a list starting with POST), <b>Body (JSON)</b> and <b>Headers (JSON)</b>. Each text field has an <b>{x}</b> button to insert a parameter or a secret reference.</p>",
     "The URL <code>http://127.0.0.1:8099/hook</code> and the body of the YAML, in the fields.", "",
     fig(fw, "webhook-action-dialog-fields-light", "The Webhook action dialog of Hydra Studio with the step name notify, the URL, the POST method and the JSON body filled in.", "The <b>Webhook</b> dialog."))
    s += step(n + 1, "Open the Email action in Studio", "Same idea for the email.",
     ["Open the workflow with the Email node and double-click the node."],
     "double-click the Email node",
     "<p>The dialog is titled <b>Email</b>, <b>Send email</b>. <b>Recipient</b> and <b>Subject</b> are required; then come <b>Body</b>, <b>Sender (From)</b>, <b>SMTP server</b>, <b>SMTP port</b>, <b>SMTP user</b>, <b>SMTP password</b> and a <b>TLS (STARTTLS)</b> list set to false by default. Scroll the dialog to reach the SMTP fields.</p>",
     "Recipient <code>team@example.test</code> and subject <code>Load finished</code>.", "",
     fig(fw, "email-action-dialog-fields-dark", "The Email action dialog of Hydra Studio with the step name send_mail, the recipient, the subject and the body filled in.", "The <b>Email</b> dialog."))
    return s
patch("notify-with-webhook-and-email-actions", 27, FW, steps,
 ["Open the Webhook action in Studio", "Open the Email action in Studio"],
 ("Can I configure the webhook and email actions in Hydra Studio?", "Yes. Double-clicking the node opens a dialog with the same parameters as the YAML: URL, method, body and headers for the webhook; recipient, subject, body and SMTP settings for the email."),
 "In Studio, double-click the node to edit the same parameters in a dialog.", "Then open both nodes in Studio to see the same parameters as forms.")

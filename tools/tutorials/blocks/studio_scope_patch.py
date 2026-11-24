import pathlib
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/studio_trig_patch.py").read_text(encoding="utf-8").split("def sched(")[0])
def err(n, fw):
    return step(n, "Find the Error Scope in Studio", "Drop the container on the canvas.",
     ["Open a workflow in Hydra Studio, in the <b>Workflow configuration</b> tab.", "In the node palette, open <b>Containers</b> and drag <b>Error Scope</b> onto the canvas.", "Read the box that appears and the panel on the right."],
     "palette → Containers → Error Scope",
     "<p>The palette has three containers: <b>Sequence Container</b>, <b>Error Scope</b> and <b>Retry Scope</b>. The Error Scope is a red dashed box with the line <b>On child failure</b> and a list, set to <b>skip</b> in our test. The panel on the right gives the box a step name (<code>container_2</code> here) and an <b>On failure</b> list like the one of any other step.</p>",
     "A red box named Error Scope with its On child failure list.", "",
     fig(fw, "error-scope-container-canvas-light", "The Hydra Studio workflow editor with an Error Scope container dropped on the canvas, showing the line On child failure set to skip, and the container panel on the right.", "The <b>Error Scope</b> container on the canvas."))
def rty(n, fw):
    return step(n, "Find the Retry Scope in Studio", "Drop the container on the canvas.",
     ["Open a workflow in Hydra Studio, in the <b>Workflow configuration</b> tab.", "In the node palette, open <b>Containers</b> and drag <b>Retry Scope</b> onto the canvas.", "Read the two numbers at the top of the box."],
     "palette → Containers → Retry Scope",
     "<p>The Retry Scope is a blue dashed box. Its first line holds two fields: <b>Retries</b>, set to 3 when we dropped it, and <b>delay</b> in seconds, set to 5. These are the two values this lesson sets with <code>retry</code> in the YAML.</p>",
     "A blue box named Retry Scope with Retries and delay fields.", "",
     fig(fw, "retry-scope-container-canvas-light", "The Hydra Studio workflow editor with a Retry Scope container dropped on the canvas, with its Retries field set to 3 and its delay field set to 5 seconds.", "The <b>Retry Scope</b> container on the canvas."))
patch("handle-step-failures-with-on-failure", 52, "studio-error-scope-canvas", err, ["Find the Error Scope in Studio"],
 ("Is there an Error Scope in Hydra Studio?", "Yes. The Containers group of the node palette has an Error Scope; dropped on the canvas, it shows an On child failure list, set to skip in our test."),
 "In Studio, the Containers group of the palette has an <b>Error Scope</b>.", "Then find the Error Scope in the palette of Studio.")
patch("retry-a-failing-step-with-retry", 53, "studio-retry-scope-canvas", rty, ["Find the Retry Scope in Studio"],
 ("Is there a Retry Scope in Hydra Studio?", "Yes. The Containers group of the node palette has a Retry Scope; dropped on the canvas, it shows a Retries field set to 3 and a delay of 5 seconds in our test."),
 "In Studio, the Containers group of the palette has a <b>Retry Scope</b>.", "Then find the Retry Scope in the palette of Studio.")

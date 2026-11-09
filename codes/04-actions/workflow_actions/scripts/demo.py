import json, os, socket, sys, time, urllib.request
from pathlib import Path
from hydra_etl.workflow.project import ProjectRunner, prepare_project

root = Path(__file__).resolve().parents[1]
def ready(port):
    deadline = time.time() + 90
    while time.time() < deadline:
        try:
            with socket.create_connection(('127.0.0.1',port),timeout=1):
                return
        except OSError:
            time.sleep(1)
    raise SystemExit(f'Service on port {port} is not ready')

for port in (1025,8088,2224): ready(port)
(root / 'output').mkdir(exist_ok=True)
(root / 'output' / 'inspector').mkdir(exist_ok=True)
result = ProjectRunner(prepare_project(root)).run()
if not result.success:
    for run in result.runs:
        print(run.name,run.status,run.error)
        for step in (run.result.steps if run.result else []):
            if step.error: print(step.step_name,step.error)
    raise SystemExit('Workflow failed')
steps = result.runs[0].result.steps
expected = {'log','delay','condition','webhook','email','bash','powershell','ssh','python','set_param','assign_param'}
from hydra_etl.workflow.parser import load_workflow
declared = {s.action for s in load_workflow(root / 'workflows' / 'all_actions.yaml').steps if s.action}
assert declared == expected, (declared,expected)
assert [s.step_name for s in steps if s.skipped] == ['archive_powershell']
assert all(s.success for s in steps)
assert json.loads((root / 'output' / 'check.json').read_text()) == {'rows':3,'total':42}
assert (root / 'output' / 'archive' / 'orders-nightly.csv').read_text() == (root / 'data' / 'orders.csv').read_text()
with urllib.request.urlopen('http://127.0.0.1:8088/requests') as response:
    requests = json.load(response)
assert requests and requests[-1]['body'] == {'batch':'nightly','rows':3}, requests
with urllib.request.urlopen('http://127.0.0.1:8025/api/v1/messages') as response:
    mail = json.load(response)
assert mail.get('total',0) >= 1, mail
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect(hostname='127.0.0.1',port=2224,username='demo',password='demo-only',look_for_keys=False,allow_agent=False,timeout=10)
    _, stdout, stderr = client.exec_command('cat /config/receipts/latest.txt')
    receipt = stdout.read().decode().strip()
    assert stdout.channel.recv_exit_status() == 0 and receipt == 'batch=nightly', (receipt,stderr.read())
finally:
    client.close()
print('PASS: 11 actions declared, 10 executed on Linux; CSV, archive, HTTP, email and SSH verified')

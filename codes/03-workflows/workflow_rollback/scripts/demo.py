import json,os,subprocess,sys,threading
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
import psycopg2
from make_last_step_fail import arm,restore,source
root=Path(__file__).resolve().parents[1]
events=[]
class Webhook(BaseHTTPRequestHandler):
 def do_POST(self):
  if self.path not in ('/notify','/cancel'): self.send_error(404);return
  size=int(self.headers.get('Content-Length','0'));body=self.rfile.read(size)
  events.append({'path':self.path,'body':json.loads(body) if body else {}})
  self.send_response(204);self.end_headers()
 def log_message(self,*args): pass
def rows():
 secret=root/'.hydra'/'secrets'
 if not secret.is_file(): raise RuntimeError('Copy .hydra/secrets.example to .hydra/secrets')
 values=dict(line.split('=',1) for line in secret.read_text().splitlines() if line and not line.startswith('#') and '=' in line)
 with psycopg2.connect(host='127.0.0.1',port=5444,user='rollback_demo',password=values['PG_PASSWORD'],dbname='rollback_demo') as db:
  with db.cursor() as cur:
   out={}
   for name in ('invoices','payments'):
    cur.execute(f'SELECT id,amount FROM demo.{name} ORDER BY id')
    out[name]=[list(row) for row in cur.fetchall()]
   return out
def main():
 baseline={'invoices':[[1,100]],'payments':[[1,100]]}
 if rows()!=baseline: raise RuntimeError('Tables must contain only the initial rows; use a fresh Compose volume')
 if not source.is_file(): raise RuntimeError('Restore payments.csv first')
 server=ThreadingHTTPServer(('127.0.0.1',8765),Webhook)
 thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
 try:
  arm()
  hdrctl=Path(sys.executable).with_name('hdrctl.exe' if os.name=='nt' else 'hdrctl')
  run=subprocess.run([str(hdrctl),'workflow','run','rollback_demo'],cwd=root,text=True,capture_output=True)
  print(run.stdout)
  if run.stderr: print(run.stderr,file=sys.stderr)
 finally:
  restore();server.shutdown();server.server_close();thread.join(timeout=5)
 current=rows()
 print('Webhook calls:',json.dumps(events))
 print('Tables after rollback:',json.dumps(current,sort_keys=True))
 if run.returncode==0: raise RuntimeError('Final job should fail')
 if [e['path'] for e in events]!=['/notify','/cancel']: raise RuntimeError('Notify/cancel calls missing')
 if current!=baseline: raise RuntimeError('Tables not restored')
 if (root/'.hydra'/'undo'/'rollback_demo.json').exists(): raise RuntimeError('Undo journal remains')
 if not source.is_file(): raise RuntimeError('Payment source not restored')
 print('PASS: third step failed; webhook canceled; both tables restored')
if __name__=='__main__':
 try: main()
 except Exception as exc: raise SystemExit(f'FAIL: {exc}') from None

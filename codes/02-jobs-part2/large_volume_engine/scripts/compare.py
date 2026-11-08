"""Run the three Hydra jobs, verify engine choice and equal country totals."""
import argparse,csv,os,re,subprocess,sys
from pathlib import Path
from hydra_etl.internal.engines.large_volume import estimate_csv_rows
ROOT=Path(__file__).resolve().parents[1]
ENGINES=('auto','pandas','duckdb')
def read(path):
 with path.open(newline='',encoding='utf-8-sig') as f:
  reader=csv.DictReader(f);return reader.fieldnames,list(reader)
def main():
 p=argparse.ArgumentParser();p.add_argument('engines',nargs='*',choices=ENGINES);a=p.parse_args()
 names=a.engines or ENGINES
 source=ROOT/'data/sales.csv'
 if not source.exists():p.error('Run scripts/generate.py first')
 estimated=estimate_csv_rows(source)
 print(f'CSV estimated rows: {estimated:,}; auto threshold: 2,000,000',flush=True)
 if estimated<2000000:p.error('Use a large CSV to demonstrate the auto DuckDB decision')
 baseline=None;failed=[]
 for name in names:
  job=ROOT/'jobs'/name
  env=dict(os.environ,PYTHONUTF8='1',HYDRA_LANG='en',NO_COLOR='1')
  env.pop('HYDRA_ENGINE',None);env.pop('HYDRA_LARGE_VOLUME_ROWS',None)
  run=subprocess.run([sys.executable,'-B','-m','hydra_etl.cli.hdrctl','run',str(job),'--profile'],cwd=ROOT,env=env,text=True,capture_output=True,encoding='utf-8',errors='replace',timeout=600)
  log=run.stdout+'\n'+run.stderr
  (job/'output/profile.log').write_text(log,encoding='utf-8')
  match=re.search(r'(?:moteur|engine)\s+(pandas|duckdb)',log,re.I)
  actual=match.group(1).lower() if match else None
  expected_engine='duckdb' if name=='auto' else name
  try:
   assert run.returncode==0,log[-1000:]
   assert actual==expected_engine,f'Expected {expected_engine}, observed {actual}'
   head,rows=read(job/'output/result.csv')
   expected_head,expected_rows=read(ROOT/'expected/result.csv')
   assert (head,rows)==(expected_head,expected_rows),'Country totals differ from expected'
   if baseline is None:baseline=(head,rows)
   else:assert (head,rows)==baseline,'The three variants differ'
   print(f'PASS {name}: selected {actual}; 4 matching totals',flush=True)
  except Exception as e:
   failed.append(name);print(f'FAIL {name}: {e}',flush=True)
 print(f'{len(names)-len(failed)}/{len(names)} variants passed',flush=True)
 return bool(failed)
if __name__=='__main__':sys.exit(main())

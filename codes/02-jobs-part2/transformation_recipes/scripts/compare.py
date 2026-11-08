"""Run recipe jobs with Hydra and check exact CSV plus key outcomes."""
import argparse,csv,math,os
from pathlib import Path
import subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
JOBS=sorted(p for p in (ROOT/'jobs').iterdir() if p.is_dir())
def read(p):
 with p.open(newline='',encoding='utf-8-sig') as f:
  reader=csv.DictReader(f);return reader.fieldnames,list(reader)
def semantic(name,rows):
 if name=='latest_order':
  assert {r['customer_id']:r['id'] for r in rows}=={'C100':'3','C101':'5','C102':'4'}
 elif name=='period_change':
  assert len(rows)==5 and [r['growth_pct'] for r in rows]==['nan','nan','25.0','-20.0','20.0']
 elif name=='running_share':
  by_id={r['id']:r for r in rows}
  assert len(rows)==5 and abs(float(by_id['1']['cumulative_pct'])-72.72727272727273)<1e-9
  assert all(float(by_id[i]['cumulative_pct'])==100 for i in ('3','4','5'))
 elif name=='days_without_sales':
  assert {(r['store_id'],r['day']) for r in rows}=={('S1','2025-01-02'),('S2','2025-01-01')}
  assert all(r['amount']=='nan' for r in rows)
 elif name=='clean_enrich_aggregate':
  assert {r['segment']:int(r['nb_contacts']) for r in rows}=={'premium':2,'standard':1,'unknown':1}
 else:raise AssertionError(f'Unknown recipe {name}')
def main():
 parser=argparse.ArgumentParser();parser.add_argument('recipes',nargs='*');a=parser.parse_args()
 known={j.name:j for j in JOBS};names=a.recipes or list(known)
 if set(names)-set(known):parser.error('Unknown recipe')
 failed=[]
 for name in names:
  job=known[name]
  result=subprocess.run([sys.executable,'-B','-m','hydra_etl.cli.hdrctl','run',str(job)],cwd=ROOT,env=dict(os.environ,PYTHONUTF8='1',HYDRA_LANG='en'),capture_output=True,text=True,encoding='utf-8',timeout=120)
  try:
   assert result.returncode==0, (result.stdout+result.stderr)[-1000:]
   actual=read(job/'outputs/result.csv');expected=read(ROOT/'expected'/f'{name}.csv')
   assert actual==expected,'Output differs from expected CSV'
   semantic(name,actual[1])
   print(f'PASS {name}')
  except Exception as e:
   failed.append(name);print(f'FAIL {name}: {e}')
 print(f'{len(names)-len(failed)}/{len(names)} recipes passed')
 return bool(failed)
if __name__=='__main__':sys.exit(main())
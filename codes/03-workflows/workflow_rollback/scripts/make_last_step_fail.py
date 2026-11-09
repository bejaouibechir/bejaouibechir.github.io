import sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=root/'data'/'payments.csv'
hidden=root/'data'/'payments.csv.hidden'
def arm():
 if not source.is_file() or hidden.exists(): raise RuntimeError('Expected payments.csv and no hidden copy')
 source.rename(hidden); print('Armed: payment CSV temporarily hidden')
def restore():
 if source.is_file() and not hidden.exists(): return
 if source.exists() or not hidden.is_file(): raise RuntimeError('Unexpected source state')
 hidden.rename(source); print('Restored payments.csv')
if __name__=='__main__':
 try: {'arm':arm,'restore':restore}[sys.argv[1]]()
 except (IndexError,KeyError,RuntimeError) as exc: raise SystemExit(f'Usage: arm|restore; {exc}') from None

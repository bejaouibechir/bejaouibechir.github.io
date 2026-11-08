"""Stream a deterministic sales CSV without holding its rows in memory."""
import argparse,csv
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--rows',type=int,default=5000000);a=p.parse_args()
if a.rows<=0 or a.rows%4:p.error('--rows must be positive and divisible by four')
dest=ROOT/'data/sales.csv'
if dest.exists():p.error('data/sales.csv exists; refusing to overwrite it')
dest.parent.mkdir(exist_ok=True)
with dest.open('w',newline='',encoding='utf-8') as f:
 w=csv.writer(f);w.writerow(['country','amount'])
 for _ in range(a.rows//4):w.writerows([('FR',10),('BE',20),('DE',30),('ES',40)])
print(f'Generated {a.rows:,} rows at {dest}')

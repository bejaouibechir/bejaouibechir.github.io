import csv, json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
with (root / 'output' / 'orders.csv').open(newline='', encoding='utf-8') as handle:
    rows = list(csv.DictReader(handle))
total = sum(int(row['amount']) for row in rows)
if len(rows) != 3 or total != 42:
    raise SystemExit(f'Unexpected output: rows={len(rows)} total={total}')
(root / 'output' / 'check.json').write_text(json.dumps({'rows':len(rows),'total':total},indent=2)+'\n')
print(f'CHECK rows={len(rows)} total={total}')

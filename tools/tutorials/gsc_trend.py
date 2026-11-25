#!/usr/bin/env python3
"""
Tendance Search Console de hydraetl.com, mois par mois.

Pourquoi ce script en plus de gsc_audit.py : l'audit agrege 16 mois en un seul
total, ce qui ecrase l'histoire d'un site mis en ligne en aout 2026. Google a
commence a explorer en septembre. La seule question qui compte sur un site de
trois mois n'est pas "combien au total" mais "est-ce que ca monte".

Prerequis : identiques a gsc_audit.py (API Search Console activee, compte de
service, sa cle JSON dans <repo>\\.gsc-key.json, compte ajoute dans Search
Console avec la permission Complet).

Lancer (PowerShell, depuis la racine du depot) :
    py tools\\tutorials\\gsc_trend.py

Sorties dans <repo>\\tools\\tutorials\\_gsc\\ :
    trend_monthly.json    impressions, clics, CTR et position par mois
    trend_queries.json    les requetes du dernier mois complet
    trend_pages.json      les pages du dernier mois complet
    trend.txt             a lire en premier
"""

import json
import subprocess
import sys
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

PROPERTY = 'sc-domain:hydraetl.com'
SCOPE = 'https://www.googleapis.com/auth/webmasters'
SA_URL = 'https://www.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query'

# Le site est en ligne depuis aout 2026 : rien avant n'existe.
START = date(2026, 8, 1)


def ensure(mod, pkg=None):
    try:
        __import__(mod)
    except ImportError:
        pkg = pkg or mod
        print(f"  installation de {pkg} ...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', pkg])


def token(key_path: Path) -> str:
    ensure('google.auth', 'google-auth')
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    creds = service_account.Credentials.from_service_account_file(
        str(key_path), scopes=[SCOPE])
    creds.refresh(Request())
    return creds.token


def post(tok, payload):
    ensure('requests')
    import requests
    url = SA_URL.format(site=PROPERTY.replace(':', '%3A').replace('/', '%2F'))
    r = requests.post(url, headers={'Authorization': f'Bearer {tok}'},
                      json=payload, timeout=60)
    if r.status_code != 200:
        raise RuntimeError(f"{r.status_code} {r.text[:400]}")
    return r.json()


def main():
    repo = Path(__file__).resolve().parents[2]
    key = repo / '.gsc-key.json'
    if not key.exists():
        sys.exit(f"Cle absente : {key}\nVoir l'entete de gsc_audit.py pour la creer.")
    out = Path(__file__).resolve().parent / '_gsc'
    out.mkdir(exist_ok=True)

    tok = token(key)
    # Les donnees GSC ont 2 a 3 jours de retard : on s'arrete a J-3.
    end = date.today() - timedelta(days=3)
    print(f"Fenetre : {START} -> {end}\n")

    # 1. Jour par jour, agrege ensuite par mois.
    daily = post(tok, {
        'startDate': START.isoformat(), 'endDate': end.isoformat(),
        'dimensions': ['date'], 'rowLimit': 1000,
    }).get('rows', [])

    months = defaultdict(lambda: {'clicks': 0, 'impressions': 0, 'pos_w': 0.0})
    for r in daily:
        m = months[r['keys'][0][:7]]
        m['clicks'] += r['clicks']
        m['impressions'] += r['impressions']
        m['pos_w'] += r['position'] * r['impressions']

    monthly = []
    for m in sorted(months):
        v = months[m]
        imp = v['impressions']
        monthly.append({
            'month': m,
            'clicks': round(v['clicks']),
            'impressions': round(imp),
            'ctr': round(100 * v['clicks'] / imp, 2) if imp else 0.0,
            'position': round(v['pos_w'] / imp, 1) if imp else 0.0,
        })
    (out / 'trend_monthly.json').write_text(
        json.dumps(monthly, indent=2), encoding='utf-8')

    # 2. Dernier mois complet : requetes et pages, pour comparer a l'audit 16 mois.
    last_start = (end.replace(day=1) - timedelta(days=1)).replace(day=1)
    last_end = end.replace(day=1) - timedelta(days=1)
    for dim, name in (('query', 'trend_queries'), ('page', 'trend_pages')):
        rows = post(tok, {
            'startDate': last_start.isoformat(), 'endDate': last_end.isoformat(),
            'dimensions': [dim], 'rowLimit': 1000,
        }).get('rows', [])
        (out / f'{name}.json').write_text(
            json.dumps(rows, indent=2), encoding='utf-8')
        print(f"  {name}.json : {len(rows)} lignes ({last_start} -> {last_end})")

    # 3. Resume lisible.
    lines = [f"Tendance Search Console  {START} -> {end}", '']
    lines.append(f"{'mois':<10}{'imp':>7}{'clics':>7}{'CTR':>8}{'pos':>7}")
    for r in monthly:
        lines.append(f"{r['month']:<10}{r['impressions']:>7}{r['clicks']:>7}"
                     f"{r['ctr']:>7}%{r['position']:>7}")
    if len(monthly) >= 2:
        a, b = monthly[-2], monthly[-1]
        d_imp = b['impressions'] - a['impressions']
        pct = (100 * d_imp / a['impressions']) if a['impressions'] else 0
        lines += ['', f"Dernier mois vs precedent : {d_imp:+d} impressions ({pct:+.0f} %)"]
        lines.append("Attention : le dernier mois peut etre incomplet (arret a J-3).")
    txt = '\n'.join(lines)
    (out / 'trend.txt').write_text(txt, encoding='utf-8')
    print('\n' + txt)
    print(f"\nEcrit dans {out}")


if __name__ == '__main__':
    main()

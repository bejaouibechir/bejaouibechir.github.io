#!/usr/bin/env python3
"""
Audit Search Console de hydraetl.com, par l'API.

Ce que l'interface ne donne pas en liste exportable, l'API le donne page par page :
l'etat d'indexation reel de chaque URL du sitemap, la date du dernier crawl,
la canonique retenue par Google, et 16 mois de requetes.

Prerequis chez toi :
  1. API "Google Search Console" activee sur un projet GCP
  2. Un compte de service, sa cle JSON dans <repo>\\.gsc-key.json
  3. Ce compte ajoute dans Search Console (Parametres > Utilisateurs), permission Complet

Lancer (PowerShell, depuis la racine du depot) :
    py tools\\tutorials\\gsc_audit.py

Sorties dans <repo>\\tools\\tutorials\\_gsc\\ :
    inspection.json      etat d'indexation de chaque URL du sitemap
    inspection.csv       la meme chose, lisible dans un tableur
    queries.json         requetes, 16 mois
    pages.json           pages, 16 mois
    sitemaps.json        sitemaps declares et leurs erreurs
    summary.txt          ce qu'il faut lire en premier
"""

import csv
import json
import subprocess
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date, timedelta
from pathlib import Path

PROPERTY = 'sc-domain:hydraetl.com'
SITEMAP = 'https://hydraetl.com/sitemap-index.xml'
SCOPE = 'https://www.googleapis.com/auth/webmasters'
INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'
SA_URL = 'https://www.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query'
SM_URL = 'https://www.googleapis.com/webmasters/v3/sites/{site}/sitemaps'


def ensure(mod, pkg=None):
    try:
        __import__(mod)
    except ImportError:
        pkg = pkg or mod
        print(f"  installation de {pkg} …")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', pkg])


def token(key_path: Path) -> str:
    ensure('google.auth', 'google-auth')
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    creds = service_account.Credentials.from_service_account_file(
        str(key_path), scopes=[SCOPE])
    creds.refresh(Request())
    return creds.token


def post(url, tok, payload):
    import requests
    r = requests.post(url, headers={'Authorization': f'Bearer {tok}'},
                      json=payload, timeout=60)
    if r.status_code != 200:
        raise RuntimeError(f"{r.status_code} {r.text[:400]}")
    return r.json()


def get(url, tok):
    import requests
    r = requests.get(url, headers={'Authorization': f'Bearer {tok}'}, timeout=60)
    if r.status_code != 200:
        raise RuntimeError(f"{r.status_code} {r.text[:400]}")
    return r.json()


def sitemap_urls(entry: str):
    """Lit un sitemap, suit les index, renvoie toutes les URLs."""
    seen, out, todo = set(), [], [entry]
    ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
    while todo:
        u = todo.pop()
        if u in seen:
            continue
        seen.add(u)
        try:
            with urllib.request.urlopen(u, timeout=30) as fh:
                root = ET.fromstring(fh.read())
        except Exception as exc:
            print(f"  ! sitemap illisible {u} : {exc}")
            continue
        tag = root.tag.replace(ns, '')
        if tag == 'sitemapindex':
            todo += [e.text.strip() for e in root.iter(ns + 'loc')]
        else:
            out += [e.text.strip() for e in root.iter(ns + 'loc')]
    return sorted(set(out))


def inspect_all(tok, urls):
    rows = []
    for n, u in enumerate(urls, 1):
        for attempt in (1, 2, 3):
            try:
                res = post(INSPECT_URL, tok, {
                    'inspectionUrl': u, 'siteUrl': PROPERTY, 'languageCode': 'en-US'})
                break
            except RuntimeError as exc:
                if '429' in str(exc) and attempt < 3:
                    time.sleep(5 * attempt)
                    continue
                print(f"  ! {u} : {exc}")
                res = {}
                break
        idx = (res.get('inspectionResult') or {}).get('indexStatusResult') or {}
        rows.append({
            'url': u,
            'verdict': idx.get('verdict', ''),
            'coverageState': idx.get('coverageState', ''),
            'robotsTxtState': idx.get('robotsTxtState', ''),
            'indexingState': idx.get('indexingState', ''),
            'lastCrawlTime': idx.get('lastCrawlTime', ''),
            'pageFetchState': idx.get('pageFetchState', ''),
            'googleCanonical': idx.get('googleCanonical', ''),
            'userCanonical': idx.get('userCanonical', ''),
            'crawledAs': idx.get('crawledAs', ''),
        })
        if n % 20 == 0 or n == len(urls):
            print(f"  inspectees : {n}/{len(urls)}")
        time.sleep(0.12)          # large sous la limite de 600/minute
    return rows


def analytics(tok, dims, rows=25000):
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=480)
    out, offset = [], 0
    while True:
        res = post(SA_URL.format(site=PROPERTY.replace(':', '%3A').replace('/', '%2F')), tok, {
            'startDate': start.isoformat(), 'endDate': end.isoformat(),
            'dimensions': dims, 'rowLimit': 25000, 'startRow': offset,
        })
        got = res.get('rows', [])
        out += got
        if len(got) < 25000 or len(out) >= rows:
            break
        offset += len(got)
    return out


def main():
    repo = Path(__file__).resolve().parent.parent.parent
    key = repo / '.gsc-key.json'
    if not key.is_file():
        sys.exit(f"Cle introuvable : {key}\n"
                 "Depose le fichier JSON du compte de service a cet emplacement.")
    out = repo / 'tools' / 'tutorials' / '_gsc'
    out.mkdir(parents=True, exist_ok=True)

    ensure('requests')
    print("Authentification …")
    tok = token(key)
    print("  ok\n")

    print("Sitemaps declares …")
    try:
        sm = get(SM_URL.format(site=PROPERTY.replace(':', '%3A')), tok)
        (out / 'sitemaps.json').write_text(json.dumps(sm, indent=2), encoding='utf-8')
        for s in sm.get('sitemap', []):
            print(f"  {s.get('path')}  soumis {s.get('lastSubmitted','?')[:10]}  "
                  f"erreurs {s.get('errors','0')}  avertissements {s.get('warnings','0')}")
    except Exception as exc:
        print(f"  ! {exc}")

    print("\nLecture du sitemap …")
    urls = sitemap_urls(SITEMAP)
    print(f"  {len(urls)} URLs")

    print("\nInspection de chaque URL (quelques minutes) …")
    rows = inspect_all(tok, urls)
    (out / 'inspection.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
    with (out / 'inspection.csv').open('w', encoding='utf-8-sig', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)

    print("\nRequetes et pages, 16 mois …")
    for name, dims in (('queries', ['query']), ('pages', ['page']),
                       ('query_page', ['query', 'page'])):
        try:
            data = analytics(tok, dims)
            (out / f'{name}.json').write_text(json.dumps(data, indent=2), encoding='utf-8')
            print(f"  {name}: {len(data)} lignes")
        except Exception as exc:
            print(f"  ! {name}: {exc}")

    from collections import Counter
    cov = Counter(r['coverageState'] for r in rows)
    ver = Counter(r['verdict'] for r in rows)
    lines = [f"URLs du sitemap : {len(rows)}", "", "Verdict :"]
    lines += [f"  {v or '(vide)':38} {n}" for v, n in ver.most_common()]
    lines += ["", "Etat de couverture :"]
    lines += [f"  {c or '(vide)':38} {n}" for c, n in cov.most_common()]
    never = [r['url'] for r in rows if not r['lastCrawlTime']]
    lines += ["", f"Jamais explorees : {len(never)}"] + [f"  {u}" for u in never[:40]]
    diff = [r for r in rows if r['googleCanonical'] and r['userCanonical']
            and r['googleCanonical'] != r['userCanonical']]
    lines += ["", f"Canonique Google differente de la tienne : {len(diff)}"]
    lines += [f"  {r['url']}\n      Google -> {r['googleCanonical']}" for r in diff[:20]]
    (out / 'summary.txt').write_text("\n".join(lines) + "\n", encoding='utf-8')

    print("\n" + "\n".join(lines[:14]))
    print(f"\nEcrit dans : {out}")


if __name__ == '__main__':
    main()

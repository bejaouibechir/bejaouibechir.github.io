#!/usr/bin/env python3
"""
Resoumet les sitemaps a Search Console.

Pourquoi : le sitemap avait ete soumis le 22 septembre, avant les 60+ pages
de novembre. Google ne l'avait pas repris, d'ou 56 URLs qu'il n'a jamais vues.

Lancer :  py tools\\tutorials\\gsc_resubmit.py
"""

import subprocess
import sys
from pathlib import Path

PROPERTY = 'sc-domain:hydraetl.com'
SCOPE = 'https://www.googleapis.com/auth/webmasters'
BASE = 'https://www.googleapis.com/webmasters/v3/sites/{site}/sitemaps'
SITEMAPS = [
    'https://hydraetl.com/sitemap-index.xml',
    'https://hydraetl.com/sitemap-0.xml',
]


def ensure(mod, pkg=None):
    try:
        __import__(mod)
    except ImportError:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', pkg or mod])


def main():
    repo = Path(__file__).resolve().parent.parent.parent
    key = repo / '.gsc-key.json'
    if not key.is_file():
        sys.exit(f"Cle introuvable : {key}")

    ensure('google.auth', 'google-auth')
    ensure('requests')
    import requests
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

    creds = service_account.Credentials.from_service_account_file(str(key), scopes=[SCOPE])
    creds.refresh(Request())
    hdr = {'Authorization': f'Bearer {creds.token}'}
    site = PROPERTY.replace(':', '%3A')

    for sm in SITEMAPS:
        url = BASE.format(site=site) + '/' + requests.utils.quote(sm, safe='')
        r = requests.put(url, headers=hdr, timeout=60)
        print(f"  {'OK  ' if r.status_code in (200, 204) else r.status_code} resoumis  {sm}")
        if r.status_code not in (200, 204):
            print(f"       {r.text[:200]}")

    print("\nEtat apres resoumission :")
    r = requests.get(BASE.format(site=site), headers=hdr, timeout=60)
    for s in r.json().get('sitemap', []):
        print(f"  {s.get('path')}")
        print(f"      soumis {s.get('lastSubmitted','?')[:19]}   "
              f"telecharge {s.get('lastDownloaded','jamais')[:19]}")
        print(f"      erreurs {s.get('errors','0')}   avertissements {s.get('warnings','0')}   "
              f"URLs {sum(int(c.get('submitted',0)) for c in s.get('contents',[]))}")

    print("\nGoogle reprend un sitemap resoumis en quelques heures a quelques jours.")
    print("Relance gsc_audit.py dans 3 a 7 jours pour mesurer l'effet.")


if __name__ == '__main__':
    main()

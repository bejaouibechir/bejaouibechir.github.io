# Verification — GITHUB gh-03-02

Date: 2026-11-09. Local draft; no commit or push.

Tested with published hydra-etl 0.19.1 and the real ProjectRunner. In the normal run, load_referentials succeeded once, load_sales and load_stock succeeded twice in the parallel stage, and build_reports succeeded once. One loop transition and one 200 ms stage delay were recorded; the two parallel workflows started together in both passes.

With runtime sales_delay=1.5 seconds and a one-second thread timeout, both load_sales passes timed out before their second step. Hydra marked them recovered and ran load_sales_backup twice. load_stock and build_reports succeeded, so the whole project completed. The fallback events had trigger=timeout. scripts/demo.py reported PASS for both scenarios and saved ignored local JSON reports in runs/.

No database, Docker service, or external network is required. No Hydra engine files were modified. The example has not been pushed or embedded in the article.

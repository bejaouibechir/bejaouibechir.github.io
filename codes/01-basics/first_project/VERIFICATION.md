# Verification

Verified locally on 2026-10-30 with the published `hydra-etl==0.16.0` package, using Pandas on Windows.

Command: `python scripts/check_example.py`

| Check | Result |
| --- | --- |
| Project dry run completes without producing CSV output | PASS |
| Standalone job produces the four expected rows | PASS |
| Full project produces the four expected rows | PASS |
| Repeated project run produces identical CSV bytes | PASS |
| Production environment produces the two expected rows | PASS |
| Production run preserves the default CSV | PASS |
| Output checker rejects a deliberately incorrect total | PASS |

CSV comparisons cover headers, row order, and every numeric value. Validation runs in a temporary copy; generated files are removed afterwards.

The installed package was loaded from the validation environment's `site-packages`. No Hydra engine source was changed.

The README's local resource links and the example's English text were checked before delivery.

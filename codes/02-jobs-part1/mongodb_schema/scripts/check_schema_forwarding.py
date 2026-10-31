"""Check the executor's configuration boundary without connecting to MongoDB."""
import importlib.metadata
from pathlib import Path
import sys
from unittest.mock import patch

import yaml
from hydra_etl.internal.parser.source import SourceParser
from hydra_etl.internal.runner.executor import JobExecutor

ROOT = Path(__file__).resolve().parents[1]


def inspect_forwarding():
    raw = yaml.safe_load((ROOT / "sources.yaml").read_text(encoding="utf-8"))
    definition = SourceParser().parse(raw).sources["paid_orders"]
    expected = definition.schema.model_dump()
    # Instantiate a normal executor; intercept only connector construction so
    # this probe needs neither a database driver nor a running database.
    executor = JobExecutor(ROOT, root_dir=ROOT)
    with patch("hydra_etl.internal.runner.executor.build_connector",
               side_effect=lambda **kwargs: kwargs["config"]):
        config = executor._build_connector("paid_orders", definition, is_source=True)
    return expected, config


if __name__ == "__main__":
    expected, config = inspect_forwarding()
    print("Hydra version:", importlib.metadata.version("hydra-etl"))
    print("Parsed schema mode:", expected["mode"])
    print("Forwarded configuration keys:", ", ".join(sorted(config)))
    if config.get("schema") != expected:
        sys.exit("BLOCKED: the declared schema is not forwarded intact to the connector.")
    print("PASS: the complete schema reaches connector construction.")

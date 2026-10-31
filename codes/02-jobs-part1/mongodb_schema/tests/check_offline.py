"""Validate the example assets and normalizer in isolation, not a live job."""
import csv
import json
from pathlib import Path
import sys
import tempfile

import yaml
from hydra_etl.internal.parser.source import SourceParser
from hydra_etl.internal.schema import SchemaDescriptor
from hydra_etl.plugins.connectors.mongodb.normalizer import DocumentNormalizer

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from verify_output import COLUMNS, verify


def main():
    raw = yaml.safe_load((ROOT / "sources.yaml").read_text(encoding="utf-8"))
    definition = SourceParser().parse(raw).sources["paid_orders"]
    assert definition.schema.mode == "manual"
    schema = SchemaDescriptor.from_dict(definition.schema.model_dump())
    documents = json.loads((ROOT / "data/orders.json").read_text(encoding="utf-8"))
    assert len(documents) == 4
    assert len({document["_id"] for document in documents}) == 4
    paid = [document for document in documents if document["status"] == "paid"]
    normalizer = DocumentNormalizer(schema)
    rows = sorted(normalizer.normalize_batch(paid), key=lambda row: row["order_id"])
    assert len(rows) == 3
    assert rows[1]["city"] == "London"
    assert all(list(row) == COLUMNS for row in rows)
    assert "internal_note" not in rows[0]
    with tempfile.TemporaryDirectory(prefix="hydra-mongodb-schema-") as directory:
        output = Path(directory) / "paid_orders.csv"
        with output.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=COLUMNS, lineterminator="\n")
            writer.writeheader()
            writer.writerows(rows)
        verify(output)
        original = output.read_text(encoding="utf-8")
        for label, wrong in [
            ("incorrect mapped field", original.replace("Alice", "Incorrect")),
            ("incorrect nested city", original.replace("London", "Incorrect")),
            ("missing order", "\n".join(original.splitlines()[:-1]) + "\n"),
        ]:
            output.write_text(wrong, encoding="utf-8")
            try:
                verify(output)
            except ValueError:
                print("PASS: rejected " + label)
            else:
                raise AssertionError("Accepted " + label)
    print("PASS: isolated schema normalization and output verification.")
    print("This does not prove that hdrctl forwards the schema; run check_schema_forwarding.py.")


if __name__ == "__main__":
    main()

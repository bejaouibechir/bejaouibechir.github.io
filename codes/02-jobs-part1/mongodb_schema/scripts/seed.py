"""Seed only the dedicated Whitebook example collection."""
import json
from pathlib import Path

from pymongo import MongoClient, ReplaceOne
import yaml

ROOT = Path(__file__).resolve().parents[1]


def main():
    source = yaml.safe_load((ROOT / "sources.yaml").read_text(encoding="utf-8"))["sources"]["paid_orders"]
    config = source["connection"]
    collection_name = source["extract"]["collection"]
    if config["database"] != "hydra_whitebook_02" or collection_name != "orders":
        raise ValueError("This seed script only supports hydra_whitebook_02.orders.")
    documents = json.loads((ROOT / "data/orders.json").read_text(encoding="utf-8"))
    identifiers = [document["_id"] for document in documents]
    if len(identifiers) != len(set(identifiers)):
        raise ValueError("Duplicate fixture IDs.")
    with MongoClient(config["uri"]) as client:
        client.admin.command("ping")
        collection = client[config["database"]][collection_name]
        if collection.count_documents({"_id": {"$nin": identifiers}}):
            raise ValueError("The example collection contains other documents; nothing was changed.")
        result = collection.bulk_write([
            ReplaceOne({"_id": document["_id"]}, document, upsert=True)
            for document in documents], ordered=True)
        actual = list(collection.find({}).sort("_id", 1))
        if actual != sorted(documents, key=lambda document: document["_id"]):
            raise ValueError("Seed verification failed.")
        print(f"PASS: {len(actual)} example documents present; {result.upserted_count} inserted.")
        print("Three paid orders will be exported; the pending order is excluded.")


if __name__ == "__main__":
    main()

"""Command-line interface for Xiaomi Health sync."""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

# Add parent directory to sys.path so dsh_health package can be imported
script_dir = Path(__file__).resolve().parent
project_root = script_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from dsh_health.sync import run_sync


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync Xiaomi Health metrics to SQLite")
    parser.add_argument("--db", default="data/health.sqlite", help="SQLite database path")
    parser.add_argument("--token", default="data/token.json", help="Xiaomi token file path")
    parser.add_argument("--days", type=int, default=7, help="Number of past days to sync")
    parser.add_argument("--uid", type=int, default=None, help="Target Xiaomi account UID")
    parser.add_argument(
        "--family-mode",
        action="store_true",
        help="Use family-account shared endpoints (/app/v1/relatives/*)",
    )
    parser.add_argument("--base-url", default=None, help="Custom API base URL")
    parser.add_argument("--json", action="store_true", help="Output pure JSON result")

    args = parser.parse_args()

    result = asyncio.run(
        run_sync(
            db_path=args.db,
            token_path=args.token,
            days=args.days,
            target_uid=args.uid,
            base_url=args.base_url,
            family_mode=args.family_mode,
        )
    )

    if args.json:
        print(json.dumps(result, ensure_ascii=False))
    else:
        if result.get("ok"):
            counters = result.get("counters", {})
            print(f"Sync successful! Wrote {counters.get('days_written', 0)} days.")
            print(f"Details: {counters}")
        else:
            print(f"Sync failed: {result.get('error')}", file=sys.stderr)

    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    sys.exit(main())

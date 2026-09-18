"""Command-line utility for QR login to Xiaomi Account."""
from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

script_dir = Path(__file__).resolve().parent
project_root = script_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from dsh_health.auth_helper import run_qr_login


async def main_async(data_dir: Path, token_out: str) -> int:
    async def on_qr(qr_url: str, login_url: str, b64: str) -> None:
        print("\n" + "=" * 60)
        print("Please scan the QR code using Xiaomi Health (Mi Fitness) app:")
        print(f"QR Image URL: {qr_url}")
        print(f"Browser Login Link: {login_url}")
        print(f"QR image file saved to: {data_dir / 'qr_login.png'}")
        print("=" * 60 + "\n")

    res = await run_qr_login(data_dir, token_filename=token_out, on_qr_ready=on_qr)
    if res.get("ok"):
        print(f"Login successful! Xiaomi UID: {res.get('user_id')}")
        print(f"Token saved to: {res.get('token_path')}")
        return 0
    else:
        print(f"Login failed: {res.get('error')}", file=sys.stderr)
        return 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Xiaomi Account QR Login")
    parser.add_argument("--data-dir", default="data", help="Output directory for tokens and QR")
    parser.add_argument("--token-out", default="token.json", help="Token filename")
    args = parser.parse_args()

    return asyncio.run(main_async(Path(args.data_dir), args.token_out))


if __name__ == "__main__":
    sys.exit(main())

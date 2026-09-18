"""Xiaomi Account QR code login helper."""
from __future__ import annotations

import asyncio
import base64
import json
from pathlib import Path
from typing import Callable, Coroutine, Any

import httpx


async def download_qr_image(url: str, out_path: Path) -> bytes:
    async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
        r = await client.get(url)
        r.raise_for_status()
        out_path.write_bytes(r.content)
        return r.content


async def run_qr_login(
    data_dir: Path | str,
    token_filename: str = "token.json",
    on_qr_ready: Callable[[str, str, str], Coroutine[Any, Any, None]] | None = None,
) -> dict[str, Any]:
    data_dir = Path(data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    qr_png = data_dir / "qr_login.png"
    token_path = data_dir / token_filename

    try:
        from mi_fitness.auth import XiaomiAuth
    except ImportError:
        return {"ok": False, "error": "mi-fitness library is not installed"}

    async def _on_qr(qr_image_url: str, login_url: str) -> None:
        b64 = ""
        try:
            img_bytes = await download_qr_image(qr_image_url, qr_png)
            b64 = f"data:image/png;base64,{base64.b64encode(img_bytes).decode('ascii')}"
        except Exception:
            pass

        if on_qr_ready:
            await on_qr_ready(qr_image_url, login_url, b64)

    try:
        async with XiaomiAuth() as auth:
            await auth.login_qr(qr_callback=_on_qr)
            auth.save_token(str(token_path))
            return {
                "ok": True,
                "user_id": str(auth.token.user_id),
                "token_path": str(token_path),
            }
    except Exception as exc:
        return {"ok": False, "error": f"{type(exc).__name__}: {exc}"}

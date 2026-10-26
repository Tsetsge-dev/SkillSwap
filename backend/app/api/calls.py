import base64
import hashlib
import hmac
import time

from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.core.config import settings
from app.models import User


router = APIRouter(prefix="/calls", tags=["Calls"])


@router.get("/ice-servers")
def get_ice_servers(current_user: User = Depends(get_current_user)):
    """Return public STUN and short-lived TURN credentials; never expose the shared secret."""
    servers = [{"urls": ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]
    turn_urls = [value.strip() for value in settings.TURN_URLS.split(",") if value.strip()]
    if not turn_urls:
        return {"ice_servers": servers, "turn_enabled": False}
    if len(settings.TURN_SHARED_SECRET) < 32:
        raise HTTPException(status_code=503, detail="TURN тохиргоо дутуу байна.")

    ttl = min(max(settings.TURN_CREDENTIAL_TTL_SECONDS, 300), 86400)
    username = f"{int(time.time()) + ttl}:{current_user.id}"
    credential = base64.b64encode(
        hmac.new(settings.TURN_SHARED_SECRET.encode("utf-8"), username.encode("utf-8"), hashlib.sha1).digest()
    ).decode("ascii")
    servers.append({"urls": turn_urls, "username": username, "credential": credential})
    return {"ice_servers": servers, "turn_enabled": True}

import json
from typing import Dict, List, Set, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.models import Message, User

router = APIRouter(tags=["WebSockets"])

class ConnectionManager:
    def __init__(self):
        # Map user_id -> set of active WebSockets
        self.active_connections: Dict[int, Set[WebSocket]] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        await self.broadcast_user_status(user_id, is_online=True)

    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    def is_online(self, user_id: int) -> bool:
        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            for connection in list(self.active_connections[user_id]):
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    pass

    async def broadcast_user_status(self, user_id: int, is_online: bool):
        # Notify all connections that user status changed
        status_msg = {
            "type": "presence_update",
            "user_id": user_id,
            "is_online": is_online
        }
        for uid, conns in list(self.active_connections.items()):
            if uid != user_id:
                for conn in list(conns):
                    try:
                        await conn.send_text(json.dumps(status_msg))
                    except Exception:
                        pass

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    # Browser WebSocket cannot set Authorization headers, so verify its query token.
    token = websocket.query_params.get("token")
    token_sub = decode_access_token(token) if token else None
    try:
        authenticated_id = int(token_sub) if token_sub is not None else None
    except (TypeError, ValueError):
        authenticated_id = None
    if authenticated_id != user_id:
        await websocket.close(code=4401)
        return

    auth_db = SessionLocal()
    try:
        account = auth_db.query(User.id).filter(User.id == user_id, User.is_active == True).first()
    finally:
        auth_db.close()
    if account is None:
        await websocket.close(code=4403)
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                data = json.loads(data_text)
            except Exception:
                continue

            event_type = data.get("type")
            raw_target_id = data.get("target_id") or data.get("receiver_id")
            try:
                target_id = int(raw_target_id) if raw_target_id is not None else None
            except (TypeError, ValueError):
                continue
            if target_id == user_id:
                continue

            # 1. Direct Chat Message
            if event_type == "chat_message":
                try:
                    receiver_id = int(data.get("receiver_id"))
                except (TypeError, ValueError):
                    continue
                message_db = SessionLocal()
                try:
                    recipient_exists = message_db.query(User.id).filter(
                        User.id == receiver_id, User.is_active == True
                    ).first()
                finally:
                    message_db.close()
                if recipient_exists is None:
                    continue
                content = data.get("content")
                msg_type = data.get("msg_type", "text")
                file_url = data.get("file_url")
                file_name = data.get("file_name")
                file_size = data.get("file_size")
                audio_duration = data.get("audio_duration")

                # Save message to DB
                db = SessionLocal()
                try:
                    db_msg = Message(
                        sender_id=user_id,
                        receiver_id=receiver_id,
                        content=content,
                        msg_type=msg_type,
                        file_url=file_url,
                        file_name=file_name,
                        file_size=file_size,
                        audio_duration=audio_duration
                    )
                    db.add(db_msg)
                    db.commit()
                    db.refresh(db_msg)

                    out_payload = {
                        "type": "new_message",
                        "message": {
                            "id": db_msg.id,
                            "sender_id": db_msg.sender_id,
                            "receiver_id": db_msg.receiver_id,
                            "content": db_msg.content,
                            "msg_type": db_msg.msg_type,
                            "file_url": db_msg.file_url,
                            "file_name": db_msg.file_name,
                            "file_size": db_msg.file_size,
                            "audio_duration": db_msg.audio_duration,
                            "is_read": db_msg.is_read,
                            "created_at": db_msg.created_at.isoformat()
                        }
                    }

                    # Send to receiver and sender confirmation
                    await manager.send_personal_message(out_payload, receiver_id)
                    await manager.send_personal_message(out_payload, user_id)
                finally:
                    db.close()

            # 2. Typing Indicators
            elif event_type in ["typing_start", "typing_stop"]:
                if target_id:
                    await manager.send_personal_message({
                        "type": event_type,
                        "sender_id": user_id
                    }, int(target_id))

            # 3. WebRTC Signaling Events
            elif event_type in [
                "call-request",
                "call-accept",
                "call-reject",
                "call-offer",
                "call-answer",
                "ice-candidate",
                "call-end"
            ]:
                if target_id:
                    signal_db = SessionLocal()
                    try:
                        recipient_exists = signal_db.query(User.id).filter(
                            User.id == target_id, User.is_active == True
                        ).first()
                    finally:
                        signal_db.close()
                    if recipient_exists is None:
                        continue
                    forward_payload = {
                        **data,
                        "sender_id": user_id
                    }
                    await manager.send_personal_message(forward_payload, int(target_id))

            # 4. Check Presence
            elif event_type == "check_presence":
                check_user_id = int(data.get("check_user_id", 0))
                is_on = manager.is_online(check_user_id)
                await manager.send_personal_message({
                    "type": "presence_response",
                    "user_id": check_user_id,
                    "is_online": is_on
                }, user_id)

    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
        if not manager.is_online(user_id):
            await manager.broadcast_user_status(user_id, is_online=False)
    except Exception:
        manager.disconnect(user_id, websocket)

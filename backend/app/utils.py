from passlib.context import CryptContext

from backend.app.core.log_config import init_loggers

loggerIH = init_loggers(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str,
                    hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def clean_update_trajets_payload(payload: dict) -> dict:
    del payload["id"]
    copied = payload.copy()
    for key, value in copied.items():
        if not value:
            del payload[key]
    return payload

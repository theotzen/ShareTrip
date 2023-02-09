import base64
from typing import List

from bson.objectid import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel

from backend.app.core.log_config import init_loggers
from backend.app.serializers.user_serializers import userEntity
from .config import settings
from .database import User

loggerIH = init_loggers(__name__)


class Settings(BaseModel):
    authjwt_algorithm: str = settings.JWT_ALGORITHM
    authjwt_decode_algorithms: List[str] = [settings.JWT_ALGORITHM]
    authjwt_token_location: set = {"cookies", "headers"}
    authjwt_access_cookie_key: str = "access_token"
    authjwt_refresh_cookie_key: str = "refresh_token"
    authjwt_cookie_csrf_protect: bool = False
    authjwt_public_key: str = base64.b64decode(
        settings.JWT_PUBLIC_KEY).decode("utf-8")
    authjwt_private_key: str = base64.b64decode(
        settings.JWT_PRIVATE_KEY).decode("utf-8")


@AuthJWT.load_config
def get_config():
    return Settings()


class UserNotFound(Exception):
    pass


# dependencies for private secure routes
def require_user(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        user_id = Authorize.get_jwt_subject()
        user = userEntity(User.find_one({"_id": ObjectId(str(user_id))}))

        if not user:
            loggerIH.error("User no longer exist")
            raise UserNotFound("User no longer exist")

    except Exception as e:
        error = e.__class__.__name__
        loggerIH.exception(error)
        if error == "MissingTokenError":
            loggerIH.exception("MissingTokenError")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="You are not logged in")
        if error == "UserNotFound":
            loggerIH.exception("UserNotFound")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="User no longer exist")

        loggerIH.exception(f"Token is invalid or has expired, {error}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token is invalid or has expired")
    return user_id

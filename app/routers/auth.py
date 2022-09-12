from datetime import datetime, timedelta
from bson.objectid import ObjectId
from fastapi import APIRouter, Response, status, Depends, HTTPException

from app import oauth2
from app.database import User
from app.serializers.userSerializers import userEntity, userResponseEntity
from .. import schemas, utils
from app.oauth2 import AuthJWT
from ..config import settings
from app.core.log_config import init_loggers

loggerIH = init_loggers(__name__)

router = APIRouter()
ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
async def create_user(payload: schemas.CreateUserSchema):
    user = User.find_one({"email": payload.email.lower()})
    if user:
        loggerIH.error(f"{status.HTTP_409_CONFLICT} | Account already exist with this email")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Account already exist")

    if payload.password != payload.passwordConfirm:
        loggerIH.error(f"{status.HTTP_400_BAD_REQUEST} | Passwords not matching")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Passwords not matching")

    payload.password = utils.hash_password(payload.password)
    del payload.passwordConfirm
    payload.role = "user"
    payload.email = payload.email.lower()
    payload.created_at = datetime.now()
    payload.updated_at = payload.created_at
    result = User.insert_one(payload.dict())
    new_user = userResponseEntity(User.find_one({"_id": result.inserted_id}))
    return {"status": "success", "user": new_user}


@router.post("/login", status_code=status.HTTP_200_OK)
def login(payload: schemas.LoginUserSchema, response: Response, Authorize: AuthJWT = Depends()):
    user = User.find_one({"email": payload.email})
    if not user:
        loggerIH.error(f"{status.HTTP_400_BAD_REQUEST} | Wrong email or password - user not found")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Wrong email or password")

    if not utils.verify_password(payload.password, user["password"]):
        loggerIH.error(f"{status.HTTP_400_BAD_REQUEST} | Wrong email or password - passwords not matching")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Wrong email or password")

    access_token = Authorize.create_access_token(
        subject=str(user["_id"]), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN)
    )

    refresh_token = Authorize.create_refresh_token(
        subject=str(user["_id"]), expires_time=timedelta(minutes=REFRESH_TOKEN_EXPIRES_IN)
    )

    response.set_cookie("access_token", access_token, max_age=ACCESS_TOKEN_EXPIRES_IN * 60,
                        expires=ACCESS_TOKEN_EXPIRES_IN * 60, path="/", domain=None, secure=False, httponly=True,
                        samesite="lax")
    response.set_cookie("refresh_token", refresh_token,
                        REFRESH_TOKEN_EXPIRES_IN * 60, REFRESH_TOKEN_EXPIRES_IN * 60, "/", None, False, True, "lax")
    response.set_cookie("logged_in", "True", ACCESS_TOKEN_EXPIRES_IN * 60,
                        ACCESS_TOKEN_EXPIRES_IN * 60, "/", None, False, False, "lax")

    return {"status": "success", "access_token": access_token}


@router.get("/refresh", status_code=status.HTTP_200_OK)
def refresh_token(response: Response, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_refresh_token_required()

        user_id = Authorize.get_jwt_subject()
        if not user_id:
            loggerIH.error(f"{status.HTTP_401_UNAUTHORIZED} | Could not refresh access token")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Could not refresh access token")
        user = userEntity(User.find_one({"_id": ObjectId(str(user_id))}))
        if not user:
            loggerIH.error(f"{status.HTTP_401_UNAUTHORIZED} | The user belonging to this token no logger exist")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="The user belonging to this token no logger exist")
        access_token = Authorize.create_access_token(
            subject=str(user["id"]), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN))

    except Exception as e:
        error = e.__class__.__name__
        if error == "MissingTokenError":
            loggerIH.exception(f"{status.HTTP_400_BAD_REQUEST} | No refresh token")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Please provide refresh token")
        loggerIH.exception(f"{status.HTTP_400_BAD_REQUEST}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=error)

    response.set_cookie("access_token", access_token, ACCESS_TOKEN_EXPIRES_IN * 60,
                        ACCESS_TOKEN_EXPIRES_IN * 60, "/", None, False, True, "lax")
    response.set_cookie("logged_in", "True", ACCESS_TOKEN_EXPIRES_IN * 60,
                        ACCESS_TOKEN_EXPIRES_IN * 60, "/", None, False, False, "lax")

    return {"access_token": access_token}


@router.get("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response, Authorize: AuthJWT = Depends(), user_id: str = Depends(oauth2.require_user)):
    Authorize.unset_jwt_cookies()
    response.set_cookie("logged_in", "", -1)

    return {"status": "success"}


@router.get("/logger", status_code=status.HTTP_200_OK)
def allo_logger():
    loggerIH.error(f"{status.HTTP_400_BAD_REQUEST} | Problem")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Problem")
    return {"message": "allo logger"}


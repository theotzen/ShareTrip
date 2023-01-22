from typing import List

from fastapi import APIRouter, Depends, status
from bson.objectid import ObjectId
from app.serializers.user_serializers import userResponseEntity

from app.database import User
from .. import oauth2
from ..schemas import schemas_users
from app.core.log_config import init_loggers

loggerIH = init_loggers(__name__)

router = APIRouter()


@router.get(path='/me',
            status_code=status.HTTP_200_OK,
            response_model=schemas_users.UserResponse)
def get_me(user_id: str = Depends(oauth2.require_user)):
    user = userResponseEntity(User.find_one({'_id': ObjectId(str(user_id))}))
    return {"user": user}

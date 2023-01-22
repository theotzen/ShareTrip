from datetime import timedelta, datetime
from typing import List

from bson.objectid import ObjectId
from fastapi import APIRouter, Response, status, Depends, HTTPException

from app import oauth2
from app.database import User, Trajet
from .. import utils
from app.oauth2 import require_user
from ..config import settings
from app.core.log_config import init_loggers
from ..schemas import schemas_trajets
from ..serializers.trajet_serializers import trajetResponseListEntity, trajetResponseEntity

loggerIH = init_loggers(__name__)

router = APIRouter()


@router.get(path='/getAllTrajets',
            status_code=status.HTTP_200_OK,
            response_model=List[schemas_trajets.TrajetResponseSchema])
def get_all_trajets(user_id: str = Depends(oauth2.require_user)):
    trajets = trajetResponseListEntity(Trajet.find())
    loggerIH.warn(trajets)
    return trajets


@router.get(path='/getAllTrajetsForCurrentUser',
            status_code=status.HTTP_200_OK,
            response_model=List[schemas_trajets.TrajetResponseSchema])
def get_all_trajets_for_current_user(user_id: str = Depends(oauth2.require_user)):
    trajets = trajetResponseListEntity(Trajet.find({"user_id": user_id}))
    return trajets


@router.get(path='/getLatestTrajetsForCurrentUser',
            status_code=status.HTTP_200_OK,
            response_model=schemas_trajets.TrajetResponse)
def get_latest_trajets_for_current_user(user_id: str = Depends(oauth2.require_user)):
    trajet = Trajet.find_one({
        "user_id": user_id,
        "created_at": {"$gte": datetime.utcnow() - timedelta(minutes=30)}
    })
    trajet = trajetResponseEntity(trajet)
    return {"trajet": trajet}


@router.get(path='/getAllTrajetsCurrentUserIsRegisteredIn',
            status_code=status.HTTP_200_OK,
            response_model=List[schemas_trajets.TrajetResponseSchema])
def get_all_trajets_for_current_user_registered(user_id: str = Depends(oauth2.require_user)):
    trajets = Trajet.find({
        "users_registered": user_id,
    })
    trajets = trajetResponseListEntity(trajets)
    return trajets


@router.post(path="/createTrajet",
             status_code=status.HTTP_201_CREATED,
             response_model=schemas_trajets.TrajetResponse)
async def create_trajet(payload: schemas_trajets.CreateTrajetSchema, user_id: str = Depends(require_user)):
    # Get possible registered-in-thirty-minutes trip for current user and raise
    trajet = Trajet.find_one({
        "user_id": user_id,
        "created_at": {"$gte": datetime.utcnow() - timedelta(minutes=30)}
    })
    if trajet:
        loggerIH.warn(trajetResponseEntity(trajet))
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | A trip has already been registered in the last 30 "
                       f"minutes")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="A trip has already been registered in the last 30 minutes")

    payload.user_id = user_id
    payload.users_registered = [user_id]
    payload.updated_at = payload.created_at
    result = Trajet.insert_one(payload.dict())
    new_trajet = trajetResponseEntity(Trajet.find_one({"_id": result.inserted_id}))
    return {"trajet": new_trajet}

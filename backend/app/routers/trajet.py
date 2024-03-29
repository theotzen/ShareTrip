from datetime import timedelta, datetime
from typing import List

from app.core.log_config import init_loggers
from app.database import Trajet
from app.oauth2 import require_user
from bson.objectid import ObjectId
from fastapi import APIRouter, status, Depends, HTTPException

from ..schemas import schemas_trajets
from ..serializers.trajet_serializers import trajetResponseListEntity, trajetResponseEntity
from ..utils import clean_update_trajets_payload

loggerIH = init_loggers(__name__)

router = APIRouter()


@router.get(path='/getAllTrajets',
            status_code=status.HTTP_200_OK,
            response_model=List[schemas_trajets.TrajetResponseSchema])
async def get_all_trajets(user_id: str = Depends(require_user)):
    trajets = Trajet.find()
    loggerIH.info(trajets)
    if not trajets:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    return trajetResponseListEntity(trajets)


@router.get(path='/getAllTrajetsForCurrentUser',
            status_code=status.HTTP_200_OK,
            response_model=List[schemas_trajets.TrajetResponseSchema])
async def get_all_trajets_for_current_user(user_id: str = Depends(require_user)):
    trajets = Trajet.find({"user_id": user_id})
    if not trajets:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")
    return trajetResponseListEntity(trajets)


@router.get(path='/getLatestTrajetForCurrentUser',
            status_code=status.HTTP_200_OK,
            response_model=schemas_trajets.TrajetResponse)
async def get_latest_trajet_for_current_user(user_id: str = Depends(require_user)):
    trajet = Trajet.find_one({
        "user_id": user_id,
        "created_at": {"$gte": datetime.utcnow() - timedelta(minutes=30)}
    })
    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")
    return {"trajet": trajetResponseEntity(trajet)}


@router.get(path='/getAllTrajetsCurrentUserIsRegisteredIn',
            status_code=status.HTTP_200_OK,
            response_model=List[schemas_trajets.TrajetResponseSchema])
async def get_all_trajets_for_current_user_registered(user_id: str = Depends(require_user)):
    trajets = Trajet.find({
        "users_registered": user_id,
    })
    if not trajets:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")
    return trajetResponseListEntity(trajets)


@router.get(path="/getTrajet/{trajet_id}",
            status_code=status.HTTP_201_CREATED,
            response_model=schemas_trajets.TrajetResponse)
async def get_trajet(trajet_id: str,
                     user_id: str = Depends(require_user)):
    loggerIH.info(trajet_id)
    trajet = Trajet.find_one({"_id": ObjectId(trajet_id)})

    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    return {"trajet": trajetResponseEntity(trajet)}


@router.post(path="/createTrajet",
             status_code=status.HTTP_201_CREATED,
             response_model=schemas_trajets.TrajetResponse)
async def create_trajet(payload: schemas_trajets.CreateTrajetSchema,
                        user_id: str = Depends(require_user)):
    # Get possible registered-in-thirty-minutes trip for current user and raise
    trajet = Trajet.find_one({
        "user_id": user_id,
        "created_at": {"$gte": datetime.utcnow() - timedelta(minutes=30)}
    })
    if trajet:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | A trip has already been registered in the last 30 "
                       f"minutes.")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail=f"A trip has already been registered in the last 30 "
                                   f"minutes.")

    if not payload.departure_time > datetime.utcnow():
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Only future trips are allowed")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Only future trips are allowed")

    if payload.departure_time - timedelta(hours=12) > datetime.utcnow():
        loggerIH.error(f"{status.HTTP_425_TOO_EARLY} | Trip registration is too early")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trip registration too early")

    payload.user_id = user_id
    payload.users_registered = [user_id]
    payload.updated_at = payload.created_at
    result = Trajet.insert_one(payload.dict())
    new_trajet = trajetResponseEntity(Trajet.find_one({"_id": result.inserted_id}))
    return {"trajet": new_trajet}


@router.put(path="/updateTrajet",
            status_code=status.HTTP_200_OK)
async def update_trajet(payload: schemas_trajets.TrajetUpdateSchema,
                        user_id: str = Depends(require_user)):
    trajet = Trajet.find_one({"_id": ObjectId(payload.id)})
    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    if datetime.utcnow() - timedelta(hours=12) > trajet["created_at"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Trip too old")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trip too old")

    if datetime.utcnow() - timedelta(minutes=30) > trajet["departure_time"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Departure date is passed")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Departure date is passed")

    result = Trajet.update_one(
        {
            "_id": ObjectId(payload.id)
        },
        {
            "$set": clean_update_trajets_payload(payload.dict())
        }
    )
    if not result.acknowledged:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Transaction not acknowledged")
    return {"modified_count": result.modified_count}


@router.delete(path="/deleteTrajet/{trajet_id}",
               status_code=status.HTTP_200_OK)
async def delete_trajet(trajet_id: str,
                        user_id: str = Depends(require_user)):
    trajet = Trajet.find_one({"_id": ObjectId(trajet_id)})
    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    if datetime.utcnow() - timedelta(hours=12) > trajet["created_at"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Trip too old")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trip too old")

    if datetime.utcnow() - timedelta(minutes=30) > trajet["departure_time"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Departure date is passed")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Departure date is passed")

    result = Trajet.delete_one(
        {
            "_id": ObjectId(trajet_id)
        }
    )
    if not result.acknowledged:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Transaction not acknowledged")
    return {"deleted_count": result.deleted_count}


@router.put(path="/joinTrajet",
            status_code=status.HTTP_200_OK)
async def join_trajet(payload: schemas_trajets.JoinTrajetSchema,
                      user_id: str = Depends(require_user)):
    trajet = Trajet.find_one({"_id": ObjectId(payload.id)})
    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    if datetime.utcnow() - timedelta(hours=12) > trajet["created_at"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Trip too old")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trip too old")

    if datetime.utcnow() - timedelta(minutes=30) > trajet["departure_time"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Departure date is passed")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Departure date is passed")

    trajet = trajetResponseEntity(trajet)

    already_taken_seats_not_counting_creator = len(trajet['users_registered']) - 1

    seats_left = trajet['seats_available'] - already_taken_seats_not_counting_creator

    if seats_left < 0:
        loggerIH.error(f"{status.HTTP_500_INTERNAL_SERVER_ERROR} | Too many users registered")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Too many users registered")

    if seats_left == 0:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Trajet is full")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trajet is full")

    if (seats_left > 0) and \
            (seats_left < payload.number_seats):
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Not enough seats available")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Not enough seats available")

    if user_id in trajet['users_registered']:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | User already registered in trajet")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="User already registered in trajet")

    to_add_to_user_registered = [f"{user_id}_{i}" if i != 0 else user_id for i in range(payload.number_seats)]

    result = Trajet.update_one(
        {
            "_id": ObjectId(payload.id)
        },
        {
            "$push": {"users_registered": {"$each": to_add_to_user_registered}}
        }
    )
    if not result.acknowledged:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Transaction not acknowledged")
    return {"modified_count": result.modified_count}


@router.put(path="/removeUserFromTrajet",
            status_code=status.HTTP_200_OK)
async def remove_user_from_trajet(payload: schemas_trajets.RemoveUserFromTrajetSchema,
                                  auth: str = Depends(require_user)):
    trajet = Trajet.find_one({"_id": ObjectId(payload.id)})
    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    if datetime.utcnow() - timedelta(hours=12) > trajet["created_at"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Trip too old")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trip too old")

    if datetime.utcnow() - timedelta(minutes=30) > trajet["departure_time"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Departure date is passed")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Departure date is passed")

    trajet = trajetResponseEntity(trajet)

    if payload.user_id not in trajet['users_registered']:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | User not registered in trajet")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="User not registered in trajet")

    if payload.user_id == trajet['user_id']:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | You can't unregister if you created the trajet")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="You can't unregister if you created the trajet")

    # Need to unregister all related seats taken {user_id}_1
    to_remove_users = [usid for usid in trajet['users_registered'] if payload.user_id in usid]

    result = Trajet.update_one(
        {
            "_id": ObjectId(payload.id)
        },
        {
            "$pull": {"users_registered": {"$in": to_remove_users}}
        }
    )
    if not result.acknowledged:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Transaction not acknowledged")
    return {"modified_count": result.modified_count}


@router.put(path="/removeUsersFromTrajet",
            status_code=status.HTTP_200_OK)
async def remove_users_from_trajet(payload: schemas_trajets.RemoveUsersFromTrajetSchema,
                                   auth: str = Depends(require_user)):
    trajet = Trajet.find_one({"_id": ObjectId(payload.id)})
    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    if datetime.utcnow() - timedelta(hours=12) > trajet["created_at"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Trip too old")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trip too old")

    if datetime.utcnow() - timedelta(minutes=30) > trajet["departure_time"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Departure date is passed")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Departure date is passed")

    trajet = trajetResponseEntity(trajet)

    # if any user_id is not in the registered ids, raise
    if any(usid not in trajet['users_registered'] for usid in payload.user_ids):
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | At least a user not registered in trajet")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="At least a user not registered in trajet")

    # if creator id is in user_ids, raise
    if not all(usid != trajet['user_id'] for usid in payload.user_ids):
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Can't unregister the creator")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Can't unregister the creator")

    result = Trajet.update_one(
        {
            "_id": ObjectId(payload.id)
        },
        {
            "$pull": {"users_registered": {"$in": payload.user_ids}}
        }
    )
    if not result.acknowledged:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Transaction not acknowledged")
    return {"modified_count": result.modified_count}


@router.put(path="/removeMeFromTrajet",
            status_code=status.HTTP_200_OK)
async def remove_me_from_trajet(payload: schemas_trajets.RemoveAuthenticatedUserFromTrajetSchema,
                                user_id: str = Depends(require_user)):
    trajet = Trajet.find_one({"_id": ObjectId(payload.id)})
    if not trajet:
        loggerIH.error(f"{status.HTTP_404_NOT_FOUND} | No such trip has been found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No such trip has been found")

    if datetime.utcnow() - timedelta(hours=12) > trajet["created_at"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Trip too old")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Trip too old")

    if datetime.utcnow() - timedelta(minutes=30) > trajet["departure_time"]:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | Departure date is passed")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="Departure date is passed")

    trajet = trajetResponseEntity(trajet)

    if user_id not in trajet['users_registered']:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | User not registered in trajet")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="User not registered in trajet")

    if user_id == trajet['user_id']:
        loggerIH.error(f"{status.HTTP_405_METHOD_NOT_ALLOWED} | You can't unregister if you created the trajet")
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                            detail="You can't unregister if you created the trajet")

    # Need to unregister all related seats taken like {user_id}_1
    to_remove_users = [usid for usid in trajet['users_registered'] if user_id in usid]

    result = Trajet.update_one(
        {
            "_id": ObjectId(payload.id)
        },
        {
            "$pull": {"users_registered": {"$in": to_remove_users}}
        }
    )
    if not result.acknowledged:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Transaction not acknowledged")
    return {"modified_count": result.modified_count}

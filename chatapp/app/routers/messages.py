from app.core.log_config import init_loggers
from app.database import Message
from fastapi import APIRouter, Depends, status

loggerIH = init_loggers(__name__)

router = APIRouter()


@router.get(path='/message',
            status_code=status.HTTP_200_OK)
def get_message():
    return {"allo": "bonjour"}

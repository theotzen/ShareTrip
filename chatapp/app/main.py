from app.config import settings
from app.core.log_config import init_loggers
from app.routers import messages
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

loggerIH = init_loggers(__name__)

app = FastAPI()

origins = [
    settings.CLIENT_ORIGIN,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(messages.router, tags=['Chatapp'], prefix='/chatapp')


@app.get("/chatapp/healthchecker")
def root():
    loggerIH.info("Healthchecker good")
    return {"message": "Sharetrip messages service!"}

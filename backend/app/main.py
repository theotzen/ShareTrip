from app.config import settings
from app.core.log_config import init_loggers
from app.routers import auth, user, trajet
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

app.include_router(auth.router, tags=['Auth'], prefix='/api/auth')
app.include_router(user.router, tags=['Users'], prefix='/api/users')
app.include_router(trajet.router, tags=['Trajets'], prefix='/api/trajets')


@app.get("/api/healthchecker")
def root():
    loggerIH.info("Healthchecker good")
    return {"message": "Connected to MongoDB with Beanie ODM"}

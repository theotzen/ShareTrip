from pydantic import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL_CHATAPP: str
    MONGO_INITDB_DATABASE_CHATAPP: str
    CLIENT_ORIGIN: str

    class Config:
        env_file = './.env'


settings = Settings()


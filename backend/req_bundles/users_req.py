"""
@theotzenRequestBundleGenerator
This file is autogenerated from FastAPI routers
"""

import os

import httpx
from app.core.log_config import init_loggers
from dotenv import load_dotenv
from fastapi import HTTPException

loggerIH = init_loggers(__name__)

load_dotenv()

base_url = os.getenv(__name__)

client = httpx.AsyncClient()


async def get_me(cookies: dict = None,
                 base_url: str = base_url,
                 endpoint: str = '/api/users/me'):
    try:
        res = await client.get(url=base_url + endpoint, cookies=cookies)
        if res.status_code >= 300:
            raise HTTPException(status_code=res.status_code, detail=res.json()['detail'])
    except httpx.HTTPError as err:
        raise SystemExit(err)
    return res.json()

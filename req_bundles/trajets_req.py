"""
@theotzenRequestBundleGenerator
This file is autogenerated from FastAPI routers
"""

import httpx
import os
from dotenv import load_dotenv
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from app.core.log_config import init_loggers

loggerIH = init_loggers(__name__)

load_dotenv()

base_url = os.getenv(__name__)

client = httpx.AsyncClient()


async def get_all_trajets(cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/getAllTrajets'):
	try: 
		res = await client.get(url=base_url+endpoint, cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()


async def get_all_trajets_for_current_user(cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/getAllTrajetsForCurrentUser'):
	try: 
		res = await client.get(url=base_url+endpoint, cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()


async def get_latest_trajet_for_current_user(cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/getLatestTrajetForCurrentUser'):
	try: 
		res = await client.get(url=base_url+endpoint, cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()


async def get_all_trajets_for_current_user_registered(cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/getAllTrajetsCurrentUserIsRegisteredIn'):
	try: 
		res = await client.get(url=base_url+endpoint, cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()


async def get_trajet(trajet_id: str, cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/getTrajet/'):
	try: 
		res = await client.get(url=base_url+endpoint+trajet_id, cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()


async def create_trajet(data: dict, cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/createTrajet'):
	try: 
		res = await client.post(url=base_url+endpoint, json=jsonable_encoder(data), cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()


async def update_trajet(data: dict, cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/updateTrajet'):
	try: 
		res = await client.put(url=base_url+endpoint, json=jsonable_encoder(data), cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()


async def delete_trajet(trajet_id: str, cookies: dict = None, base_url: str = base_url, endpoint: str = '/api/trajets/deleteTrajet/'):
	try: 
		res = await client.delete(url=base_url+endpoint+trajet_id, cookies=cookies)
		if res.status_code >= 300:
			raise HTTPException(status_code=res.status_code, detail=res.json()['detail']) 
	except httpx.HTTPError as err: 
		raise SystemExit(err)
	return res.json()
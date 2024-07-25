
import json
import requests
import redis
import logging
import asyncio
import aiohttp
from django.conf import settings
import time
from .models import Location

# logging for caching testing
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

# Caching set using redis
def cache_request(key, data, ttl=600):
    """Cache the data in Redis with a time-to-live (ttl) in seconds."""
    redis_client.setex(key, ttl, json.dumps(data))

# Caching getter
def get_cached_request(key):
    logger.debug(f"Checking cache for key: {key}")
    cached_data = redis_client.get(key)
    if cached_data:
        logger.debug(f"Cache hit for key: {key}")
        return json.loads(cached_data)
    logger.debug(f"Cache miss for key: {key}")
    return None

#
async def fetch_details(session, details_url, details_params):
    async with session.get(details_url, params=details_params) as response:
        return await response.json()

async def get_all_details(all_results, api_key):
    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
    async with aiohttp.ClientSession() as session:
        tasks = []
        for result in all_results:
            place_id = result['place_id']
            details_params = {
                "place_id": place_id,
                "fields": "name,vicinity,rating,formatted_address,types,opening_hours,photos",
                "key": api_key
            }
            tasks.append(fetch_details(session, details_url, details_params))

        detailed_responses = await asyncio.gather(*tasks)
        
        detailed_results = []
        for i, details_data in enumerate(detailed_responses):
            result = all_results[i]
            if 'result' in details_data:
                result['name'] = details_data['result'].get('name')
                result['vicinity'] = details_data['result'].get('vicinity')
                result['rating'] = details_data['result'].get('rating')
                result['address'] = details_data.get('formatted_address')
                result['types'] = details_data.get('types', [])
                result['opening_hours'] = details_data['result'].get('opening_hours', {})

                if 'photos' in details_data['result']:
                    photo_reference = details_data['result']['photos'][0]['photo_reference']
                    result['photo_url'] = await get_photo_url(photo_reference, api_key)
                else:
                    result['photo_url'] = None

                detailed_results.append(result)
                
        return detailed_results

async def get_photo_url(photo_reference, api_key):
    if photo_reference:
        photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}'
        return photo_url
    return None

def places_nearby(location, radius, api_key):
    cache_key = f"places_nearby:{location}:{radius}:open_restaurants"
    cached_data = get_cached_request(cache_key)
    if cached_data:
        return {'results': cached_data}

    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": location,
        "radius": radius,
        "type": "restaurant",
        "opennow": True,
        "key": api_key
    }

    all_results = []
    while True:
        response = requests.get(url, params=params)
        data = response.json()
        logger.debug(f"Restaurant data: {data}")

        if 'results' in data:
            all_results.extend(data['results'])

        if 'next_page_token' in data:
            # Delay required by the API to ensure the next_page_token is active
            time.sleep(2)
            params['pagetoken'] = data['next_page_token']
        else:
            break

    # Get detailed results asynchronously, makes initial loading times insanely faster 
    detailed_results = asyncio.run(get_all_details(all_results, api_key))

    cache_request(cache_key, detailed_results)
    return {'results': detailed_results}

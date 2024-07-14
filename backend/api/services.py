# # services.py
# import json
# import requests
# import redis
# from django.conf import settings

# redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

# def cache_request(key, data, ttl=600):
#     """Cache the data in Redis with a time-to-live (ttl) in seconds."""
#     redis_client.setex(key, ttl, json.dumps(data))

# def get_cached_request(key):
#     """Retrieve data from Redis if it has not expired."""
#     cached_data = redis_client.get(key)
#     if cached_data:
#         return json.loads(cached_data)
#     return None

# def places_nearby(location, radius, api_key):
#     cache_key = f"places_nearby:{location}:{radius}:open_restaurants"
#     cached_data = get_cached_request(cache_key)
#     if cached_data:
#         return cached_data

#     response = _places_nearby(location, radius, api_key)
#     cache_request(cache_key, response)
#     return response

# def _places_nearby(location, radius, api_key):
#     url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
#     params = {
#         "location": location,
#         "radius": radius,
#         "type": "restaurant",
#         "opennow": True,
#         "key": api_key
#     }
#     response = requests.get(url, params=params)
#     return response.json()



# def get_geolocation(ip_address):
#     # I will put in geolocation code when deployment comes, since
#     # im running this all locally and i'd rather not spend alot of time setting up
#     # azure for a simple ip_address test
#     return None


# updated code

# import json
# import requests
# import redis
# import logging
# from django.conf import settings
# import time

# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

# redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

# def cache_request(key, data, ttl=600):
#     """Cache the data in Redis with a time-to-live (ttl) in seconds."""
#     redis_client.setex(key, ttl, json.dumps(data))

# # def get_cached_request(key):
# #     """Retrieve data from Redis if it has not expired."""
# #     cached_data = redis_client.get(key)
# #     if cached_data:
# #         return json.loads(cached_data)
# #     return None

# def get_cached_request(key):
#     logger.debug(f"Checking cache for key: {key}")
#     cached_data = redis_client.get(key)
#     if cached_data:
#         logger.debug(f"Cache hit for key: {key}")
#         return json.loads(cached_data)
#     logger.debug(f"Cache miss for key: {key}")
#     return None

# def places_nearby(location, radius, api_key):
#     cache_key = f"places_nearby:{location}:{radius}:open_restaurants"
#     cached_data = get_cached_request(cache_key)
#     if cached_data:
#         return cached_data

#     url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
#     params = {
#         "location": location,
#         "radius": radius,
#         "type": "restaurant",
#         "opennow": True,
#         "key": api_key
#     }
    
#     all_results = []
#     while True:
#         response = requests.get(url, params=params)
#         data = response.json()
#         logger.debug(f"Restaurant data: {data}")

#         if 'results' in data:
#             all_results.extend(data['results'])

#         if 'next_page_token' in data:
#             # Delay required by the API to ensure the next_page_token is active
#             time.sleep(2)
#             params['pagetoken'] = data['next_page_token']
#         else:
#             break

#     detailed_results = []
#     for result in all_results:
#         place_id = result['place_id']
#         details_url = "https://maps.googleapis.com/maps/api/place/details/json"
#         details_params = {
#             "place_id": place_id,
#             "fields": "name,vicinity,rating,opening_hours,photos",
#             "key": api_key
#         }
#         details_response = requests.get(details_url, params=details_params)
#         details_data = details_response.json()

#         if 'result' in details_data:
#             result['name'] = details_data['result'].get('name')
#             result['vicinity'] = details_data['result'].get('vicinity')
#             result['rating'] = details_data['result'].get('rating')
#             result['opening_hours'] = details_data['result'].get('opening_hours', {})

#             if 'photos' in details_data['result']:
#                 photo_reference = details_data['result']['photos'][0]['photo_reference']
#                 result['photo_url'] = get_photo_url(photo_reference, api_key)
#             else:
#                 result['photo_url'] = None
            
#             detailed_results.append(result)

#     cache_request(cache_key, detailed_results)
#     return detailed_results

# def get_photo_url(photo_reference, api_key):
#     if photo_reference:
#         return f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}'
#     return None

# experimental debug code

import json
import requests
import redis
import logging
from django.conf import settings
import time
from .models import Location

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

def cache_request(key, data, ttl=600):
    """Cache the data in Redis with a time-to-live (ttl) in seconds."""
    redis_client.setex(key, ttl, json.dumps(data))

def get_cached_request(key):
    logger.debug(f"Checking cache for key: {key}")
    cached_data = redis_client.get(key)
    if cached_data:
        logger.debug(f"Cache hit for key: {key}")
        return json.loads(cached_data)
    logger.debug(f"Cache miss for key: {key}")
    return None

# Takes cached data and sorts it out
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
     
    # while loop is for searching for more restraunts when google places api hits the 20 query max, fixes
    # bug where it would only show 20 restraunts open, even when there are clearly more
    all_results = []
    while True:
        response = requests.get(url, params=params)
        data = response.json()
        logger.debug(f"Restaurant data: {data}")

        if 'results' in data:
            all_results.extend(data['results'])
        # next page token is used to find the next page of open restraunts
        if 'next_page_token' in data:
            time.sleep(2)
            params['pagetoken'] = data['next_page_token']
        else:
            break

    detailed_results = []
    for result in all_results:
        place_id = result['place_id']
        details_url = "https://maps.googleapis.com/maps/api/place/details/json"
        details_params = {
            "place_id": place_id,
            "fields": "name,vicinity,rating,opening_hours,photos",
            "key": api_key
        }
        details_response = requests.get(details_url, params=details_params)
        details_data = details_response.json()

        if 'result' in details_data:
            result['name'] = details_data['result'].get('name')
            result['vicinity'] = details_data['result'].get('vicinity')
            result['rating'] = details_data['result'].get('rating')
            result['opening_hours'] = details_data['result'].get('opening_hours', {})

            if 'photos' in details_data['result']:
                photo_reference = details_data['result']['photos'][0]['photo_reference']
                result['photo_url'] = get_photo_url(photo_reference, api_key)
            else:
                result['photo_url'] = None
            
            detailed_results.append(result)

    cache_request(cache_key, detailed_results)
    return {'results': detailed_results}
# function used to get the photo urls
def get_photo_url(photo_reference, api_key):
    if photo_reference:
        return f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}'
    return None
# When the frontend sends down location data, this function stores it within the model
def process_location_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if latitude is not None and longitude is not None:
            # Save location data to the database
            location = Location(latitude=latitude, longitude=longitude)
            location.save()
            return {'status': 'success', 'message': 'Location saved successfully.'}
        else:
            return {'status': 'error', 'message': 'Latitude and longitude must be provided.'}
    else:
        return {'status': 'error', 'message': 'Invalid request method.'}
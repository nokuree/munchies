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

import json
import requests
import redis
from django.conf import settings

redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

def cache_request(key, data, ttl=600):
    """Cache the data in Redis with a time-to-live (ttl) in seconds."""
    redis_client.setex(key, ttl, json.dumps(data))

def get_cached_request(key):
    """Retrieve data from Redis if it has not expired."""
    cached_data = redis_client.get(key)
    if cached_data:
        return json.loads(cached_data)
    return None

def places_nearby(location, radius, api_key):
    cache_key = f"places_nearby:{location}:{radius}:open_restaurants"
    cached_data = get_cached_request(cache_key)
    if cached_data:
        return cached_data

    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": location,
        "radius": radius,
        "type": "restaurant",
        "opennow": True,
        "key": api_key
    }
    response = requests.get(url, params=params)
    data = response.json()

    if 'results' in data:
        for result in data['results']:
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

    cache_request(cache_key, data)
    return data

def get_photo_url(photo_reference, api_key):
    if photo_reference:
        return f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}'
    return None

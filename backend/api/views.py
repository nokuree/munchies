# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .services import places_nearby

# def nearby_open_restaurants_view(request):
#     location = request.GET.get('location')
#     radius = request.GET.get('radius', 1500)  # Default radius if not provided
#     api_key = "Enter Api Key Here!"

#     if not location:
#         return JsonResponse({'error': 'Location parameter is required'}, status=400)

#     data = places_nearby(location, radius, api_key)
#     return JsonResponse(data)

from django.http import JsonResponse
from .services import places_nearby, get_photo_url

def nearby_open_restaurants_view(request):
    location = ""
    api_key = ""
    radius = request.GET.get('radius', 5000) 

    if not location:
        return JsonResponse({'error': 'Location parameter is required'}, status=400)

    data = places_nearby(location, radius, api_key)

    # Extract relevant restaurant information and construct response
    restaurants = []
    for result in data.get('results', []):
        restaurant = {
            'name': result['name'],
            'vicinity': result['vicinity'],
            'rating': result.get('rating', 'N/A'),
            'opening_hours' : result['opening_hours'],
            'open_now': result['opening_hours']['open_now'] if 'opening_hours' in result else False,
            'photo_url': result['photo_url'] if 'photo_url' in result else None
        }
        restaurants.append(restaurant)

    # Return JSON response with the list of restaurants
    return JsonResponse({'restaurants': restaurants})

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
from .services import places_nearby
from django.views.decorators.csrf import csrf_exempt 
import json

@csrf_exempt
def nearby_open_restaurants_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if latitude is not None and longitude is not None:
            api_key = ""
            radius = request.GET.get('radius', 5000) 

            location = f"{latitude},{longitude}"
            data = places_nearby(location, radius, api_key)
            
            # Extract relevant restaurant information and construct response
            restaurants = []
            for result in data.get('results', []):
                restaurant = {
                    'name': result['name'],
                    'vicinity': result['vicinity'],
                    'rating': result.get('rating', 'N/A'),
                    'opening_hours': result.get('opening_hours', {}).get('open_now', False),
                    'photo_url': result.get('photos', [])[0]['photo_reference'] if 'photos' in result else None
                }
                restaurants.append(restaurant)

            # Return JSON response with the list of restaurants
            return JsonResponse({'restaurants': restaurants})

        else:
            return JsonResponse({'error': 'Latitude and longitude must be provided.'}, status=400)

    return JsonResponse({'error': 'POST method required.'}, status=405)

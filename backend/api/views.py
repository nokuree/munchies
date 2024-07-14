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
from .services import places_nearby, process_location_data
from django.views.decorators.csrf import csrf_exempt 
from .models import Location
import json

# saves location data that is sent via post request from react
@csrf_exempt
def save_location_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            latitude = data.get('latitude')
            longitude = data.get('longitude')
            
            # Save the location data to the database or perform any necessary action
            Location.objects.create(latitude=latitude, longitude=longitude)

            return JsonResponse({'message': 'Location saved successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'POST method required.'}, status=405)

# View that processes the data for react to print out, takes api key, radius of 5 miles, and user location
# then uses places_nearby to process and cache data before spitting out usable data for react to display
@csrf_exempt
def nearby_open_restaurants_view(request):
    if request.method == 'GET':
        location = Location.objects.last()  

        if location:
            api_key = "AIzaSyDPCXmyknljFGv185cBoyJKPTnMwJPofQY"
            radius = request.GET.get('radius', 5000)

            location_str = f"{location.latitude},{location.longitude}"
            data = places_nearby(location_str, radius, api_key)

            
            restaurants = []
            for result in data.get('results', []):
                restaurant = {
                    'name': result['name'],
                    'vicinity': result['vicinity'],
                    'rating': result.get('rating', 'N/A'),
                    'opening_hours': result.get('opening_hours', {}).get('open_now', False),
                    'photo_url': result['photo_url'] if 'photo_url' in result else None
                }
                restaurants.append(restaurant)

            return JsonResponse({'restaurants': restaurants})
        else:
            return JsonResponse({'error': 'No location data found.'}, status=404)

    return JsonResponse({'error': 'GET method required.'}, status=405)
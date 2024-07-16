# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .services import places_nearby
from django.views.decorators.csrf import csrf_exempt 
from .models import Location
import json
import openai

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

def nearby_open_restaurants_view(request):
    if request.method == 'GET':
        location = Location.objects.last()  

        if location:
            api_key = ""
            radius = request.GET.get('radius', 5000)

            location_str = f"{location.latitude},{location.longitude}"
            data = places_nearby(location_str, radius, api_key)

            # lol
            
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

            return JsonResponse({'restaurants': restaurants})
        else:
            return JsonResponse({'error': 'No location data found.'}, status=404)

    return JsonResponse({'error': 'GET method required.'}, status=405)

openai.key = ''
@csrf_exempt
def chat_with_gpt(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message', '')

        response = openai.Completion.create(
            engine="davinci",
            prompt=user_message,
            max_tokens=150
        )

        gpt_response = response.choices[0].text.strip()
        return JsonResponse({'response': gpt_response})
    return JsonResponse({'error': 'Invalid request'}, status=400)
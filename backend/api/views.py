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


from django.shortcuts import render
import json
import requests

def nearby_open_restaurants_view(request):
    # Example JSON response (you would replace this with your actual API call)
    location = "enter location here"
    radius = 5000
    api_key = "Lol"

    data = places_nearby(location,radius,api_key)



    # Extract relevant restaurant information
    restaurants = []
    for result in data.get('results', []):
        restaurant = {
            'name': result['name'],
            'vicinity': result['vicinity'],
            'rating': result.get('rating', 'N/A'),
            'open_now': result['opening_hours']['open_now'] if 'opening_hours' in result else False
        }
        restaurants.append(restaurant)

    # Render the template with the restaurant data
    return render(request, 'Home.html', {'restaurants': restaurants})

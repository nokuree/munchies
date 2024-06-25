# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .services import places_nearby

# def nearby_open_restaurants_view(request):
#     location = request.GET.get('location')
#     radius = request.GET.get('radius', 1500)  # Default radius if not provided
#     api_key = "AIzaSyBL5CvYkdMo0Cr9O3CpyOQ4Vq9uiDSThes"

#     if not location:
#         return JsonResponse({'error': 'Location parameter is required'}, status=400)

#     data = places_nearby(location, radius, api_key)
#     return JsonResponse(data)


from django.shortcuts import render
import json
import requests

def nearby_open_restaurants_view(request):
    # Example JSON response (you would replace this with your actual API call)
    response_json = """
    {
      "html_attributions": [],
      "results": [
        {
          "business_status": "OPERATIONAL",
          "geometry": {
            "location": {
              "lat": 47.2438445,
              "lng": -122.5563865
            }
          },
          "name": "Boathouse 19",
          "opening_hours": {
            "open_now": true
          },
          "rating": 4.3,
          "vicinity": "9001 South 19th Street, Tacoma"
        },
        {
          "business_status": "OPERATIONAL",
          "geometry": {
            "location": {
              "lat": 47.2355195,
              "lng": -122.547994
            }
          },
          "name": "U P Station Bar & Grill",
          "opening_hours": {
            "open_now": true
          },
          "rating": 4.3,
          "vicinity": "8305 27th Street West, University Place"
        },
        {
          "business_status": "OPERATIONAL",
          "geometry": {
            "location": {
              "lat": 47.2464055,
              "lng": -122.5528385
            }
          },
          "name": "Beach Tavern",
          "opening_hours": {
            "open_now": true
          },
          "rating": 4.4,
          "vicinity": "8612 6th Avenue, Tacoma"
        },
        {
          "business_status": "OPERATIONAL",
          "geometry": {
            "location": {
              "lat": 47.2355011,
              "lng": -122.5489759
            }
          },
          "name": "Lefty's Burger Shack",
          "opening_hours": {
            "open_now": true
          },
          "rating": 4.5,
          "vicinity": "8317 27th Street West, University Place"
        }
      ],
      "status": "OK"
    }
    """
    
    # Parse the JSON response
    data = json.loads(response_json)

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

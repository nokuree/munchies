# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .services import places_nearby

def nearby_open_restaurants_view(request):
    location = request.GET.get('location')
    radius = request.GET.get('radius', 1500)  # Default radius if not provided
    api_key = "YOUR_API_KEY"

    if not location:
        return JsonResponse({'error': 'Location parameter is required'}, status=400)

    data = places_nearby(location, radius, api_key)
    return JsonResponse(data)
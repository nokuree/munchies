import React, { useState, useEffect } from 'react';

const GeolocationComponent = () => {
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ latitude, longitude });
                        sendLocationToBackend(latitude, longitude);
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        };

        fetchLocation(); // Call fetchLocation when the component mounts

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const sendLocationToBackend = (latitude, longitude) => {
        fetch('/api/nearby_open_restaurants/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ latitude, longitude })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    return (
        <div>
            {userLocation.latitude && userLocation.longitude ? (
                <p>Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}</p>
            ) : (
                <p>Fetching location...</p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default GeolocationComponent;

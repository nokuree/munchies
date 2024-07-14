import React, { useState, useEffect } from 'react';
import axios from 'axios'

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
                        console.log(latitude)
                        console.log(longitude)
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        };

        fetchLocation(); 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const sendLocationToBackend = async(latitude, longitude) => {
        try {
            const response = await axios.post("http://localhost:8000/api/save_location/", {
                latitude : latitude,
                longitude : longitude
            });
            console.log(response.data.latitude, response.data.longitude)
        } catch (error) {
            console.error("Error with sending data: ", error)
        }
        
    }



    return 
};

export default GeolocationComponent;

// // import React, {useState} from 'react'
// // import {Card, Button, Alert} from 'react-bootstrap'
// // import {useAuth} from '../contexts/AuthContext'
// // import {Link, useNavigate} from 'react-router-dom'


// // export default function Dashboard() {
// //     const [error, setError] = useState("")
// //     const {currentUser, logout} = useAuth()
// //     const history = useNavigate()

// //     async function handleLogout() {
// //         setError("")

// //         try {
// //             await logout()
// //             history('/login')
// //         } catch {
// //             setError('Failed to log out')
// //         }
// //     }
// //   return (
// //     <>
// //         <Card>
// //             <Card.Body>
// //                 <h2 className="text-center mb-4">Profile</h2>
// //                 {error && <Alert variant="danger">{error}</Alert>}
// //                 <strong>Email:</strong> {currentUser.email}
// //                 <Link to="/update-profile" className="btn btn-primar w-100 mt-3">Update Profile</Link>
// //             </Card.Body>
// //             <div className="w-100 text-center mt-2">
// //                 <Button variant="link" onClick={handleLogout}>Log Out</Button>
// //             </div>
// //         </Card>
// //     </>
// //   )
// }

import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import {Link, useNavigate} from "react-router-dom"
import NavBar from './NavBar'


function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/nearby_open_restaurants/');
        if (!response.ok) {
          throw new Error('Network response was not good :(');
        }
        const data = await response.json();
        setRestaurants(data.restaurants);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <header>
        <NavBar />
      </header>

      <h1>Nearby Open Restaurants</h1>
      <ul>
        {restaurants.map((restaurant, index) => (
          <li key={index}>
            <h2>{restaurant.name}</h2>
            <p>Location: {restaurant.vicinity}</p>
            <p>Rating: {restaurant.rating}</p>
            <p>Open Now: {restaurant.open_now ? 'Yes' : 'No'}</p>
            {restaurant.photo_url && (
              <img src={restaurant.photo_url} alt={restaurant.name} style={{ maxWidth: '100%' }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;



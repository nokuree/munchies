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

// import React, { useState, useEffect } from "react";
// import { Navbar, Container, Nav, Card, ListGroup } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import NavBar from "./NavBar";
// import '../styles.css'; // Import the CSS file

// function Dashboard() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:8000/api/nearby_open_restaurants/"
//         );
//         if (!response.ok) {
//           throw new Error("Network response was not good :(");
//         }
//         const data = await response.json();
//         setRestaurants(data.restaurants);
//         setError(null); // Clear any previous error
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Error fetching data. Please try again later.");
//       }
//     };

//     fetchData();
//   }, []);

//   const getCurrentDayIndex = () => {
//     const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const currentDay = new Date().getDay();
//     return currentDay;
//   };

//   const currentDayIndex = getCurrentDayIndex();


//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <div>
//         <header>
//           <NavBar />
//         </header>
//       </div>
//       <Container
//         className="d-flex align-items-center justify-content-center"
//         style={{ minHeight: "100vh" }}
//       >
//         <div className="w-100" style={{ maxWidth: "600px" }}>
//           <h1>Nearby Open Restaurants</h1>
//           {restaurants.map((restaurant, index) => (
//             <Card key={index} className="mb-3 text-sm">
//               <Card.Body>
//                 <Card.Title>{restaurant.name}</Card.Title>
//                 <Card.Text><strong>Location:</strong> {restaurant.vicinity}</Card.Text>
//                 <Card.Text><strong>Rating:</strong> {restaurant.rating}</Card.Text>
//                 <Card.Text><strong>Open Now:</strong> {restaurant.open_now ? "Yes" : "No"}</Card.Text>
//                 {restaurant.opening_hours && restaurant.opening_hours.weekday_text && (
//                   <ListGroup variant="flush" className="text-sm">
//                     <ListGroup.Item>Hours:</ListGroup.Item>
//                     {restaurant.opening_hours.weekday_text.map((hours, idx) => (
//                       <ListGroup.Item key={idx} className={idx === currentDayIndex ? 'current-day' : ''}>
//                         {hours}
//                       </ListGroup.Item>
//                     ))}
//                   </ListGroup>
//                 )}
//                 {restaurant.photo_url && (
//                   <Card.Img
//                     variant="bottom"
//                     src={restaurant.photo_url}
//                     alt={restaurant.name}
//                     style={{ maxWidth: "100%" }}
//                   />
//                 )}
//               </Card.Body>
//             </Card>
//           ))}
//         </div>
//       </Container>
//     </>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Card, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import '../styles.css'; // Import the CSS file

function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/nearby_open_restaurants/"
        );
        if (!response.ok) {
          throw new Error("Network response was not good :(");
        }
        const data = await response.json();
        setRestaurants(data.restaurants);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const getCurrentDayIndex = () => {
    const currentDay = new Date().getDay();
    return currentDay;
  };

  const currentDayIndex = getCurrentDayIndex();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>
        <header>
          <NavBar />
        </header>
      </div>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "600px" }}>
          <h1 className="munchies-title" style={{color: 'white'}}>Nearby Open Restaurants</h1>
          {restaurants.map((restaurant, index) => (
            <Card key={index} className="mb-3 text-sm">
              <Card.Body>
                <Card.Title>{restaurant.name}</Card.Title>
                <Card.Text><strong>Location:</strong> {restaurant.vicinity}</Card.Text>
                <Card.Text><strong>Rating:</strong> {restaurant.rating}</Card.Text>
                <Card.Text><strong>Open Now:</strong> {restaurant.open_now ? "Yes" : "No"}</Card.Text>
                {restaurant.opening_hours && restaurant.opening_hours.weekday_text && (
                  <ListGroup variant="flush" className="text-sm">
                    <ListGroup.Item><strong>Hours:</strong></ListGroup.Item>
                    {restaurant.opening_hours.weekday_text.map((hours, idx) => (
                      <ListGroup.Item key={idx} className={idx === currentDayIndex ? 'current-day' : ''}>
                        {hours}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
                {restaurant.photo_url && (
                  <Card.Img
                    variant="bottom"
                    src={restaurant.photo_url}
                    alt={restaurant.name}
                    style={{ maxWidth: "100%" }}
                  />
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}

export default Dashboard;

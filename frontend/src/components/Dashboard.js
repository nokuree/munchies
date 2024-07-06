
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
import '../styles.css'; 

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

  // return (
  //   <>
  //     <div>
  //       <header>
  //         <NavBar />
  //       </header>
  //     </div>
  //     <Container
  //       className="d-flex align-items-center justify-content-center"
  //       style={{ minHeight: "100vh" }}
  //     >
  //       <div className="w-100" style={{ maxWidth: "800px" }}>
  //         <h1 className="munchies-title" style={{ color: 'white' }}>Nearby Open Restaurants</h1>
  //         {restaurants.map((restaurant, index) => (
  //           <Card key={index} className="mb-3 text-sm" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: '200px' }}>
  //             {restaurant.photo_url && (
  //               <div style={{ flex: '0 0 auto', width: '200px', height: '200px', overflow: 'hidden' }}>
  //                 <Card.Img
  //                   src={restaurant.photo_url}
  //                   alt={restaurant.name}
  //                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  //                 />
  //               </div>
  //             )}
  //             <Card.Body style={{ flex: '1', padding: '10px' }}>
  //               <Card.Title>
  //                 <a 
  //                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.vicinity)}`} 
  //                   target="_blank" 
  //                   rel="noopener noreferrer"
  //                   style={{ textDecoration: 'underline', color: '#007bff' }}
  //                 >
  //                   {restaurant.name}
  //                 </a>
  //               </Card.Title>
  //               <Card.Text><strong>Location:</strong> {restaurant.vicinity}</Card.Text>
  //               <Card.Text><strong>Rating:</strong> {restaurant.rating}</Card.Text>
  //               <Card.Text><strong>Open Now:</strong> {restaurant.open_now ? "Yes" : "No"}</Card.Text>
  //               {restaurant.opening_hours && restaurant.opening_hours.weekday_text && (
  //                 <ListGroup variant="flush" className="text-sm">
  //                   <ListGroup.Item><strong>Today's Hours:</strong></ListGroup.Item>
  //                   <ListGroup.Item className='current-day'>
  //                     {restaurant.opening_hours.weekday_text[currentDayIndex]}
  //                   </ListGroup.Item>
  //                 </ListGroup>
  //               )}
  //             </Card.Body>
  //           </Card>
  //         ))}
  //       </div>
  //     </Container>
  //   </>
  // );

  return (
    <>
      <div>
        <header>
          <NavBar />
        </header>
      </div>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", padding: "20px" }}
      >
        <div className="w-100" style={{ maxWidth: "1000px" }}>
          <h1 className="munchies-title text-center" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '20px', marginLeft: '-60px'}}>Nearby Open Restaurants</h1>
          {restaurants.map((restaurant, index) => (
            <Card key={index} className="mb-4 text-sm" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: '250px', padding: '20px', fontSize: '1.2rem' }}>
              {restaurant.photo_url && (
                <div style={{ flex: '0 0 auto', width: '250px', height: '250px', overflow: 'hidden', marginRight: '20px' }}>
                  <Card.Img
                    src={restaurant.photo_url}
                    alt={restaurant.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <Card.Body style={{ flex: '1', padding: '0px' }}>
                <Card.Title>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.vicinity)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'underline', color: '#007bff', fontSize: '1.5rem' }}
                  >
                    {restaurant.name}
                  </a>
                </Card.Title>
                <Card.Text><strong>Location:</strong> {restaurant.vicinity}</Card.Text>
                <Card.Text><strong>Rating:</strong> {restaurant.rating}</Card.Text>
                <Card.Text><strong>Open Now:</strong> {restaurant.open_now ? "Yes" : "No"}</Card.Text>
                {restaurant.opening_hours && restaurant.opening_hours.weekday_text && (
                  <ListGroup variant="flush" className="text-sm">
                    <ListGroup.Item><strong>Today's Hours:</strong></ListGroup.Item>
                    <ListGroup.Item className='current-day'>
                      {restaurant.opening_hours.weekday_text[currentDayIndex]}
                    </ListGroup.Item>
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
};



export default Dashboard;

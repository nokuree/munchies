import React, { useState, useEffect } from "react";
import Chat from "./Chat"
import { Navbar, Container, Nav, Card, ListGroup, Spinner, Placeholder } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

// Dashboard ui and frontend handeling when the page loads
function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // New state for loading

  // Show loading toast
  const notifyLoading = () => toast.loading("Loading restaurants...");
  const updateLoading = (id, message, type) => toast.update(id, { render: message, type, isLoading: false, autoClose: 2000 });

  // this is where the frontend connects with the django data to fetch our sweet sweet processed data 
  useEffect(() => {
    const fetchData = async () => {
      const toastId = notifyLoading();
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
        updateLoading(toastId, "Restaurants loaded!", "success");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        updateLoading(toastId, "Error loading data!", toast.TYPE.ERROR);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, []);
  // To figure out what day it is lol
  const getCurrentDayIndex = () => {
    const currentDay = new Date().getDay();
    const adjustedDay = (currentDay === 0) ? 6 : currentDay -1;
    return adjustedDay;
  };

  const currentDayIndex = getCurrentDayIndex();
  // debugging code
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ToastContainer />
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
          {loading ? (
            // Display placeholders while loading, makes loading look alot more clean :p
            // Thank God for react bootstrap!
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="mb-4 text-sm" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: '250px', padding: '20px', fontSize: '1.2rem' }}>
                <div style={{ flex: '0 0 auto', width: '250px', height: '250px', overflow: 'hidden', marginRight: '20px' }}>
                  <Placeholder as={Card.Img} animation="wave" style={{ width: '100%', height: '100%' }} />
                </div>
                <Card.Body style={{ flex: '1', padding: '0px' }}>
                  <Placeholder as={Card.Title} animation="wave">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder xs={8} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder xs={5} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder xs={4} />
                  </Placeholder>
                  <ListGroup variant="flush" className="text-sm">
                    <ListGroup.Item>
                      <Placeholder as={Card.Text} animation="wave">
                        <Placeholder xs={7} />
                      </Placeholder>
                    </ListGroup.Item>
                    <ListGroup.Item className='current-day'>
                      <Placeholder as={Card.Text} animation="wave">
                        <Placeholder xs={5} />
                      </Placeholder>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            ))
          ) : (
            // Display restaurant cards once data is loaded
            restaurants.map((restaurant, index) => (
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
            ))
          )}
        </div>
        <Chat restaurants={restaurants} />
      </Container>
    </>
  );
};

export default Dashboard;

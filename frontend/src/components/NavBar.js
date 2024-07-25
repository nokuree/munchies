import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css'; 


// Navbar was way too messy to put in Dashboard by itself, so I decided to make a seperate component.
// I try to avoid messy and hard to read code when I can lol, unless that messy and hard to read code
// is the only way to keep the project together 
function NavBar() {
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState('');
    const history = useNavigate();

    async function handleLogout() {
        setError('');

        try {
            await logout();
            history('/login');
        } catch {
            setError('Failed to log out');
        }
    }

    return (
        <div>
            <Navbar bg="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand>
                        <img src="images.png" alt="logo" style={{ marginRight: '3px', marginTop: '-9px' }} />
                        <span className="logo-text">Munchies</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/update-profile" className="nav-link">Update Profile</Nav.Link>
                            <Nav.Link onClick={handleLogout} className="nav-link">Log Out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavBar;


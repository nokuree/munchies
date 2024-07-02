import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css'; // Ensure this path is correct

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
                        <img src="images.png" alt="logo" style={{ marginRight: '10px' }} />
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


import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import {Link, useNavigate} from "react-router-dom"


function NavBar() {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand>Munchies </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className = "ms-auto">
                            <Nav.Link as={Link} to="/update-profile">Update Profile</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </div>
    );
}

export default NavBar;
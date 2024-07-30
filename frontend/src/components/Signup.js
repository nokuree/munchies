import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const history = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match!');
        }

        try {
            setError("");
            setMessage("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            setMessage("Sign up successful! Please check your email for a verification link before logging in.");
            history("/login");
        } catch {
            setError("Failed to sign up!");
        }

        setLoading(false);
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <div className="d-flex align-items-center justify-content-center">
                    <img src="images.png" alt="logo" style={{ marginRight: '10px', marginTop: '-9px' }}></img>
                    <h1 style={{ color: "white" }}>Munchies</h1>
                </div>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} required />
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">
                                Sign Up
                            </Button>
                        </Form>
                        <GoogleSignIn />
                    </Card.Body>
                </Card>
                <div style={{ color: 'white' }} className="w-100 text-center mt-2">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </Container>
    );
}

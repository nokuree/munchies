import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import {useAuth} from '../contexts/AuthContext';
import {Link, useNavigate} from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn"

// Signup code
export default function Signup() {
    // data declarations 
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useNavigate()

    // So when we submit, it makes sure that the passwords match and if not, it wont proceed and blocks the email and password from being registered and 
    // causing a mess
    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match!')
        }
        try {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            history("/login")
        } catch {
            setError("Failed to sign in!")
        }
        setLoading(false)
        
    }

    // Fun frontend, bootstrap is fun to work with :p
    return (
        <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{maxWidth: "400px"}}>
        <div className="d-flex align-items-center justify-content-center">
          <img src="images.png" alt="logo" style={{ marginRight: '10px', marginTop: '-9px' }}></img>
          <h1 style={{color:"white"}}>Munchies</h1>
        </div>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}> 
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required/>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required/>
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required/>
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">
                        Sign Up
                    </Button>
                </Form>
                <GoogleSignIn/>
            </Card.Body>
        </Card>
        <div style={{color: 'white'}} className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
      </Container>
    )
  
}

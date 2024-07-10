import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import {useAuth} from '../contexts/AuthContext';
import {Link} from "react-router-dom"


export default function ForgotPassword() {
    // data declarations 
    const emailRef = useRef()


    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // So when we submit, it makes sure that the passwords match and if not, it wont proceed and blocks the email and password from being registered and 
    // causing a mess
    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructiosn')
        } catch {
            setError("Failed to reset password!")
        }
        setLoading(false)
        
    }

    // Fun frontend, bootstrap is fun to work with :p
    return (
        <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
      <div>
        <Card>
            <Card.Body>
                
                <h2 className="text-center mb-4">Passsword Reset </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}> 
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required/>
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">
                        Reset Password 
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/login">Login</Link>
                </div>
            </Card.Body>
        </Card>
        <div style={{color:'white'}} className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
      </Container>
    )
}

import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import {useAuth} from '../contexts/AuthContext';
import {Link} from "react-router-dom"

// Forget password component
export default function ForgotPassword() {
    // data declarations 
    const emailRef = useRef()


    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

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

    // Forgot password code, its cool cause it sends a email to you to reset password. 
    return (
        <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>

      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="d-flex align-items-center justify-content-center">
          <img src="images.png" alt="logo" style={{ marginRight: '10px', marginTop: '-9px' }}></img>
          <h1 style={{color:"white"}}>Munchies</h1>
        </div>
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

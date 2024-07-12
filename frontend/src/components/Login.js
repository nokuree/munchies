import React, { useRef, useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container} from 'react-bootstrap';
import {UserAuth, useAuth} from '../contexts/AuthContext'
import {auth, provider} from "../firebase"
import {getRedirectResult, signInWithRedirect, signInWithPopup} from "firebase/auth"
import {Link, useNavigate} from "react-router-dom"
import GeolocationComponent from "./Geolocation"
// import GoogleSignIn from "./GoogleSignIn"


export default function Login() {
    // data declarations 
    const emailRef = useRef()
    const passwordRef = useRef()

    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const {googleSignIn, currentUser} = UserAuth();
    const history = useNavigate() 

    // So when we submit, it makes sure that the passwords match and if not, it wont proceed and blocks the email and password from being registered and 
    // causing a mess
    async function handleSubmit(e) {
        e.preventDefault()

        console.log("Email:", emailRef.current.value);
        console.log("Password:", passwordRef.current.value);
        

        try {
            setError("")
            setLoading(true) 
            await login(emailRef.current.value, passwordRef.current.value)
            console.log("Current user is: ", currentUser)
            history("/dashboard")
        } catch(error) {
            console.error(error)
        }
        setLoading(false)
        
    }

    const handleGoogleSignIn = async () => {
        signInWithPopup(auth, provider).then(async(result) =>{
            console.log(result);
            if (result.user) {
                history("/dashboard")
            }
        });

        // signInWithRedirect(auth,provider)
        
    };

    // useEffect(() => {

    //     const handleRedirectResult = async () => {
    //         try {
    //             const result = await getRedirectResult(auth);
    //             if (result) {
    //                 history("/dashboard")
    //             }
    //         } catch (error) {
    //             console.error(error);
    //             setError("Failed to log in with Google!");
    //         }
            
    //     };

    //     handleRedirectResult();
    // }, [history]);


    // Fun frontend, bootstrap is fun to work with :p
    return (
        <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{maxWidth: "400px"}}>
        
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Log in </h2>
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
                    <Button disabled={loading} className="w-100" type="submit">
                        Log in 
                    </Button>
                    
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    
                </div>
                
            </Card.Body>
        </Card>
        <div style={{color: 'white'}} className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>
        <div 
            style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
            onClick={handleGoogleSignIn}
        >
            <img src={"./google.png"} width={"80%"} alt="Google Sign-In"/>
        </div>
        <div>
            {location.latitude && location.longitude ? (
                <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>
            ) : (
                <p>Fetching location...</p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
        <GeolocationComponent />
      </div>
      </Container>
    )
  
}

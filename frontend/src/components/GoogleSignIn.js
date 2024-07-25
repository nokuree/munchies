import React, { useEffect } from 'react';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, provider } from "../firebase";
import "../styles.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Google sign in! Loved working with it, so cool to use powerful technologies like this 
function GoogleSignIn() {
    const navigate = useNavigate();

    const googleLogin = () => {
        console.log("Starting Google login...");
        signInWithRedirect(auth, provider);
    };

    useEffect(() => {
        const checkRedirectResult = async () => {
            console.log("Checking for redirect result...");
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log("Redirect result received, navigating to /dashboard");
                    navigate("/dashboard");
                } else {
                    console.log("No redirect result received.");
                }
            } catch (error) {
                console.error("Error fetching redirect result:", error);
                toast.error("Failed to sign in with Google.");
            }
        };

        checkRedirectResult();
    }, [navigate]);

    return (
        <div 
            style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
            onClick={googleLogin}
        >
            <img src={"./google.png"} width={"80%"} alt="Google Sign-In"/>
        </div>
    );
}

export default GoogleSignIn;

import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import {auth, provider} from "../firebase"
import "../styles.css"
import  {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"

function GoogleSignIn() {
    const history = useNavigate()

    function googleLogin() {
        signInWithPopup(auth, provider).then((async(result)=>{
            console.log(result);
            if (result.user) {
                toast.success("User logged in successfully!", {
                    position: "top-center"
                });
                history("/dashboard")
            }
        }))
    }
  return (
    <div 
        style={{display: "flex", justifyContent: "center", cursor: "pointer"}}
        onClick={googleLogin}
    >
        <img src={"./google.png"} width={"80%"}/>
    </div>
  );
}
export default GoogleSignIn;
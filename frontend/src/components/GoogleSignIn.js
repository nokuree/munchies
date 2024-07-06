import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import {auth, provider} from "../firebase"
import "../styles.css"

function SignInWithGoogle() {

    function googleLogin() {
        signInWithPopup(auth, provider).then((async(result)=>{
            console.log(result);
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
export default SignInWithGoogle;
// This AuthContext provides the SignUp logic when you put in your email and password when signing up, so it communicates
// with firebase and stores user email and password


import React, { useContext, useState, useEffect } from 'react';
import {auth} from "../firebase"

import { createUserWithEmailAndPassword,onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import {updateEmail, updatePassword} from 'firebase/auth'

// Creates a React context, this context will store the authentication state and functions
const AuthContext = React.createContext()

// Uses useContext to access the value stored in AuthContext, which is the authentication state and functions, we dont need to 
// directly pass them as props through the component tree yay
export function useAuth() {
    return useContext(AuthContext)
}


// Manages the authentication state and provides functions to the child components
export function AuthProvider({children}) {
    // the state variables we will use later
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)


    // the signup function takes email and passwords 
    function signup(email,password){
        return createUserWithEmailAndPassword(auth, email,password)
    }

    function login(email, password) {
        console.log("lol")
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function updateCurrEmail(email) {
        return updateEmail(auth.currentUser, email)
    }
    function updateCurrPassword(password){
        return updatePassword(auth.currentUser, password)
    }

    // useEffect hook: Attatches a listener to the auth state using onAuthStateChanged, and when the auth state logs in or out, it updates 
    // the currentUser state with new user information, and sets loading to false to indicate that the state is fetched, then it returns unsubscruibe which removes the 
    // listener so no memory leaks 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setLoading(false)
            
        });
        return unsubscribe
    }, []);



    // Contains the data we use for the functions, currentUser and signup 
    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateCurrEmail,
        updateCurrPassword,
    } // Only renders the children, so if loading is false which means the authentication sate is fetched, it wont render the app until the users authentication state
    // is known. 
    return (
      <AuthContext.Provider value={value}>
            {!loading && children}
      </AuthContext.Provider>
    )
}

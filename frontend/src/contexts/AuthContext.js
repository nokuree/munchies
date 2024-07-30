import React, { useContext, useState, useEffect } from 'react';
import { auth, provider } from "../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification, signInWithPopup, updateEmail, updatePassword, signInWithRedirect } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                sendEmailVerification(userCredential.user);
            });
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if (!userCredential.user.emailVerified) {
                    throw new Error("Please verify your email before logging in.");
                }
                return userCredential;
            });
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function updateCurrEmail(email) {
        return updateEmail(auth.currentUser, email);
    }

    function updateCurrPassword(password) {
        return updatePassword(auth.currentUser, password);
    }

    function SignInPopUp() {
        return signInWithPopup(auth, provider);
    }

    const googleSignIn = () => {
        signInWithRedirect(auth, provider);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateCurrEmail,
        updateCurrPassword,
        SignInPopUp,
        googleSignIn,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
};

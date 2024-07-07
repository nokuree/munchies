import React, { useEffect, useState } from 'react';
import Signup from "./Signup"
import { Container } from "react-bootstrap"
import {AuthProvider} from "../contexts/AuthContext";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import SignInWithGoogle from "./GoogleSignIn"
import axios from 'axios';
// funny routing and rendering stuff, like when we minimize the window the application wont just implode on itself 
function App() {
    return ( 


            <div>
                <Router>
                    <AuthProvider>
                        <Routes>
                            <Route path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard/>
                                    </PrivateRoute>
                                }
                            ></Route>
                            <Route path="/update-profile"
                                element={
                                    <PrivateRoute>
                                        <UpdateProfile/>
                                    </PrivateRoute>
                                }
                            ></Route>
                            <Route path="/signup" element={<Signup/>}/>
                            <Route path="/test" element={<SignInWithGoogle/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/" element={<Login/>}/>
                            <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        </Routes>
                    </AuthProvider>
                </Router>
            </div>


    )
}

export default App;


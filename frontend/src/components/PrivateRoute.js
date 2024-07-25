import React from "react";
import {  Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Custom privateroute code, very simple, very effective 
export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
}
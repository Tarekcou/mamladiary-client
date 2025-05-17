import React, { createContext, useContext, useEffect, useState } from "react";
import axiosPublic from "../axios/axiosPublic";
import { useNavigate } from "react-router";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigation = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  // signin
  const signIn = async (formData) => {
    try {
      const res = await axiosPublic.post("/login", formData);
      if (res.status === 200) {
        alert("Login successful");
        setIsSignedIn(true);
        setUser(res.data.user);
        navigation("/dashboard");
        setLoading(false);
        // ✅ Save user in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful after alert");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  // signout
  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem("user");
    setLoading(false);
  };
  // register
  const resigter = async (formData) => {
    const res = await axiosPublic.post("/register", formData);
    res
      .then((response) => {
        console.log("Registration successful:", response.data);
        if (response.data.status === "success") {
          alert("Registration successful");
          navigation("/dashboard");
          setLoading(false);
        }
        if (response.data.message === "user already exist") {
          alert("User already exists");
          navigation("/login");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
  };

  useEffect(() => {
    // ✅ Load user from localStorage if exists
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsSignedIn(true);
      setLoading(false);
    }
  }, []);
  const authData = {
    signIn,
    resigter,
    signOut,
    isSignedIn,
    setIsSignedIn,
    setUser,
    user,
    isLoading,
    setLoading,
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

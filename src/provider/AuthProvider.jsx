import React, { createContext, useContext, useEffect, useState } from "react";
import axiosPublic from "../axios/axiosPublic";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isDivComLogin, setDivComLogin] = useState(false);
  const [isAdcLogin, setAdcLogin] = useState(false);
  const [isAcLandLogin, setAcLandLogin] = useState(false);
  const [isNagorikLogin, setNagorikLogin] = useState(false);
  const [isButtonSpin, setButtonSpin] = useState(false);

  const signIn = async (formData, loginStatus) => {
    setButtonSpin(true);
    setLoading(true);
    try {
      const res = await axiosPublic.post("/users/login", formData, {
        params: { loginStatus },
      });
      if (res?.data.status === "success") {
        toast.success("লগ ইন সফল হয়েছে!");
        setIsSignedIn(true);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("userType", loginStatus);
        setUserFlags(loginStatus);
        navigate(`/dashboard/${loginStatus}`);
      }
    } catch (error) {
      toast.warning(error?.response?.data?.message || "লগ ইন ব্যর্থ হয়েছে!");
      console.error("Login error:", error);
    } finally {
      setButtonSpin(false);
      setLoading(false);
    }
  };

  const setUserFlags = (type) => {
    setDivComLogin(false);
    setAdcLogin(false);
    setAcLandLogin(false);
    setNagorikLogin(false);

    ["isDivCom", "isAdc", "isAcLand", "isNagorik"].forEach((key) =>
      localStorage.removeItem(key)
    );

    if (type === "nagorik") setNagorikLogin(true);
    else if (type === "divCom") setDivComLogin(true);
    else if (type === "adc") setAdcLogin(true);
    else if (type === "acLand") setAcLandLogin(true);

    if (typeof type === "string" && type.length > 0) {
      localStorage.setItem(
        `is${type.charAt(0).toUpperCase() + type.slice(1)}`,
        true
      );
    }
  };

  const signOut = () => {
    localStorage.clear();
    setUser(null);
    setIsSignedIn(false);
    setDivComLogin(false);
    setAdcLogin(false);
    setAcLandLogin(false);
    setNagorikLogin(false);
    toast.info("সাইন আউট !");
    navigate("/");
  };

  const register = async (formData) => {
    try {
      const res = await axiosPublic.post("/users", formData);
      return res.data;
    } catch (error) {
      console.error("Error during registration:", error);
      return { error: true };
    }
  };

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem("user");
    const storedType = localStorage.getItem("userType");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsSignedIn(true);
      setUserFlags(storedType);
    }
    setLoading(false);
  }, []);

  const authData = {
    signIn,
    register,
    signOut,
    isSignedIn,
    setIsSignedIn,
    setUser,
    user,
    isLoading,
    setLoading,
    isDivComLogin,
    isAcLandLogin,
    isAdcLogin,
    isNagorikLogin,
    isButtonSpin,
    setButtonSpin,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

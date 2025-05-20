import React, { createContext, useContext, useEffect, useState } from "react";
import axiosPublic from "../axios/axiosPublic";
import { useNavigate } from "react-router";
import { toast } from "sonner";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigation = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
    const [isButtonSpin,setButtonSpin]=useState(false)

  // signin
  const signIn = async (formData) => {
    setButtonSpin(true)
    setLoading(true)
    try {
      const res = await axiosPublic.post("/login", formData);
      if (res.status === 200) {
        toast.success("লগ ইন  সফল হয়েছে!");
        setIsSignedIn(true);
        setUser(res.data.user);
        navigation("/dashboard");
        setLoading(false);
        setButtonSpin(false)
        // ✅ Save user in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.warning("লগ ইন ব্যার্থ হয়েছে!");
              setButtonSpin(false)
              setLoading(false)

    }
  };

  // signout
  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem("user");
    setLoading(false);
    toast.info("সাইন আউট !");
  };
  // register
  const resigter =  (formData) => {
    const res =  axiosPublic.post("/register", formData);
    setLoading(true)
    setButtonSpin(true)
    res
      .then((response) => {
        if (response.data.insertedId) {
          toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
          navigation("/");
          setLoading(false);
          setButtonSpin(false)
        }
        if (response.data.message === "user already exist") {
          toast.warning("এই আইডি দিয়ে আগে থেকেই রেজিস্টার্ড, লগইন করুন");
          navigation("/login");
          setLoading(false);
          setButtonSpin(false)
        }
      })
      .catch((error) => {
        toast.warning("রেজিস্ট্রেশন ব্যার্থ হয়েছে!");
              setButtonSpin(false)
                        setLoading(false);

        console.error("Error during registration:", error);
      });
  };

  useEffect(() => {
    // ✅ Load user from localStorage if exists

    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsSignedIn(true);
      setLoading(false);
    } else {
      setLoading(false);
      navigation("/");
    }
    const getUser = async () => {
      const email = JSON.parse(storedUser)?.email;
      const res = await axiosPublic.get(`/users/${email}`);
      // console.log(res.data);
      if (res.data?.role === "Admin") {
        setAdmin(true);
      }
      console.log(isAdmin);
    };

    getUser();
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
    isAdmin,
    isButtonSpin,
    setButtonSpin
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosPublic from "../axios/axiosPublic";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigation = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [isButtonSpin, setButtonSpin] = useState(false);

  // signin
  const signIn = async (formData) => {
    setButtonSpin(true);
    setLoading(true);
    try {
      const res = await axiosPublic.post("/login", formData);
      if (res.status === 200) {
        toast.success("লগ ইন  সফল হয়েছে!");
        setIsSignedIn(true);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setButtonSpin(false);

        const isUserAdmin = await checkAdmin(res.data.user.email);
        if (isUserAdmin) {
          navigation("/dashboard");
        } else {
          navigation("/"); // or another page for regular users
        }

        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.warning("লগ ইন ব্যার্থ হয়েছে!");
      setButtonSpin(false);
      setLoading(false);
    }
  };

  // signout
  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setUser(null);
    setIsSignedIn(false);
    setAdmin(false); // ✅ Reset isAdmin
    setLoading(false);

    toast.info("সাইন আউট !");
    navigation("/"); // optionally redirect to home or login
  };

  // register
  const resigter = (formData) => {
    const res = axiosPublic.post("/register", formData);
    setLoading(true);
    setButtonSpin(true);
    res
      .then((response) => {
        if (response.data.insertedId) {
          toast.success(
            "রেজিস্ট্রেশন সফল হয়েছে, আইডি ভেরিফাই করতে এডমিনের সাথে যোগাযোগ করুন"
          );
          navigation("/");
          setLoading(false);
          setButtonSpin(false);
        }
        if (response.data.message === "user already exist") {
          toast.warning("এই আইডি দিয়ে আগে থেকেই রেজিস্টার্ড, লগইন করুন");
          navigation("/login");
          setLoading(false);
          setButtonSpin(false);
        }
      })
      .catch((error) => {
        toast.warning("রেজিস্ট্রেশন ব্যার্থ হয়েছে!");
        setButtonSpin(false);
        setLoading(false);

        console.error("Error during registration:", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsSignedIn(true);
      checkAdmin(parsedUser.email);
      setLoading(false);
    } else {
      setLoading(false);
      navigation("/");
    }
  }, []);

  const checkAdmin = async (email) => {
    try {
      const res = await axiosPublic.get(`/users/${email}`);
      if (res.data?.role === "Admin") {
        setAdmin(true);
        localStorage.setItem("isAdmin", true);
        return true;
      } else {
        setAdmin(false);
        localStorage.removeItem("isAdmin");
        return false;
      }
    } catch (error) {
      console.error("Error checking admin:", error);
      return false;
    }
  };

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
    setButtonSpin,
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

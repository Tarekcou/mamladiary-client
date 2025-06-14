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

    // ✅ Wait for the admin check before proceeding
    console.log(formData);
    const isUserAdmin = await checkAdmin(formData.dnothiId);
    console.log(isUserAdmin);
    if (!isUserAdmin) {
      toast.warning("অনুগ্রহপূর্বক এডমিন এর সাথে যোগাযোগ করুন");
      setButtonSpin(false);
      setLoading(false);

      return;
    }

    try {
      const res = await axiosPublic.post("/login", formData);

      if (res.status === 200) {
        toast.success("লগ ইন সফল হয়েছে!");
        setIsSignedIn(true);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Admin already checked, so no need to check again here
        navigation("/dashboard");

        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.warning("লগ ইন ব্যর্থ হয়েছে!");
    } finally {
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
      checkAdmin(parsedUser.dnothiId);
      setLoading(false);
    } else {
      setLoading(false);
      navigation("/");
    }
  }, []);

  const checkAdmin = async (dnothiId) => {
    console.log("Checking admin status for DNothi ID:", dnothiId);
    try {
      const res = await axiosPublic.get(`/users/${dnothiId}`);
      console.log("Admin check response:", res.data);
      if (res.data?.isAdmin) {
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

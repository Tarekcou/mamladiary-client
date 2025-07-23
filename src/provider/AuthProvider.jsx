import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosPublic from "../axios/axiosPublic";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigation = useNavigate();
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
  console.log(loginStatus)
  try {
    let res;
    // const role=loginStatus=="divCom"?"DivCom":loginStatus=="dcOffice"?"DC":"acLand"
    if (loginStatus === "nagorik") {
      res = await axiosPublic.post("/nagorikLogin", formData);
    } else {
      res = await axiosPublic.post("/users/login", formData, {
  params: { loginStatus },
});

    } 

    if (res?.data.status === "success") {
      toast.success("লগ ইন সফল হয়েছে!");

      setIsSignedIn(true);
      setUser(res.data.user);

      // Save user + type
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userType", loginStatus);

      setUserFlags(loginStatus); // set booleans

      navigation(`/dashboard/${loginStatus}`);
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

  localStorage.removeItem("isDivCom");
  localStorage.removeItem("isAdc");
  localStorage.removeItem("isAcLand");
  localStorage.removeItem("isNagorik");

  if (type === "nagorik") {
    setNagorikLogin(true);
    localStorage.setItem("isNagorik", true);
  } else if (type === "DivCom") {
    setDivComLogin(true);
    localStorage.setItem("isDivCom", true);
  } else if (type === "DC") {
    setAdcLogin(true);
    localStorage.setItem("isAdc", true);
  } else if (type === "Acland") {
    setAcLandLogin(true);
    localStorage.setItem("isAcLand", true);
  }
};


  // signout
  const signOut = () => {
  localStorage.clear();
  setUser(null);
  setIsSignedIn(false);
  setDivComLogin(false);
  setAdcLogin(false);
  setAcLandLogin(false);
  setNagorikLogin(false);
  toast.info("সাইন আউট !");
  navigation("/");
};

  // register
  const resigter = (formData) => {
    const res = axiosPublic.post("/nagorikRegister", formData);
    setLoading(true);
    setButtonSpin(true);
    res
      .then((response) => {
        if (response.data.insertedId) {
          toast.success(
            "রেজিস্ট্রেশন সফল হয়েছে,  ভেরিফাই করতে এডমিনের সাথে যোগাযোগ করুন"
          );
          // navigation("/");
          setLoading(false);
          setButtonSpin(false);
        }
        if (response.data.message === "user already exist") {
          toast.warning("এই আইডি আগে থেকেই রেজিস্টার্ড, লগইন করুন");
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
  const storedType = localStorage.getItem("userType");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
    setIsSignedIn(true);
    setUserFlags(storedType); // Restore user-type flags
  }

  setLoading(false);
}, []);

  const checkUser=()=>{
     if(isNagorikLogin){
          localStorage.setItem("isNagorik",true)
        }
        else if(isAcLandLogin) localStorage.setItem("isAcLand",true)
        else if(isAdcLogin) localStorage.setItem("isAdc",true)
        else if(isDivComLogin) localStorage.setItem("isDivCom",true)
        
  }


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
    // isAdmin,
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

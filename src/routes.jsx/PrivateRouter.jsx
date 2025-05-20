import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Navigate, useLoaderData, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading";

const PrivateRouter = ({ children }) => {
  const { user, isLoading, setLoading, isAdmin } = useContext(AuthContext);
  // const key=import.meta.env.VITE_apiKey
  // (key)

  const location = useLocation();
  // (location);
  if (isLoading) return <Loading />;
  if (user && isAdmin) return children;
  return <Navigate state={location.pathname} to={"/"}></Navigate>;
};

export default PrivateRouter;

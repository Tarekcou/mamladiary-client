import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Navigate, useLoaderData, useLocation, useParams } from "react-router-dom";
import Loading from "../components/common/Loading";

const PrivateRouter = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  
  const location = useLocation();
const pathParts = location.pathname.split("/");
const officeType = pathParts.includes("login") ? pathParts[pathParts.length - 1] : "nagorik"; // fallback

  
  if (isLoading) return <Loading />;
  if (user?.email || user?.uid) return children;

  return <Navigate to={`/login/${officeType}`} state={{ from: location }} replace />

};

export default PrivateRouter;

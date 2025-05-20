import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./style.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import CauseList from "./pages/CauseList.jsx";
import MainLayout from "./Layout/MainLayout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
import PrivateRouter from "./routes.jsx/PrivateRouter.jsx";

import MamlaUploadForm from "./pages/dashboard/MamlaUploadForm.jsx";
import AllMamla from "./pages/dashboard/AllMamla.jsx";
import AdcMamlaUploadForm from "./pages/dashboard/AdcMamlaUploadForm.jsx";
import ManageUser from "./pages/dashboard/ManageUser.jsx";
import { Toaster, toast } from "sonner";
import AdcMamla from "./pages/dashboard/AdcMamla.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Complain from "./components/sidebar/Complain.jsx";
import Opinion from "./components/sidebar/Opinion.jsx";
const queryClient = new QueryClient();
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <QueryClientProvider  client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/causelist" element={<CauseList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/complain"
              element={
                <Complain />
              }
            ></Route>
            <Route
              path="/opinion"
              element={
                <Opinion />
              }
            ></Route>
            {/* dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRouter>
                  <Dashboard />
                </PrivateRouter>
              }
            ></Route>
            <Route
              path="/dashboard/mamlaUpload"
              element={
                <PrivateRouter>
                  <MamlaUploadForm />
                </PrivateRouter>
              }
            ></Route>
            <Route
              path="/dashboard/allMamla"
              element={
                <PrivateRouter>
                  <AllMamla />
                </PrivateRouter>
              }
            ></Route>

            <Route
              path="/dashboard/allAdcMamla"
              element={
                <PrivateRouter>
                  <AdcMamla />
                </PrivateRouter>
              }
            ></Route>
            <Route
              path="/dashboard/adcMamlaUpload"
              element={
                <PrivateRouter>
                  <AdcMamlaUploadForm />
                </PrivateRouter>
              }
            ></Route>
            <Route
              path="/dashboard/allUsers"
              element={
                <PrivateRouter>
                  <ManageUser />
                </PrivateRouter>
              }
            ></Route>


            {/* SIdebar  */}


            
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <Toaster richColors position="top-right" />
  </QueryClientProvider>
);

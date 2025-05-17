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
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import MamlaUploadForm from "./pages/dashboard/MamlaUploadForm.jsx";
import AllMamla from "./pages/dashboard/AllMamla.jsx";
import AdcMamlaUploadForm from "./pages/dashboard/AdcMamlaUploadForm.jsx";
import AdcMamla from "./pages/dashboard/ADCMamla.jsx";

const queryClient = new QueryClient();
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/causelist" element={<CauseList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* dashboard */}
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route
              path="/dashboard/mamlaUpload"
              element={<MamlaUploadForm />}
            ></Route>
            <Route path="/dashboard/allMamla" element={<AllMamla />}></Route>

            <Route path="/dashboard/allAdcMamla" element={<AdcMamla />}></Route>
            <Route
              path="/dashboard/adcMamlaUpload"
              element={<AdcMamlaUploadForm />}
            ></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

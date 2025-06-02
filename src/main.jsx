import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./style.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
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
import ComplainDetails from "./pages/dashboard/ComplainDetails.jsx";
import FeedbackDetails from "./pages/dashboard/FeedbackDetails.jsx";
import CitizenCharter from "./components/sidebar/CitizenCharter.jsx";
import Calendar from "./components/sidebar/Calendar.jsx";
import History from "./components/sidebar/History.jsx";
import Rules from "./components/sidebar/Rules.jsx";
import Gallery from "./components/sidebar/Gallery.jsx";
import CauseListDashboard from "./pages/dashboard/CauseListDashboard.jsx";
import MonthlyReport from "./pages/dashboard/MonthlyReport/MonthlyReport.jsx";
import CauseList from "./components/home/CauseList.jsx";
import Home from "./components/home/Home.jsx";
import Complain from "./components/home/Complain.jsx";
import Opinion from "./components/home/Opinion.jsx";
import { Contact } from "lucide-react";
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
            <Route
              path="/dashboard/causeList"
              element={
                <PrivateRouter>
                  <CauseListDashboard />
                </PrivateRouter>
              }
            ></Route>
            <Route
              path="/dashboard/complain"
              element={
                <PrivateRouter>
                  <ComplainDetails />
                </PrivateRouter>
              }
            ></Route>
            <Route
              path="/dashboard/feedback"
              element={
                <PrivateRouter>
                  <FeedbackDetails />
                </PrivateRouter>
              }
            ></Route>
            <Route
              path="/dashboard/monthlyReport"
              element={
                <PrivateRouter>
                  <MonthlyReport />
                </PrivateRouter>
              }
            ></Route>

            {/* SIdebar  */}

            <Route path="/history" element={<History />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/citizenCharter" element={<CitizenCharter />}></Route>
            <Route path="/rules" element={<Rules />}></Route>
            <Route path="/complain" element={<Complain />}></Route>
            <Route path="/opinion" element={<Opinion />}></Route>
            <Route path="/gallery" element={<Gallery />}></Route>
            <Route path="/contacts" element={<Contact />}></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <Toaster richColors position="top-right" />
  </QueryClientProvider>
);

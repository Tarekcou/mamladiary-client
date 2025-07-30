import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./style.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./Layout/MainLayout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./provider/AuthProvider.jsx";
import PrivateRouter from "./routes.jsx/PrivateRouter.jsx";

import MamlaUploadForm from "./pages/DivCom/mamlas/MamlaUploadForm.jsx";
import { Toaster, toast } from "sonner";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import ComplainDetails from "./pages/DivCom/ComplainDetails.jsx";
import FeedbackDetails from "./pages/DivCom/FeedbackDetails.jsx";
import CitizenCharter from "./components/sidebar/CitizenCharter.jsx";
import History from "./components/sidebar/History.jsx";
import Gallery from "./components/sidebar/Gallery.jsx";
import CauseListDashboard from "./pages/DivCom/CauseListDashboard.jsx";
import MonthlyReport from "./pages/DivCom/MonthlyReport/MonthlyReport.jsx";
import CauseList from "./components/home/CauseList.jsx";
import Home from "./components/home/Home.jsx";
import Complain from "./components/home/Complain.jsx";
import Opinion from "./components/home/Opinion.jsx";
import { Contact } from "lucide-react";
import Calendar from "./components/home/Calendar.jsx";
import Rules from "./components/home/Rules.jsx";
import ManageDivComUser from "./pages/DivCom/users/ManageDivComUser.jsx";
import ManageAdcUser from "./pages/DivCom/users/ManageAdcUser.jsx";
import ManageACLandUser from "./pages/DivCom/users/ManageACLandUser.jsx";
import NagorikDashboard from "./pages/Nagorik/NagorikDashboard.jsx";
import AcLandDashboard from "./pages/AcLand/AcLandDashboard.jsx";
import DashboardLayout from "./Layout/DashboardLayout.jsx";
import AdcDashboard from "./pages/Adc/AdcDashboard.jsx";
import DivComDashboard from "./pages/DivCom/DivComDashboard.jsx";
import AddUsers from "./pages/DivCom/users/AddUsers.jsx";
import AllMamla from "./pages/DivCom/mamlas/AllMamla.jsx";
import AdcMamlaUploadForm from "./pages/DivCom/mamlas/AdcMamlaUploadForm.jsx";
import AdcMamla from "./pages/DivCom/mamlas/AdcMamla.jsx";
import NagorikCaseInfoUpload from "./pages/Nagorik/NagorikCaseInfoUpload.jsx";
import AllCases from "./pages/AcLand/AllCases.jsx";
import NewCase from "./pages/AcLand/NewCase.jsx";
import AddAdcOrder from "./pages/Adc/AddAdcOrder.jsx";
import CaseDetails from "./pages/AcLand/CaseDetails.jsx";
const queryClient = new QueryClient();
const root = document.getElementById("root");

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {/* Router context is available here */}
      <AuthProvider> {/* ✅ This now has Router context */}
        <Routes>
          {/* MAIN LAYOUT ROUTES */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/causelist" element={<CauseList />} />
            <Route path="/:officeType/login" element={<Login />} />
            <Route path="/login/:officeType" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={<History />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/citizenCharter" element={<CitizenCharter />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/complain" element={<Complain />} />
            <Route path="/opinion" element={<Opinion />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contacts" element={<Contact />} />
          </Route>

          {/* DASHBOARD ROUTES */}
          <Route
            path="/dashboard"
            element={
              <PrivateRouter>
                <DashboardLayout />
              </PrivateRouter>
            }
          >
            <Route path="divCom" element={<DivComDashboard />} />
              <Route path="mamlaUpload" element={<MamlaUploadForm />} />
              <Route path="allMamla" element={<AllMamla />} />
              <Route path="allAdcMamla" element={<AdcMamla />} />
              <Route path="adcMamlaUpload" element={<AdcMamlaUploadForm />} />
              <Route path="addUsers" element={<AddUsers />} />
              <Route path="divComUsers" element={<ManageDivComUser />} />
              <Route path="adcUsers" element={<ManageAdcUser />} />
              <Route path="acLandUsers" element={<ManageACLandUser />} />
              <Route path="causeList" element={<CauseListDashboard />} />
              <Route path="complain" element={<ComplainDetails />} />
              <Route path="feedback" element={<FeedbackDetails />} />
              <Route path="monthlyReport" element={<MonthlyReport />} />



              
            {/* OTHER DASHBOARD ROLES */}
            <Route path="nagorik" element={<NagorikDashboard />} />
             
            <Route path="nagorik/caseUpload" element={<NagorikCaseInfoUpload />} />
            <Route path="nagorik/mamla" element={<AllCases />} />





            <Route path="divCom/allCases" element={<AllCases />} />
            <Route path="divCom/cases/edit/:id" element={<NewCase />} />
            <Route path="divCom/cases/newOrder/:id" element={<AddAdcOrder />} />
            <Route path="divCom/cases/:id" element={<CaseDetails />} />
            <Route
              path="divCom/cases/order/edit/:id"
              element={<AddAdcOrder />}
            />

            <Route path="adc" element={<AdcDashboard />} />
            <Route path="adc/allCases" element={<AllCases />} />
            <Route path="adc/cases/newOrder/:id" element={<AddAdcOrder />} />
            <Route path="adc/sendCases" element={<AllCases />} />
            <Route path="adc/cases/edit/:id" element={<NewCase />} />
            <Route path="adc/cases/order/edit/:id" element={<AddAdcOrder />} />
            <Route path="adc/cases/:id" element={<CaseDetails />} />

            <Route path="acLand" element={<AcLandDashboard />} />
            <Route path="acLand/newCase" element={<NewCase />} />
            <Route path="acLand/allCases" element={<AllCases />} />
            <Route path="acLand/cases/newOrder/:id" element={<AddAdcOrder />} />

            <Route path="acLand/sendCases" element={<AllCases />} />
            <Route path="acLand/cases/:id" element={<CaseDetails />} />
            <Route path="acLand/cases/edit/:id" element={<NewCase />} />

            
          </Route>
        </Routes>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);





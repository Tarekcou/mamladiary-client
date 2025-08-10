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

import { Toaster, toast } from "sonner";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import ComplainDetails from "./pages/divCom/ComplainDetails.jsx";
import FeedbackDetails from "./pages/divCom/FeedbackDetails.jsx";
import CitizenCharter from "./components/sidebar/CitizenCharter.jsx";
import History from "./components/sidebar/History.jsx";
import Gallery from "./components/sidebar/Gallery.jsx";
import CauseListDashboard from "./pages/divCom/CauseListDashboard.jsx";
import MonthlyReport from "./pages/divCom/MonthlyReport/MonthlyReport.jsx";
import CauseList from "./components/home/CauseList.jsx";
import Home from "./components/home/Home.jsx";
import Complain from "./components/home/Complain.jsx";
import Opinion from "./components/home/Opinion.jsx";
import { Contact } from "lucide-react";
import Calendar from "./components/home/Calendar.jsx";
import Rules from "./components/home/Rules.jsx";
import ManageDivComUser from "./pages/divCom/users/ManageDivComUser.jsx";
import ManageAdcUser from "./pages/divCom/users/ManageAdcUser.jsx";
import ManageACLandUser from "./pages/divCom/users/ManageACLandUser.jsx";
import NagorikDashboard from "./pages/Nagorik/NagorikDashboard.jsx";
import AcLandDashboard from "./pages/AcLand/AcLandDashboard.jsx";
import DashboardLayout from "./Layout/DashboardLayout.jsx";
import AdcDashboard from "./pages/Adc/AdcDashboard.jsx";
import DivComDashboard from "./pages/divCom/DivComDashboard.jsx";
import AddUsers from "./pages/divCom/users/AddUsers.jsx";
import AllMamla from "./pages/divCom/mamlas/AllMamla.jsx";
import AdcMamlaUploadForm from "./pages/divCom/mamlas/AdcMamlaUploadForm.jsx";
import AdcMamla from "./pages/divCom/mamlas/AdcMamla.jsx";
import NagorikCaseInfoUpload from "./pages/Nagorik/NagorikCaseInfoUpload.jsx";
import NewCase from "./pages/divCom/cases/NewCase.jsx";
import MyMamla from "./pages/Nagorik/MyMamla.jsx";
import NewOrder from "./pages/divCom/cases/NewOrder.jsx";
import AllCasesList from "./pages/divCom/cases/AllCasesList.jsx";
import AllDetails from "./pages/divCom/cases/AllDetails.jsx";
import DivComOrders from "./pages/divCom/cases/DivComOrders.jsx";
import MamlaUploadForm from "./pages/divCom/mamlas/MamlaUploadForm.jsx";

const queryClient = new QueryClient();
const root = document.getElementById("root");

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {/* Router context is available here */}
      <AuthProvider>
        {" "}
        {/* ✅ This now has Router context */}
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
            <Route path="adc" element={<AdcDashboard />} />
            <Route path="acLand" element={<AcLandDashboard />} />
            <Route path="lawyer" element={<NagorikDashboard />} />
            <Route
              path="lawyer/caseUpload"
              element={<NagorikCaseInfoUpload />}
            />
            <Route path="lawyer/cases" element={<MyMamla />} />
            <Route
              path="lawyer/cases/edit/:id"
              element={<NagorikCaseInfoUpload />}
            />
            <Route path=":role/cases/:id" element={<AllDetails />} />
            <Route path=":role/cases/new" element={<NewCase />} />
            <Route path=":role/cases/edit/:id" element={<NewCase />} />

            <Route path=":role/cases/order/edit/:id" element={<NewOrder />} />
            <Route path=":role/cases/order/:id" element={<DivComOrders />} />

            <Route path=":role/allCases" element={<MyMamla />} />
          </Route>
        </Routes>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

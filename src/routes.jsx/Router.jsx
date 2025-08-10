// router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DashboardLayout from "../Layout/DashboardLayout";
import MainLayout from "../Layout/MainLayout";

import Home from "../components/home/Home";
import CauseList from "../components/home/CauseList";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import History from "../components/sidebar/History";
import Calendar from "../components/home/Calendar";
import CitizenCharter from "../components/sidebar/CitizenCharter";
import Rules from "../components/home/Rules";
import Complain from "../components/home/Complain";
import Opinion from "../components/home/Opinion";
import Gallery from "../components/sidebar/Gallery";
import { Contact } from "lucide-react";

// Dashboard pages
import PrivateRouter from "./PrivateRouter";
import Dashboard from "../pages/dashboard/Dashboard";
import MamlaUploadForm from "../pages/dashboard/MamlaUploadForm";
import AllMamla from "../pages/dashboard/AllMamla";
import AdcMamlaUploadForm from "../pages/dashboard/AdcMamlaUploadForm";
import AdcMamla from "../pages/dashboard/AdcMamla";
import ManageDivComUser from "../pages/dashboard/ManageDivComUser";
import ManageAdcUser from "../pages/dashboard/ManageAdcUser";
import ManageACLandUser from "../pages/dashboard/ManageACLandUser";
import CauseListDashboard from "../pages/dashboard/CauseListDashboard";
import ComplainDetails from "../pages/dashboard/ComplainDetails";
import FeedbackDetails from "../pages/dashboard/FeedbackDetails";
import MonthlyReport from "../pages/dashboard/MonthlyReport/MonthlyReport";
import NagorikDashboard from "../pages/nagorik/NagorikDashboard";
import AdcDashboard from "../pages/adc/AdcDashboard";
import AcLandDashboard from "../pages/acLand/AcLandDashboard";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "causelist", element: <CauseList /> },
      { path: "login/:officeType", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "history", element: <History /> },
      { path: "calendar", element: <Calendar /> },
      { path: "citizenCharter", element: <CitizenCharter /> },
      { path: "rules", element: <Rules /> },
      { path: "complain", element: <Complain /> },
      { path: "opinion", element: <Opinion /> },
      { path: "gallery", element: <Gallery /> },
      { path: "contacts", element: <Contact /> },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout />
      </PrivateRouter>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "divCom", element: <Dashboard /> },
      { path: "divCom/mamlaUpload", element: <MamlaUploadForm /> },
      { path: "divCom/allMamla", element: <AllMamla /> },
      { path: "divCom/allAdcMamla", element: <AdcMamla /> },
      { path: "divCom/adcMamlaUpload", element: <AdcMamlaUploadForm /> },
      { path: "divCom/divComUsers", element: <ManageDivComUser /> },
      { path: "divCom/adcUsers", element: <ManageAdcUser /> },
      { path: "divCom/acLandUsers", element: <ManageACLandUser /> },
      { path: "divCom/causeList", element: <CauseListDashboard /> },
      { path: "divCom/complain", element: <ComplainDetails /> },
      { path: "divCom/feedback", element: <FeedbackDetails /> },
      { path: "divCom/monthlyReport", element: <MonthlyReport /> },

      // Office-based dashboards
      { path: "nagorik", element: <NagorikDashboard /> },
      { path: "dcOffice", element: <AdcDashboard /> },
      { path: "acLand", element: <AcLandDashboard /> },
    ],
  },
]);

export default router;

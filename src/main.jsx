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
import AuthForm from "./components/AuthForm.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

const queryClient = new QueryClient();
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/causelist" element={<CauseList />} />
          <Route path="/authForm" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

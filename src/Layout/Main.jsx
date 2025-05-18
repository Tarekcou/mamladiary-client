import { useEffect, useState } from "react";
import Header from "../components/Header";
import SidebarLeft from "../components/SidebarLeft";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router";
import DashboardSidebar from "../pages/dashboard/DashboardSidebar";

const MainLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative mx-auto w-11/12 md:w-10/12">
      <Header />

      <div className="flex mt-4 min-h-screen">
        {/* SidebarLeft: scrolls initially, then becomes fixed */}
        <div
          className={`hidden lg:block ${
            path.includes("dashboard") ? "w-44" : "w-44"
          }  ${
            isSticky
              ? "fixed top-16 z-40 bg-white shadow-md h-[calc(100vh-2rem)] overflow-y-auto"
              : "relative shadow-md"
          }`}
        >
          {/* Only show SidebarLeft on specific routes */}
          {path.includes("dashboard") ? <DashboardSidebar /> : <SidebarLeft />}
        </div>

        {/* Main Content */}
        <main className={`flex-1 lg:pl-4 ${isSticky ? "lg:ml-44" : ""}`}>
          <Outlet />
        </main>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;

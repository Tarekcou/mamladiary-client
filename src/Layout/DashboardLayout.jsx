// DashboardLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import SidebarNagorik from "../pages/nagorik/SidebarNagorik";
import SidebarAcLand from "../pages/acLand/SidebarAcLand";
import SidebarAdc from "../pages/adc/SidebarAdc";
import SidebarDivCom from "../pages/divCom/others/SidebarDivCom";

const DashboardLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storedType = localStorage.getItem("userType");
  useEffect(() => {
    const handleScroll = () => setIsSticky(true);
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const layoutWidth = screenWidth * (10 / 12);
  const sidebarWidth = layoutWidth * (2 / 12);
  const mainWidth = layoutWidth * (10 / 12);
  return (
    <div className="flex flex-col shadow-xl mx-auto w-full md:w-10/12 min-h-screen">
      <Navbar />

      <div className="relative flex flex-grow">
        {/* Sidebar */}
        <div
          className="hidden lg:block top-16 z-40 sticky shadow-md overflow-y-auto"
          style={{
            width: `${sidebarWidth}px`,
            height: "calc(100vh - 4rem)", // 4rem = 64px navbar height
          }}
        >
          {storedType === "divCom" ? (
            <SidebarDivCom />
          ) : storedType === "nagorik" ? (
            <SidebarNagorik />
          ) : storedType === "adc" ? (
            <SidebarAdc />
          ) : (
            <SidebarAcLand />
          )}
        </div>

        {/* Main content */}
        <main className="flex-grow md:w-10/12 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

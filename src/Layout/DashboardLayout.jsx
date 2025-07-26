// DashboardLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import SidebarNagorik from "../pages/Nagorik/SidebarNagorik";
import SidebarAdc from "../pages/adc/SidebarAdc";
import SidebarAcLand from "../pages/AcLand/SidebarAcLand";
import SidebarDivCom from "../pages/divCom/SidebarDivCom";

const DashboardLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storedType = localStorage.getItem("userType");

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 260);
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
      {/* <Header /> */}
      <Navbar />

      <div className="relative flex flex-grow">
        <div
          className={`hidden lg:block   ${
            isSticky
              ? "fixed top-16 scroll-py-10 z-40 shadow-md h-full"
              : "relative  mt-1 shadow-md"
          }`}
          style={{
            width: `${sidebarWidth}px`,
          }}
        >
          {storedType == "divCom" ? (
            <SidebarDivCom />
          ) : storedType == "nagorik" ? (
            <SidebarNagorik />
          ) : storedType == "adc" ? (
            <SidebarAdc />
          ) : (
            <SidebarAcLand />
          )}

          {/* {path.includes("dashboard") ? <DashboardSidebar /> : <SidebarLeft />} */}
        </div>

        {isSticky && (
          <div
            className="hidden lg:block"
            style={{
              width: `${sidebarWidth}px`,
              height: "calc(100vh - 64px)", // Adjust for header height
            }}
          />
        )}

        {/* for mobile device navbar menu take space */}
        {/* <div className="md:hidden sm:h-[600px]"></div> */}

        <main className={` md:w-10/12 `}>
          <Outlet />
        </main>
      </div>
      {/* Contact/OPinion Form */}

      <div className="z-60">{/* <Footer /> */}</div>
    </div>
  );
};

export default DashboardLayout;

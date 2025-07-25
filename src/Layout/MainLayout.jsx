import { useEffect, useState } from "react";
import SidebarLeft from "../components/sidebar/SidebarLeft";
import Footer from "../components/common/Footer";
import { Outlet, useLocation } from "react-router";
import bgimage from "../assets/bg-image.jpg";
import Opinion from "../components/home/Opinion";
import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";

const MainLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const path = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      
      <Hero />
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
          <SidebarLeft />

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

      <div className="z-60">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;

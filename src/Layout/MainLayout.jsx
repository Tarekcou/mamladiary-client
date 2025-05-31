import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import SidebarLeft from "../components/sidebar/SidebarLeft";
import Footer from "../components/common/Footer";
import { Outlet, useLocation } from "react-router";
import DashboardSidebar from "../pages/dashboard/DashboardSidebar";
import bgimage from "../assets/bg-image.jpg";

const MainLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const path = location.pathname;

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
      <Header />

      <div className="relative flex flex-grow gap-4">
        <div
          className={`hidden md:block ${
            isSticky
              ? "fixed top-18 scroll-py-10 z-40 shadow-md h-full"
              : "relative mt-1 shadow-md"
          }`}
          style={{
            width: `${sidebarWidth}px`,
          }}
        >
          {path.includes("dashboard") ? <DashboardSidebar /> : <SidebarLeft />}
        </div>

        {isSticky && (
          <div
            style={
              isSticky && window.innerWidth >= 1024
                ? { width: `${sidebarWidth}px` }
                : {}
            }
          />
        )}

        <main
          className={`flex-grow ${
            path.includes("dashboard") ? "lg:w-10/12" : "lg:w-10/12"
          }`}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;

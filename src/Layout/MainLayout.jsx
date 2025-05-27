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
    const handleScroll = () => setIsSticky(window.scrollY > 150);
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
    <div className="mx-auto w-11/12 lg:w-10/12">
      <Header />

      <div className="relative flex gap-4 mt-4">
        <div
          className={`hidden lg:block ${
            isSticky
              ? "fixed top-24 scroll-py-10 z-40 shadow-md h-full"
              : "lg:w-2/12  mt-2 relative shadow-md"
          }`}
          style={
            isSticky && window.innerWidth >= 1024
              ? { width: `${sidebarWidth}px` }
              : {}
          }
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

        {/* ✅ Wrap Outlet with AnimatePresence and motion.div */}
        <main
          className={` relative w-full min-h-screen lg:w-10/12 ${
            isSticky ? "" : ""
          }`}
        >
          <div>
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;

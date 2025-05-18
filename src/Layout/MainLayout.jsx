import { useEffect, useState } from "react";
import Header from "../components/Header";
import SidebarLeft from "../components/SidebarLeft";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router";
import DashboardSidebar from "../pages/dashboard/DashboardSidebar";

const MainLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const path = location.pathname;
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const layoutWidth = screenWidth * (10 / 12); // 10/12 of screen
  const sidebarWidth = layoutWidth * (2 / 12); // 2/12 of layout (i.e., 2/12 of 10/12 of screen)
  const mainWidth = layoutWidth * (10 / 12); // 10/12 of layout
  console.log(sidebarWidth);

  return (
    <div className="mx-auto w-11/12 lg:w-10/12">
      <Header />

      <div className="relative flex gap-4 mt-4 min-h-screen">
        {/* SidebarLeft */}
        <div
          className={`hidden lg:block ${
            isSticky
              ? "fixed top-24 z-40 shadow-md h-full"
              : "lg:w-2/12 mt-2 relative shadow-md"
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
        {/* Main Content */}
        <main className={` w-full lg:w-10/12   ${isSticky ? "" : ""}`}>
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

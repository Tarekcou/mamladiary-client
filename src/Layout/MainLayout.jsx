import { useEffect, useState } from "react";
import Header from "../components/Header";
import SidebarLeft from "../components/SidebarLeft";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const MainLayout = () => {
  const [isSticky, setIsSticky] = useState(false);

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
    <div className="relative mx-auto w-10/12">
      <Header />

      <div className="flex mt-4 min-h-screen">
        {/* SidebarLeft: scrolls initially, then becomes fixed */}
        <div
          className={`w-64 ${
            isSticky
              ? "fixed top-16 z-40 bg-white shadow-md h-[calc(100vh-2rem)] overflow-y-auto"
              : "relative shadow-md"
          }`}
        >
          <SidebarLeft />
        </div>

        {/* Main Content */}
        <main className={`flex-1 pl-4 ${isSticky ? "ml-64" : ""}`}>
          <Outlet />
        </main>
      </div>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;

import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import banner from "../assets/banner.jpg";
import menuImage from "../assets/menuImage.jpg";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isSticky, setIsSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "bn" : "en");
  };
  const originalNavTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 150);
    };

    const handleResize = () => {
      if (navRef.current) {
        originalNavTop.current = navRef.current.offsetTop;
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    // Initial nav height set
    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleSignIn = () => {};

  return (
    <header className="z-50 relative shadow-md w-full">
      {/* Banner */}
      <div
        className="bg-cover bg-center h-44"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="flex flex-col justify-center items-center bg-black/40 h-full text-white text-center">
          <h1 className="font-bold text-4xl">{t("title")}</h1>
          <h2 className="text-xl">{t("haeding")}</h2>
        </div>
      </div>

      {/* Dynamic Spacer */}
      {isSticky && (
        <div style={{ height: `${navHeight}px`, transition: "height 0.5s" }} />
      )}

      {/* Sticky Navbar */}
      <div
        className={`transition-all duration-500 ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 w-10/12 mx-auto shadow-sm"
            : "relative"
        }`}
      >
        <nav
          // style={{ backgroundImage: `url(${banner})` }}
          ref={navRef}
          className="flex justify-between items-center bg-gray-50 px-6 py-3 transition-all duration-300 ease-in-out"
        >
          <div className="flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 underline underline-offset-4 font-semibold"
                  : "text-gray-700"
              }
            >
              {t("Home")}
            </NavLink>
            {/* <NavLink
              to="/form"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 underline underline-offset-4 font-semibold"
                  : "text-gray-700"
              }
            >
              Form
            </NavLink> */}
            <NavLink
              to="/causelist"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 underline underline-offset-4 font-semibold"
                  : "text-gray-700"
              }
            >
              Cause List
            </NavLink>
          </div>
          <div className="space-x-2">
            <Link
              to={"/authForm"}
              onClick={handleSignIn}
              className="btn btn-sm"
            >
              Sign In
            </Link>
            <button onClick={toggleLanguage} className="btn btn-sm">
              {i18n.language === "en" ? "বাংলা" : "English"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

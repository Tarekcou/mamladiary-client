import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import banner from "../../assets/banner.jpg";
import menuImage from "../../assets/menuImage.jpg";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../provider/AuthProvider";
import SidebarLeft from "../sidebar/SidebarLeft";
import DashboardSidebar from "../../pages/dashboard/DashboardSidebar";
import bgimage from "../../assets/bg-image.jpg";
import { FaHome } from "react-icons/fa";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isSticky, setIsSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { signIn, resigter, isSignedIn, signOut, isAdmin } =
    useContext(AuthContext);

  const location = useLocation();
  const path = location.pathname;
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "bn" ? "en" : "bn");
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

  const handleLogout = () => {
    signOut();
    navigate("/");
  };
  const navMenu = (
    <>
      <div className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "  btn btn-sm btn-neutral  font-semibold"
              : " btn btn-sm "
          }
        >
          <div className="flex justify-center items-center gap-2">
            <FaHome />
            <p>{t("home")}</p>
          </div>
        </NavLink>

        <NavLink
          to="/causelist"
          className={({ isActive }) =>
            isActive
              ? "btn btn-sm btn-neutral underline-offset-4 font-semibold"
              : " btn btn-sm"
          }
        >
          {t("cause list")}
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "btn-neutral btn btn-sm  underline-offset-4 font-semibold"
                : " btn btn-sm"
            }
          >
            {t("dashboard")}
          </NavLink>
        )}
      </div>
    </>
  );
  const navMenuEnd = (
    <>
      <div className="space-x-2">
        {isSignedIn ? (
          <button onClick={handleLogout} className={"btn btn-sm text-red-600"}>
            {t("sign out")}
          </button>
        ) : (
          <NavLink
            to={"/login"}
            onClick={handleSignIn}
            className={({ isActive }) =>
              isActive
                ? "text-white btn-neutral btn btn-sm  underline-offset-4 font-semibold"
                : "btn btn-sm"
            }
          >
            {t("sign in")}
          </NavLink>
        )}
        <button onClick={toggleLanguage} className="btn btn-sm">
          {i18n.language === "en" ? "English" : "বাংলা"}
        </button>
      </div>
    </>
  );
  return (
    <header className="z-50 relative shadow-sm w-full">
      {/* Banner */}
      <div
        className="bg-cover bg-center h-44"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="flex flex-col justify-center items-center bg-black/40 h-full text-white text-center">
          <h1 className="font-bold text-xl md:text-2xl lg:text-4xl">
            {t("title")}
          </h1>
          <h2 className="text-sm lg:text-xl">{t("haeding")}</h2>
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
            ? "fixed top-0 left-0 right-0 z-50 lg:w-10/12 w-11/12 mx-auto shadow-sm"
            : "relative"
        }`}
      >
        <nav
          // style={{ backgroundImage: `url(${menuImage})` }}
          ref={navRef}
          className={`flex justify-between items-center bg-base-100 md:px-6  transition-all duration-300 ease-in-out navbar ${
            isSticky ? "shadow-sm" : ""
          }`}
        >
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="lg:hidden btn btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />{" "}
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="z-1 bg-base-100 mt-4 p-2 rounded-box w-84 menu menu-sm dropdown-content"
              >
                <div className="py-5">{navMenu}</div>
                {path.includes("dashboard") ? (
                  <DashboardSidebar />
                ) : (
                  <SidebarLeft />
                )}
              </ul>
            </div>

            <div className="hidden lg:hidden md:block">{navMenu}</div>
            {/* <a className="text-xl btn btn-ghost">daisyUI</a> */}
          </div>
          <div className="hidden lg:flex navbar-center">
            <ul className="px-1 menu menu-horizontal">{navMenu}</ul>
          </div>
          <div className="navbar-end">{navMenuEnd}</div>
        </nav>
      </div>
    </header>
  );
}

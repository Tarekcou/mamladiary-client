import { useContext, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import banner from "../../assets/banner.jpg";
import menuImage from "../../assets/menuImage.jpg";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../provider/AuthProvider";
import SidebarLeft from "../sidebar/SidebarLeft";
import DashboardSidebar from "../../pages/divCom/others/SidebarDivCom";
import bgimage from "../../assets/bg-image.jpg";
import { FaHome } from "react-icons/fa";
import Carousel from "./Hero";
import { MdDashboard } from "react-icons/md";
import { RiBookletLine } from "react-icons/ri";
import { handleOfficeName } from "../../utils/officeHelpers";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isSticky, setIsSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { officeType } = useParams();

  const {
    isSignedIn,
    signOut,
    isDivComLogin,
    isAcLandLogin,
    isAdcLogin,
    user,
    isNagorikLogin,
  } = useContext(AuthContext);

  // console.log(isAcLandLogin,isAdcLogin,isNagorikLogin)

  const location = useLocation();
  const path = location.pathname;
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "bn" ? "en" : "bn");
  };
  const originalNavTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 250);
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
  const handleSignIn = () => {
    document.getElementById("my_modal_2").showModal();
  };

  //login
  const handleOfficeLogin = (officeType) => {
    // Optional: save officeType to context or localStorage if needed
    // console.log("Selected office:", officeType);
    console.log(officeType);
    document.getElementById("my_modal_2").close();
    if (officeType == "nagorik") navigate(`/${officeType}/login`);
    else navigate(`/login/${officeType}`);
  };

  //log out
  const handleLogout = () => {
    signOut();
    navigate("/");
  };
  const navMenu = (
    <>
      <div className="flex justify-between gap-1 md:gap-4 w-full">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "  btn lg:btn-sm btn-neutral  font-semibold bg-[#004080]"
              : " btn lg:btn-sm border border-gray-300"
          }
        >
          <div className="flex justify-center items-center gap-2">
            <FaHome />
            <p>{t("home")}</p>
          </div>
        </NavLink>
        {path.includes("dashboard") ? (
          ""
        ) : (
          <NavLink
            to="/causelist"
            className={({ isActive }) =>
              isActive
                ? "btn lg:btn-sm btn-neutral underline-offset-4 font-semibold bg-[#004080]"
                : " btn lg:btn-sm border-gray-300"
            }
          >
            <div className="flex justify-center items-center gap-2">
              <RiBookletLine />

              <p>{t("cause list")}</p>
            </div>
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "btn-neutral btn lg:btn-sm underline-offset-4 font-semibold bg-[#004080] text-white"
                : "btn lg:btn-sm border border-gray-300"
            }
          >
            <div className="flex justify-center items-center gap-2">
              <MdDashboard />
              <p>{t("dashboard")}</p>
            </div>
          </NavLink>
        )}
      </div>
    </>
  );
  const navMenuEnd = (
    <>
      <div className="space-x-2">
        {isSignedIn ? (
          <div className="flex justify-center items-center gap-1">
            <h1 className="text-sm badge badge-soft badge-primary">
              {handleOfficeName(user?.officeName?.bn, user?.name, user.role)}
            </h1>

            <button
              onClick={handleLogout}
              className={"btn btn-sm border-gray-300 text-red-600"}
            >
              {t("sign out")}
            </button>
          </div>
        ) : (
          <div className="space-x-1">
            <NavLink
              to="/lawyer/login"
              onClick={(e) => {
                e.preventDefault();
                handleOfficeLogin("lawyer");
              }}
              className={({ isActive }) =>
                isActive
                  ? "btn btn-sm underline-offset-4 font-semibold btn-outline bg-[#004080] text-white"
                  : "btn btn-sm underline-offset-4 font-semibold btn-outline"
              }
            >
              নাগরিক লগিন
            </NavLink>

            <NavLink
              to="/login/dc" // or a general path
              onClick={(e) => {
                e.preventDefault();
                handleSignIn(); // you can call handleSignIn and navigate inside it
              }}
              className={({ isActive }) =>
                isActive
                  ? "btn btn-sm underline-offset-4 font-semibold btn-outline bg-[#004080] text-white"
                  : "btn btn-sm underline-offset-4 font-semibold btn-outline"
              }
            >
              দাপ্তরিক লগিন
            </NavLink>

            <NavLink
              to={"/register"}
              // onClick={handleSignIn}
              className={({ isActive }) =>
                isActive
                  ? " btn btn-sm  underline-offset-4 font-semibold btn-outline bg-[#004080] text-white"
                  : "btn btn-sm  underline-offset-4 font-semibold btn-outline "
              }
            >
              রেজিস্টার
            </NavLink>

            <dialog id="my_modal_2" className="modal">
              <div className="flex flex-col gap-2 w-full modal-box">
                <h3 className="mb-2 font-bold text-lg">অফিস নির্বাচন করুন</h3>
                <button
                  className="btn-outline btn"
                  onClick={() => handleOfficeLogin("divCom")}
                >
                  বিভাগীয় কমিশনার অফিস
                </button>
                <button
                  className="btn-outline btn"
                  onClick={() => handleOfficeLogin("adc")}
                >
                  জেলা প্রশাসকের কার্যালয়
                </button>
                <button
                  className="btn-outline btn"
                  onClick={() => handleOfficeLogin("acLand")}
                >
                  ভূমি অফিস
                </button>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        )}
        {/* <button onClick={toggleLanguage} className="btn btn-sm">
          {i18n.language === "en" ? "English" : "বাংলা"}
        </button> */}
      </div>
    </>
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="z-50 relative shadow-sm w-full">
      {/* Carousel replacing the static banner */}
      {/* <Carousel /> */}

      {/* Dynamic Spacer */}
      {isSticky && (
        <div style={{ height: `${navHeight}px`, transition: "height 0.5s" }} />
      )}

      {/* Sticky Navbar */}
      <div
        className={`transition-all duration-500 ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 lg:w-10/12 w-full mx-auto shadow-sm"
            : "relative"
        }`}
      >
        <nav
          // style={{ backgroundImage: `url(${menuImage})` }}
          ref={navRef}
          className={`flex justify-between items-center bg-gray-100 md:px-6  transition-all duration-300 ease-in-out navbar ${
            isSticky ? "shadow-sm" : ""
          }`}
        >
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="md:hidden btn btn-ghost"
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
                className="z-50 bg-gray-100 shadow-2xl m-0 mt-4 -ml-2 w-80 min-h-screen overflow-y-auto menu-sm dropdown-content"
              >
                <div className="p-2 w-full">{navMenu}</div>
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

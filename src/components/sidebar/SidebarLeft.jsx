import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router";
import { motion } from "framer-motion"; // For animation
import { MdWorkHistory } from "react-icons/md";
import { FaFileContract, FaRegHandshake } from "react-icons/fa";
import { BsFileEarmarkRuled } from "react-icons/bs";
import { FaCommentDots } from "react-icons/fa6";
import { MdContacts } from "react-icons/md";

import { FaCalendarAlt } from "react-icons/fa";
import { FaCommentMedical } from "react-icons/fa6";
import { ImHammer2 } from "react-icons/im";
import { LuAlignVerticalJustifyEnd } from "react-icons/lu";
import useScrollSpy from "../hooks/useScrollSpy"; // Adjust the path

import { GiInjustice } from "react-icons/gi";

export default function SidebarLeft() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentHash = location.hash;
  const sectionIds = ["calendar", "rules", "complain", "opinion", "contacts"];
  const activeId = useScrollSpy(sectionIds, 100); // 100px top offset

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileFocus="focused"
      className="bg-gray-100 h-full"
    >
      <div className="w-full h-full text-sm">
        <div>
          <div className="flex items-center gap-2 bg-[#004080] h-full text-start btn">
            <h2 className="flex items-center gap-2 py-2 w-full font-bold text-white text-xl">
              <GiInjustice />

              {t("the court")}
            </h2>
          </div>

          <ul className="space-y-1 p-2 text-start">
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-bold text-start"
                  : "text-gray-700 btn btn-sm w-full border-gray-300 font-bold text-start"
              }
            >
              <div className="flex items-center gap-2 w-full h-full">
                <MdWorkHistory className="text-base" />
                <span className="leading-none">{t("history")}</span>
              </div>
            </NavLink>

            <NavLink
              to={"/citizenCharter"}
              href="#"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                  : "text-gray-700 btn btn-sm w-full border-gray-300"
              }
            >
              <div className="flex items-center gap-2 w-full h-full">
                <FaRegHandshake className="text-base" />
                <p>{t("citizen charter")}</p>
              </div>
            </NavLink>
            <div className="hidden md:block space-y-1">
              <NavLink
                to={"/#calendar"}
                className={`btn btn-sm w-full menu-link scroll-mt-[100px]  ${
                  activeId === "calendar"
                    ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 w-full h-full">
                  <FaCalendarAlt />

                  {t("court calendar")}
                </div>
              </NavLink>

              <NavLink
                to={"/#rules"}
                className={`btn btn-sm w-full menu-link scroll-mt-[100px] ${
                  activeId === "rules"
                    ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 w-full h-full">
                  <BsFileEarmarkRuled />

                  {t("court rules")}
                </div>
              </NavLink>
            </div>
          </ul>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-2 bg-[#004080] h-full text-start btn">
            <h2 className="flex items-center gap-2 py-2 w-full font-bold text-white text-xl">
              <LuAlignVerticalJustifyEnd />

              {t("resources")}
            </h2>
          </div>

          <ul className="space-y-1 p-2 w-full">
            <NavLink
              to={"/#complain"}
              className={`btn btn-sm w-full   menu-link scroll-mt-[100px] ${
                activeId === "complain"
                  ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                  : "text-gray-700 border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 w-full h-full">
                <FaCommentDots />

                <p>{t("lodge your complaint")}</p>
              </div>
            </NavLink>

            <NavLink
              to="/#opinion"
              className={`btn btn-sm w-full menu-link scroll-mt-[100px] ${
                activeId === "opinion"
                  ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                  : "text-gray-700 border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 w-full h-full">
                <FaCommentMedical />

                {t("opinion")}
              </div>
            </NavLink>

            {/* <li>
              <NavLink
                to={"/gallery"}
                href="#"
                c
                className={({ isActive }) =>
                  isActive
                    ? "text-white w-full btn-neutral btn btn-sm "
                    : "w-full btn btn-outline btn-neutral btn-sm"
                }
              >
                {t("photo gallery")}
              </NavLink>
            </li> */}

            <NavLink
              to="/#contacts"
              className={`btn btn-sm w-full menu-link scroll-mt-[100px] ${
                activeId === "contacts"
                  ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                  : "text-gray-700 border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 w-full h-full">
                <FaFileContract />

                {t("contacts")}
              </div>
            </NavLink>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

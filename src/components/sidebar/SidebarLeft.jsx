import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router";
import { motion } from "framer-motion"; // For animation

export default function SidebarLeft() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentHash = location.hash;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileFocus="focused"
      className="h-full"
    >
      <div className="w-full h-full text-sm">
        <div>
          <h2 className="bg-[#004080] py-6 w-full font-bold text-white btn">
            {t("the court")}
          </h2>

          <ul className="space-y-1 p-2">
            <li>
              <NavLink
                to={"/history"}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-bold"
                    : "text-gray-700 btn btn-sm w-full border-gray-300 font-bold"
                }
              >
                {t("history")}
              </NavLink>
            </li>

            <NavLink
              to={"/citizenCharter"}
              href="#"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                  : "text-gray-700 btn btn-sm w-full border-gray-300"
              }
            >
              {t("citizen charter")}
            </NavLink>
            <div className="hidden md:block space-y-1">
              <li>
                <NavLink
                  to={"/#calendar"}
                  className={`btn btn-sm w-full menu-link ${
                    currentHash === "#calendar"
                      ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                      : "text-gray-700 border-gray-300"
                  }`}
                >
                  {t("court calendar")}
                </NavLink>
              </li>
              <NavLink
                to={"/#rules"}
                className={`btn btn-sm w-full menu-link ${
                  currentHash === "#rules"
                    ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                {t("court rules")}
              </NavLink>
            </div>
          </ul>
        </div>

        <div className="hidden md:block">
          <h2 className="bg-[#004080] w-full font-bold text-white btn">
            {t("resources")}
          </h2>
          <ul className="space-y-1 p-2 w-full">
            <li>
              <NavLink
                to={"/#complain"}
                className={`btn btn-sm w-full menu-link ${
                  currentHash === "#complain"
                    ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                {t("lodge your complaint")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/#opinion"
                className={`btn btn-sm w-full menu-link ${
                  currentHash === "#opinion"
                    ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                {t("opinion")}
              </NavLink>
            </li>
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
            <li>
              <NavLink
                to="/#contacts"
                className={`btn btn-sm w-full menu-link ${
                  currentHash === "#contacts"
                    ? "text-blue-800 btn-outline btn-outline-offset-4 font-semibold"
                    : "text-gray-700 border-gray-300"
                }`}
              >
                {t("contacts")}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

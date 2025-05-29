import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { motion } from "framer-motion"; // For animation

export default function SidebarLeft() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileFocus="focused"
      className=""
    >
      <div className="space-y-4 px-2 w-full h-full text-sm">
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
                    ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                    : "text-gray-700 btn btn-sm w-full border-gray-300"
                }
              >
                {t("history")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/calendar"}
                href="#"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                    : "text-gray-700 btn btn-sm w-full border-gray-300"
                }
              >
                {t("court calendar")}
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
            <NavLink
              to={"/rules"}
              href="#"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                  : "text-gray-700 btn btn-sm w-full border-gray-300"
              }
            >
              {t("court rules")}
            </NavLink>
          </ul>
        </div>

        <div>
          <h2 className="bg-[#004080] w-full font-bold text-white btn">
            {t("resources")}
          </h2>
          <ul className="space-y-1 p-2 w-full">
            <li>
              <NavLink
                to={"/complain"}
                href="#"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                    : "text-gray-700 btn btn-sm w-full border-gray-300"
                }
              >
                {t("lodge your complaint")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/opinion"}
                href="#"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                    : "text-gray-700 btn btn-sm w-full border-gray-300"
                }
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
                to={"/contacts"}
                href="#"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-800 btn-outline btn-sm w-full btn btn-outline-offset-4 font-semibold"
                    : "text-gray-700 btn btn-sm w-full border-gray-300"
                }
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

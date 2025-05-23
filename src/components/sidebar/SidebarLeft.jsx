import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function SidebarLeft() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 px-2 pb-10 w-full h-full text-sm">
      <div>
        <h2 className="bg-[#004080] py-6 w-full font-bold text-white btn">
          {t("the court")}
        </h2>

        <ul className="space-y-1 p-2">
          <li>
            <NavLink
              to={"/history"}
              href="#"
              className={({ isActive }) =>
                isActive
                  ? "text-white w-full btn-neutral btn btn-sm "
                  : "w-full btn btn-outline btn-neutral btn-sm"
              }
            >
              {t("history")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/calender"}
              href="#"
              className={({ isActive }) =>
                isActive
                  ? "text-white w-full btn-neutral btn btn-sm "
                  : "w-full btn btn-outline btn-neutral btn-sm"
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
                ? "text-white w-full btn-neutral btn btn-sm "
                : "w-full btn btn-outline btn-neutral btn-sm"
            }
          >
            {t("citizen charter")}
          </NavLink>
          <NavLink
            to={"/rules"}
            href="#"
            className={({ isActive }) =>
              isActive
                ? "text-white w-full btn-neutral btn btn-sm "
                : "w-full btn btn-outline btn-neutral btn-sm"
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
                  ? "text-white w-full btn-neutral btn btn-sm "
                  : "w-full btn btn-outline btn-neutral btn-sm"
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
                  ? "text-white w-full btn-neutral btn btn-sm "
                  : "w-full btn btn-outline btn-neutral btn-sm"
              }
            >
              {t("opinion")}
            </NavLink>
          </li>
          <li>
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
          </li>
          <li>
            <NavLink
              to={"/contacts"}
              href="#"
              className={({ isActive }) =>
                isActive
                  ? "text-white w-full btn-neutral btn btn-sm "
                  : "w-full btn btn-outline btn-neutral btn-sm"
              }
            >
              {t("contacts")}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

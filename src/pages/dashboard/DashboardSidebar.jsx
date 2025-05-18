import React from "react";
import { NavLink } from "react-router";

const DashboardSidebar = () => {
  return (
    <div className="">
      <div className="space-y-4 w-full">
        {/* <h2 className="bg-green-600 px-2 py-1 font-bold text-white">Admin</h2> */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          <h2 className="bg-green-600 px-2 py-1 font-bold text-white text-center">
            Addl Com Mamla
          </h2>
          <NavLink
            to="/dashboard/mamlaUpload"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 btn underline underline-offset-4 font-semibold"
                : "text-gray-700 btn"
            }
          >
            Mamla Upload
          </NavLink>

          <NavLink
            to="/dashboard/allMamla"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 underline btn underline-offset-4 font-semibold"
                : "text-gray-700 btn"
            }
          >
            All Mamla
          </NavLink>
        </ul>

        {/* ADC Mamla */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          <h2 className="bg-green-600 px-2 py-1 font-bold text-white text-center">
            ADC Mamla
          </h2>
          <NavLink
            to="/dashboard/adcMamlaUpload"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 btn underline underline-offset-4 font-semibold"
                : "text-gray-700 btn"
            }
          >
            Adc Mamla Upload
          </NavLink>

          <NavLink
            to="/dashboard/allAdcMamla"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 underline btn underline-offset-4 font-semibold"
                : "text-gray-700 btn"
            }
          >
            All ADC Mamla
          </NavLink>
        </ul>

        {/* Users Management */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          <h2 className="bg-green-600 px-2 py-1 font-bold text-white text-center">
            Users
          </h2>
          <NavLink
            to="/dashboard/allUsers"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 btn underline underline-offset-4 font-semibold"
                : "text-gray-700 btn"
            }
          >
            All Users
          </NavLink>
        </ul>
      </div>{" "}
    </div>
  );
};

export default DashboardSidebar;

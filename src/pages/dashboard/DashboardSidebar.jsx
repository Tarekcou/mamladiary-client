import React from "react";
import { NavLink } from "react-router";

const DashboardSidebar = () => {
  return (
    <div>
      <div>
        {/* <h2 className="bg-green-600 px-2 py-1 font-bold text-white">Admin</h2> */}
        <ul className="flex flex-col space-y-1 p-4 list-disc list-inside">
          <h2 className="bg-green-600 px-2 py-1 font-bold text-white">
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
        <ul className="flex flex-col space-y-1 p-4 list-disc list-inside">
          <h2 className="bg-green-600 px-2 py-1 font-bold text-white">
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
      </div>{" "}
    </div>
  );
};

export default DashboardSidebar;

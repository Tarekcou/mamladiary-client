import React from "react";
import { Link, NavLink } from "react-router";

const DashboardSidebar = () => {
  return (
    <div className="bg-gray-100 px-2 pb-10 h-full">
      <div className="w-full">
        {/* <h2 className="bg-[#004080] px-2 py-1 font-bold text-white">Admin</h2> */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          <Link
            to={"/dashboard"}
            className="bg-[#004080] px-2 py-2 rounded-md font-bold text-white text-center"
          >
            ড্যাশবোর্ড
          </Link>
          {/* <h2 className="bg-[#004080] px-2 py-2 font-bold text-white text-center">
            রাজস্ব আদালত মামলা
          </h2> */}
          <NavLink
            to="/dashboard/mamlaUpload"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            মামলা আপলোড
          </NavLink>

          <NavLink
            to="/dashboard/allMamla"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            সকল মামলা
          </NavLink>
        </ul>
        <div className="m-0 p-0 divider"></div>

        {/* ADC Mamla */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          {/* <h2 className="bg-[#004080] px-2 py-2 font-bold text-white text-center">
            এডিসি মামলা
          </h2> */}
          <NavLink
            to="/dashboard/adcMamlaUpload"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            এডিসি মামলা আপলোড
          </NavLink>

          <NavLink
            to="/dashboard/allAdcMamla"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            সকল এডিসি মামলা
          </NavLink>
        </ul>
        <div className="m-0 p-0 divider"></div>

        {/* Others Management */}
        <ul className="flex flex-col gap-1 list-disc list-inside">
          {/* <h2 className="bg-[#004080] px-2 py-2 font-bold text-white text-center">
            অন্যান্য
          </h2> */}
          {/* Users Management */}

          <NavLink
            to="/dashboard/allUsers"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            সকল ব্যবহারকারী
          </NavLink>
          <NavLink
            to="/dashboard/causeList"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            কেস ডায়েরী
          </NavLink>
          <NavLink
            to="/dashboard/complain"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            অভিযোগ
          </NavLink>
          <NavLink
            to="/dashboard/feedback"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            মতামত
          </NavLink>
          <NavLink
            to="/dashboard/monthlyReport"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            মাসিক রিপোর্ট
          </NavLink>
        </ul>
      </div>{" "}
    </div>
  );
};

export default DashboardSidebar;

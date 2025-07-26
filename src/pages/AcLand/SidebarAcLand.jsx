import { Plus } from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router";

const SidebarAcLand = () => {
  const storedType = localStorage.getItem("userType");

  return (
    <div className="bg-gray-100 px-2 pb-10 h-full">
      <div className="w-full">
        {/* <h2 className="bg-[#004080] px-2 py-1 font-bold text-white">Admin</h2> */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          <Link
            to={"/dashboard"}
            className="bg-[#004080] px-2 py-2 rounded-md font-bold text-white text-center"
          >
            এসিল্যান্ড ড্যাশবোর্ড
          </Link>

          <NavLink
            to="/dashboard/acLand/newCase"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            <Plus /> নতুন মামলা
          </NavLink>

          <NavLink
            to="/dashboard/acLand/allCases"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            সকল মামলা
          </NavLink>
          <NavLink
            to="/dashboard/acLand/sendCases"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            প্রেরিত মামলা
          </NavLink>
          <NavLink
            to="/dashboard/allMamla"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            প্রোফাইল
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAcLand;

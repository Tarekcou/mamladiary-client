import { Plus } from "lucide-react";
import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";

const SidebarAcLand = () => {
  const storedType = localStorage.getItem("userType");
  const { user } = useContext(AuthContext);
  return (
    <div className="bg-gray-100 px-2 py-5 h-full">
      <div className="w-full">
        {/* <h2 className="bg-[#004080] px-2 py-1 font-bold text-white">Admin</h2> */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          <NavLink
            to={"/dashboard/acLand"}
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2   w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn   w-full border-gray-300"
            }
          >
            এসিল্যান্ড ড্যাশবোর্ড
          </NavLink>

          <NavLink
            to="/dashboard/acLand/allCases"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg: w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg: w-full border-gray-300"
            }
          >
            সকল মামলা
          </NavLink>

          <NavLink
            to={`/dashboard/${user?.role}/profile`}
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg: w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg: w-full border-gray-300"
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

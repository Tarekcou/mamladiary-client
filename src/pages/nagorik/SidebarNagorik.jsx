import { Plus } from "lucide-react";
import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";

const SidebarNagorik = () => {
  const storedType = localStorage.getItem("userType");
  const {user}=useContext(AuthContext)
  return (
    <div className="bg-gray-100 px-2 pb-10 h-full">
      <div className="w-full">
        {/* <h2 className="bg-[#004080] px-2 py-1 font-bold text-white">Admin</h2> */}
        <ul className="flex flex-col space-y-1 list-disc list-inside">
          <Link
            to={`/dashboard/${user.role}`}
            className="bg-[#004080] px-2 py-2 rounded-md font-bold text-white text-center"
          >
            নাগরিক ড্যাশবোর্ড
          </Link>

          <NavLink
            to="/dashboard/nagorik/caseUpload"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            <Plus /> নতুন মামলা
          </NavLink>

          <NavLink
            to="/dashboard/nagorik/cases"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            চলমান মামলা
          </NavLink>
         <NavLink
                     to={`/dashboard/${user?.role}/profile`}
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

export default SidebarNagorik;

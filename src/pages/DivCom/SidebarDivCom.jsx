import React from "react";
import { Link, NavLink } from "react-router";

const SidebarDivCom = () => {
  const storedType = localStorage.getItem("userType");

  return (
    <div className="bg-gray-100 px-2 py-5 h-full">
      <div className="w-full">
        {/* <h2 className="bg-[#004080] px-2 py-1 font-bold text-white">Admin</h2> */}

        <ul className="flex flex-col gap-1 p-0 list-disc list-inside">
          <Link
            to={`/dashboard/${storedType}`}
            className="bg-[#004080] px-2 py-2 rounded-md w-full font-bold text-white text-center"
          >
            ড্যাশবোর্ড
          </Link>
          <NavLink
            to="/dashboard/divCom/requestedCases"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            নতুন আগত মামলা
          </NavLink>
          <NavLink
            to="/dashboard/divCom/allCases"
            className={({ isActive }) =>
              isActive
                ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
            }
          >
            সকল আগত মামলা
          </NavLink>
        </ul>

        <div className="m-0 p-0 divider"></div>

        <div
          tabIndex="0"
          className="collapse collapse-arrow bg-base-100 border border-base-300"
        >
          <input type="checkbox" />

          <div className="collapse-title font-semibold">ব্যবহারকারী</div>
          <ul className="collapse-content flex flex-col gap-1 p-0 list-disc list-inside">
            <NavLink
              to="/dashboard/addUsers"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                  : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
              }
            >
              ইউজার যুক্ত করুন
            </NavLink>
            <NavLink
              to="/dashboard/divComUsers"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                  : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
              }
            >
              কমিশনার অফিস ইউজার
            </NavLink>
            <NavLink
              to="/dashboard/adcUsers"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                  : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
              }
            >
              এডিসি ইউজার
            </NavLink>
            <NavLink
              to="/dashboard/acLandUsers"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-800 btn-outline  border-2 btn-md lg:btn-sm w-full btn btn-outline-offset-4 font-semibold"
                  : "text-gray-700 btn btn-md lg:btn-sm w-full border-gray-300"
              }
            >
              এসিল্যান্ড ইউজার
            </NavLink>
          </ul>
        </div>
        {/* Others Management */}
        <div className="m-0 p-0 divider"></div>

        <div
          tabIndex="0"
          className="collapse collapse-arrow bg-base-100 border border-base-300"
        >
          <input type="checkbox" />

          <div className="collapse-title font-semibold"> অন্যান্য</div>
          <ul className="collapse-content flex flex-col gap-1 p-0 list-disc list-inside">
            {/* <h2 className="bg-[#004080] px-2 py-2 font-bold text-white text-center">
            অন্যান্য
          </h2> */}
            {/* Users Management */}

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
        </div>
        <div className="m-0 p-0 divider"></div>

        {/* পুরাতন মামলার তথ্য  */}
        <div
          tabIndex="0"
          className="collapse collapse-arrow bg-base-100 border border-base-300"
        >
          <input type="checkbox" />

          <div className="collapse-title font-semibold"> পুরাতন মামলা</div>
          <ul className="collapse-content flex flex-col gap-1 p-0 list-disc list-inside">
            <Link
              to={`/dashboard/${storedType}`}
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
            <div className="m-0 p-0 divider"></div>

            {/* ADC Mamla */}

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
        </div>
      </div>{" "}
    </div>
  );
};

export default SidebarDivCom;

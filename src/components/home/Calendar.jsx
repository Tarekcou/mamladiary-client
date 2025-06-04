import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
import { FaCalendarAlt } from "react-icons/fa";
import CalendarLottie from "../lottie/CalendarLottie";

const Calendar = () => {
  const calendarData = [
    {
      days: "রবিবার, মঙ্গলবার",
      districts:
        "চট্টগ্রাম মহানগর, কক্সবাজার, কুমিল্লা, চাঁদপুর, ব্রাহ্মণবাড়িয়া",
    },
    {
      days: "সোমবার, বুধবার",
      districts:
        "চট্টগ্রামের উপজেলাসমূহ, নোয়াখালী, ফেনী, লক্ষীপুর, তিন পার্বত্য জেলা",
    },
  ];

   const location = useLocation();
  const [openId, setOpenId] = useState("");

  // When URL changes, update the open section
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setOpenId(id);
      // Optional: scroll into view smoothly
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // delay ensures DOM is ready
      }
    }
  }, [location]);

  return (
    <motion.div
      id="calendar" // ✅ Add this line
  style={{ scrollMarginTop: "80px" }} // ✅ Adjust this based on your navbar height

      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-sm mx-auto md:p-4 rounded-t-lg"
    >
      <div className=" ">
        <div className="flex justify-center items-center  my-2">
            <h2 className=" font-bold text-[#004080] text-2xl md:text-3xl text-center">
          আদালতের ক্যালেন্ডার
        </h2>
        <CalendarLottie />
        </div>
       
        <table className="table border border-blue-200 w-full">
          <thead className="bg-[#004080]/20 text-blue-900 text-lg">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                দিন
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                জেলা/উপজেলা
              </th>
                    <th className="px-4 py-2">নোট</th> {/* ✅ Add third header */}

            </tr>
          </thead>
          <tbody className="text-gray-700">
    {calendarData.map((row, index) => (
      <tr key={index} className="hover:bg-[#004080]/10">
        <td className="px-4 py-4 font-medium border-r border-gray-300">{row.days}</td>
        <td className="px-4 py-4 border-r border-gray-300">{row.districts}</td>

        {/* ✅ Only render this cell in the first row */}
        {index === 0 && (
          <td rowSpan={2} className="align-middle">
            <p className=" font-bold text-gray-600 text-base md:text-xl text-center">
              সপ্তাহে কোর্ট ৪ দিন।
            </p>
          </td>
        )}
      </tr>
    ))}
  </tbody>
        </table>

      
      </div>
    </motion.div>
  );
};

export default Calendar;

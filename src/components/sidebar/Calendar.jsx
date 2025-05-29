import React from "react";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-sm mx-auto p-4 rounded-lg"
    >
      <div className="">
        <h2 className="mb-6 font-bold text-[#004080] text-3xl text-center">
          আদালতের ক্যালেন্ডার
        </h2>

        <table className="table border border-blue-200 w-full">
          <thead className="bg-[#004080]/20 text-blue-900 text-lg">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                দিন
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                জেলা/উপজেলা
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {calendarData.map((row, index) => (
              <tr key={index} className="hover:bg-[#004080]/10">
                <td className="px-4 py-4 font-medium">{row.days}</td>
                <td className="px-4 py-4">{row.districts}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-6 font-bold text-gray-500 text-xl text-center">
          সপ্তাহে কোর্ট ৪ দিন।
        </p>
      </div>
    </motion.div>
  );
};

export default Calendar;

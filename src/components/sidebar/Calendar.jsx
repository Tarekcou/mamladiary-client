import React from "react";
import { motion } from "framer-motion"; // For animation

const Calendar = () => {
  const calendarData = [
    {
      days: "রবিবার, মঙ্গলবার",
      districts: "চট্টগ্রাম মহানগর, কক্সবাজার, কুমিল্লা, চাঁদপুর, ব্রাহ্মণবাড়িয়া",
    },
    {
      days: "সোমবার, বুধবার",
      districts: "চট্টগ্রামের উপজেলাসমূহ, নোয়াখালী, ফেনী, লক্ষীপুর, তিন পার্বত্য জেলা",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 mx-auto mt-10 bg-white shadow-md rounded-xl"
    >
      <h2 className="text-3xl font-bold text-center text-[#004080]  mb-6">
        আদালতের ক্যালেন্ডার
      </h2>

      <div className="">
        <table className="table w-full border border-green-200">
          <thead className="bg-[#004080]/20  text-blue-900 text-lg">
            <tr>
              <th className="py-3 px-4 text-left">দিন</th>
              <th className="py-3 px-4 text-left">জেলা/উপজেলা</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {calendarData.map((row, index) => (
              <motion.tr
                key={index}
                className="hover:bg-[#004080]/10"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <td className="py-4 px-4 font-medium">{row.days}</td>
                <td className="py-4 px-4">{row.districts}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xl font-bold text-gray-500 mt-4">সপ্তাহে কোর্ট ৪ দিন।</p>
    </motion.div>
  );
};

export default Calendar;

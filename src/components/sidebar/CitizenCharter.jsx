import React from "react";
import { motion } from "framer-motion"; // For animation

const CitizenCharter = () => {
  return (
    <motion.div
      className="hover:bg-[#004080]/10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gray-100 shadow-lg mx-auto p-6 rounded-xl">
        <h2 className="mb-6 font-bold text-[#004080] text-3xl text-center">
          সিটিজেন চার্টার
        </h2>

        {/* Appeal Requirements Section */}
        <div className="bg-gray-100 shadow mt-10 p-6 border border-gray-200 rounded-xl">
          <h3 className="mb-2 font-semibold text-gray-800 text-xl">
            অতিরিক্ত জেলা প্রশাসক (রাজস্ব) এর মামলার রায়ের বিরুদ্ধে আপিল
          </h3>
          <ul className="space-y-1 pl-4 text-gray-700">
            <h4 className="mb-1 font-semibold text-gray-800">
              আবশ্যক কাগজপত্র:
            </h4>

            <li>০১। আরজি</li>
            <li>০২। ADC (R) এর সর্বশেষ আদেশ।</li>
            <li>০৩। নিম্ন আদালতের নথি</li>
          </ul>
        </div>

        {/* Sand Mahal Approval Table */}
        <div className="bg-gray-100 shadow mt-5 p-6 border border-gray-200 rounded-xl">
          <h3 className="mb-2 font-bold text-blue-700 text-xl">
            বালুমহালের তালিকা অনুমোদন
          </h3>
          <p className="mb-2 text-gray-700">
            <strong>সময়সীমা:</strong> ০৭ কার্যদিবস
          </p>

          <div className="mb-4">
            <h4 className="mb-1 font-semibold text-gray-800">
              আবশ্যক কাগজপত্র:
            </h4>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>বালুমহালের তালিকা দুই প্রস্থ</li>
              <li>জেলা বালুমহাল কমিটির কার্যবিবরণী</li>
            </ul>
          </div>

          <p className="mb-4 text-gray-700">
            <strong>কোর্ট ফি:</strong> প্রযোজ্য নয়
          </p>
        </div>

        {/* Waterbody Appeal Resolution Table */}
        <div className="bg-gray-100 shadow mt-5 p-6 border border-gray-200 rounded-xl">
          <h3 className="mb-2 font-bold text-blue-700 text-xl">
            ২০ একর পর্যন্ত জলমহাল ব্যবস্থাপনা কমিটির রায়ের বিরুদ্ধে আপিল
            নিষ্পত্তি
          </h3>
          <p className="mb-2 text-gray-700">
            <strong>সময়সীমা:</strong> ১৫ কার্যদিবস
          </p>

          <div className="mb-4">
            <h4 className="mb-1 font-semibold text-gray-800">
              আবশ্যক কাগজপত্র:
            </h4>
            <ul className="space-y-1 text-gray-700">
              <li>০১। আরজি</li>
              <li>০২। ADC (R) এর সর্বশেষ আদেশ।</li>
              <li>০৩। নিম্ন আদালতের নথি</li>
            </ul>
          </div>
        </div>

        {/* Court Fees Table */}
        <div className="my-6">
          <h3 className="mb-2 font-semibold text-gray-800 text-xl">
            আবশ্যক কোর্ট ফি:
          </h3>
          <table className="table border border-gray-300 w-full">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border text-left">বিবরণ</th>
                <th className="px-4 py-2 border text-left">ফি</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              <tr>
                <td className="px-4 py-2 border">আরজিতে</td>
                <td className="px-4 py-2 border">১০০/- টাকা</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">ওকালতনামায়</td>
                <td className="px-4 py-2 border">৩৫/- টাকা</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">আবেদনে</td>
                <td className="px-4 py-2 border">১০/- টাকা</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">জাবেদা নকলে</td>
                <td className="px-4 py-2 border">২৩/- টাকা</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">সংবাদ জানিবার আবেদনে</td>
                <td className="px-4 py-2 border">২৩/- টাকা</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Contact Info */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-50 p-4 border rounded-md">
            {/* <h4 className="font-semibold text-gray-800">
              জনাব এস এম অনীক চৌধুরী
            </h4> */}
            <p>সিনিয়র সহকারী কমিশনার, রাজস্ব শাখা</p>
            <p>রুম নম্বর: ১০৯</p>
            <p>
              ইমেইল:{" "}
              <a
                href="mailto:divcomrevenue@gmail.com"
                className="text-blue-600"
              >
                divcomrevenue@gmail.com
              </a>
            </p>
            <p>ফোনঃ ০২-৪১৩৬০৭৯৮</p>
          </div>
          <div className="bg-gray-50 p-4 border rounded-md">
            {/* <h4 className="font-semibold text-gray-800">
              জনাব মোহাম্মদ নূরুল্লাহ নূরী
            </h4> */}
            <p>অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব)</p>
            <p>চট্টগ্রাম</p>
            <p>রুম নং-১০৭</p>
            <p>ফোন: ০২-৪১৩৬০৮০৬</p>
            <p>
              ই-মেইল:{" "}
              <a
                href="mailto:adldivcomrchattogram@mopa.gov.bd"
                className="text-blue-600"
              >
                adldivcomrchattogram@mopa.gov.bd
              </a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CitizenCharter;

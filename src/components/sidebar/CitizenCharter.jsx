import React from "react";
import { motion } from "framer-motion"; // For animation

const CitizenCharter = () => {
  return (<motion.div
                className="hover:bg-[#004080]/10"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: .3}}
              >
   <div className="  mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">সিটিজেন চার্টার</h2>

      {/* Appeal Requirements Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          অতিরিক্ত জেলা প্রশাসক (রাজস্ব) এর মামলার রায়ের বিরুদ্ধে আপিল
        </h3>
        <ul className=" text-gray-700 space-y-1 pl-4">
              <h4 className="font-semibold text-gray-800 mb-1">আবশ্যক কাগজপত্র:</h4>

          <li>০১। আরজি</li>
          <li>০২। ADC (R) এর সর্বশেষ আদেশ।</li>
          <li>০৩। নিম্ন আদালতের নথি</li>
        </ul>
      </div>

      {/* Court Fees Table */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">আবশ্যক কোর্ট ফি:</h3>
        <table className="table w-full border border-gray-300">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">বিবরণ</th>
              <th className="border px-4 py-2 text-left">ফি</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            <tr>
              <td className="border px-4 py-2">আরজিতে</td>
              <td className="border px-4 py-2">১০০/- টাকা</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">ওকালতনামায়</td>
              <td className="border px-4 py-2">৩৫/- টাকা</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">আবেদনে</td>
              <td className="border px-4 py-2">১০/- টাকা</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">জাবেদা নকলে</td>
              <td className="border px-4 py-2">২৩/- টাকা</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">সংবাদ জানিবার আবেদনে</td>
              <td className="border px-4 py-2">২৩/- টাকা</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md border">
          <h4 className="font-semibold text-gray-800">জনাব এস এম অনীক চৌধুরী</h4>
          <p>সিনিয়র সহকারী কমিশনার, রাজস্ব শাখা</p>
          <p>রুম নম্বর: ১০৯</p>
          <p>ইমেইল: <a href="mailto:divcomrevenue@gmail.com" className="text-blue-600">divcomrevenue@gmail.com</a></p>
          <p>ফোনঃ ০২-৪১৩৬০৭৯৮</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md border">
          <h4 className="font-semibold text-gray-800">জনাব মোহাম্মদ নূরুল্লাহ নূরী</h4>
          <p>অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব)</p>
          <p>চট্টগ্রাম</p>
          <p>রুম নং-১০৭</p>
          <p>ফোন: ০২-৪১৩৬০৮০৬</p>
          <p>ই-মেইল: <a href="mailto:adldivcomrchattogram@mopa.gov.bd" className="text-blue-600">adldivcomrchattogram@mopa.gov.bd</a></p>
        </div>
      </div>
    </div>



    {/* Sand Mahal Approval Table */}
<div className="mt-10 p-6 bg-white rounded-xl shadow border border-gray-200">
  <h3 className="text-xl font-bold text-blue-700 mb-2">বালুমহালের তালিকা অনুমোদন</h3>
  <p className="text-gray-700 mb-2"><strong>সময়সীমা:</strong> ০৭ কার্যদিবস</p>

  <div className="mb-4">
    <h4 className="font-semibold text-gray-800 mb-1">আবশ্যক কাগজপত্র:</h4>
    <ul className="list-disc list-inside text-gray-700 space-y-1">
      <li>বালুমহালের তালিকা দুই প্রস্থ</li>
      <li>জেলা বালুমহাল কমিটির কার্যবিবরণী</li>
    </ul>
  </div>

  <p className="text-gray-700 mb-4"><strong>কোর্ট ফি:</strong> প্রযোজ্য নয়</p>

  {/* Contact Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gray-50 p-4 rounded-md border">
      <h4 className="font-semibold text-gray-800">জনাব এস এম অনীক চৌধুরী</h4>
      <p>সিনিয়র সহকারী কমিশনার, রাজস্ব শাখা</p>
      <p>রুম নম্বর: ১০৯</p>
      <p>ইমেইল: <a href="mailto:divcomrevenue@gmail.com" className="text-blue-600">divcomrevenue@gmail.com</a></p>
      <p>ফোনঃ ০২-৪১৩৬০৭৯৮</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-md border">
      <h4 className="font-semibold text-gray-800">ড. মোঃ জিয়াউদ্দীন</h4>
      <p>বিভাগীয় কমিশনার (অতিরিক্ত সচিব)</p>
      <p>চট্টগ্রাম</p>
      <p>রুম নং-২০১</p>
      <p>ফোন: ০২-৪১৩৬০৮০১</p>
      <p>ই-মেইল: <a href="mailto:divcomchittagong@mopa.gov.bd" className="text-blue-600">divcomchittagong@mopa.gov.bd</a></p>
    </div>
  </div>
</div>




{/* Waterbody Appeal Resolution Table */}
<div className="mt-10 p-6 bg-white rounded-xl shadow border border-gray-200">
  <h3 className="text-xl font-bold text-blue-700 mb-2">২০ একর পর্যন্ত জলমহাল ব্যবস্থাপনা কমিটির রায়ের বিরুদ্ধে আপিল নিষ্পত্তি</h3>
  <p className="text-gray-700 mb-2"><strong>সময়সীমা:</strong> ১৫ কার্যদিবস</p>

  <div className="mb-4">
    <h4 className="font-semibold text-gray-800 mb-1">আবশ্যক কাগজপত্র:</h4>
    <ul className=" text-gray-700 space-y-1">
      <li>০১। আরজি</li>
      <li>০২। ADC (R) এর সর্বশেষ আদেশ।</li>
      <li>০৩। নিম্ন আদালতের নথি</li>
    </ul>
  </div>

  <table className="table w-full border border-gray-300">
  <thead className="bg-blue-100 text-gray-700">
    <tr>
      <th className="border px-4 py-2 text-left">বিবরণ</th>
      <th className="border px-4 py-2 text-left">ফি</th>
    </tr>
  </thead>
  <tbody className="text-gray-800">
    <tr>
      <td className="border px-4 py-2">আরজিতে</td>
      <td className="border px-4 py-2">১০০/- টাকা</td>
    </tr>
    <tr>
      <td className="border px-4 py-2">ওকালতনামায়</td>
      <td className="border px-4 py-2">৩৫/- টাকা</td>
    </tr>
    <tr>
      <td className="border px-4 py-2">আবেদনে</td>
      <td className="border px-4 py-2">১০/- টাকা</td>
    </tr>
    <tr>
      <td className="border px-4 py-2">জাবেদা নকলে</td>
      <td className="border px-4 py-2">২৩/- টাকা</td>
    </tr>
    <tr>
      <td className="border px-4 py-2">সংবাদ জানিবার আবেদনে</td>
      <td className="border px-4 py-2">২৩/- টাকা</td>
    </tr>
  </tbody>
</table>



  {/* Contact Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gray-50 p-4 rounded-md border">
      <h4 className="font-semibold text-gray-800">জনাব এস এম অনীক চৌধুরী</h4>
      <p>সিনিয়র সহকারী কমিশনার, রাজস্ব শাখা</p>
      <p>রুম নম্বর: ১০৯</p>
      <p>ইমেইল: <a href="mailto:divcomrevenue@gmail.com" className="text-blue-600">divcomrevenue@gmail.com</a></p>
      <p>ফোনঃ ০২-৪১৩৬০৭৯৮</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-md border">
      <h4 className="font-semibold text-gray-800">জনাব মোহাম্মদ নূরুল্লাহ নূরী</h4>
      <p>অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব)</p>
      <p>চট্টগ্রাম</p>
      <p>রুম নং-১০৭</p>
      <p>ফোন: ০২-৪১৩৬০৮০৬</p>
      <p>ই-মেইল: <a href="mailto:adldivcomrchattogram@mopa.gov.bd" className="text-blue-600">adldivcomrchattogram@mopa.gov.bd</a></p>
    </div>
  </div>
</div>

  
 </motion.div>
   
  );
};

export default CitizenCharter;

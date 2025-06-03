import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
import { FcRules } from "react-icons/fc";
import { FaArrowDown } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";

const Rules = () => {
  const rules = [
    "মামলার হাজিরা, আপত্তি(পিটিশন), সময়ের আবেদন ও অন্যান্য আবেদনসমূহ ধার্য তারিখ সকাল ১১.০০ ঘটিকার মধ্যে কোর্টে জমা দিতে হবে।",
    "ফাইলিং এর সময় ওকালতনামা এবং যে মামলার আদেশের বিরুদ্ধে আপিল/রিভিশন দায়ের করবেন তার সার্টিফাইর্ড কপি দাখিল করতে হবে।",
    "মামলার ফাইলিং ও যুক্তিতর্ক সকাল ১০.৩০ ঘটিকার মধ্যে জমা দিতে হবে।",
    "মামলা ফাইলিং এর সময় ১০০ টাকার কোর্ট ফি ও ২ সেট ফটোকপি জমা দিতে হবে।",
    "যে কোন পিটিশন মামলার সাথে ২০ টাকার কোর্ট ফি এবং রোজিনা (মামলার বিবাদীর নোটিশ) ১ম জন ১০ টাকা এবং পরবর্তী প্রতিজন ৫ টাকা দিতে হবে।",
    "নোটিশে নাম, মোবাইল নম্বর ও ঠিকানা লিখে দিতে হবে, খাম ও AD Blank দিতে হবে।",
    "যে কোন পিটিশনের সাথে ২ সেট ফটোকপি জমা দিতে হবে।",
  ];

  const location = useLocation();
  const [openId, setOpenId] = useState("");
  const [showAll, setShowAll] = useState(false); // 🌟 Toggle state

  // Scroll into view if hash in URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setOpenId(id);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <motion.div
      id="rules"
      style={{ scrollMarginTop: "80px" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-md mx-auto p-2 md:p-6 rounded-b-lg"
    >
      <div className="flex items-center justify-center my-6 gap-3">
        <h2 className="font-bold text-[#004080] text-xl md:text-3xl text-center">আদালতের নিয়মাবলী</h2>
        <FcRules className="text-5xl" />
      </div>

      <ul className="space-y-4 px-4 list-none">
        {(showAll ? rules : rules.slice(0, 3)).map((rule, index) => (
          <motion.li
            key={index}
            className="flex items-start text-gray-700 text-md md:text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="mr-2 text-[#004080] text-xl">➤</span>
            <span>{rule}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 cursor-pointer text-center w-full  items-center flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-800 flex flex-col cursor-pointer items-center justify-center  text-base hover:underline font-medium"
        >
          {showAll ? "সংক্ষিপ্ত করুন" : "বিস্তারিত দেখুন"}
          {showAll? <FaArrowUp />:      <FaArrowDown />}
     
        </button>
      </div>
    </motion.div>
  );
};

export default Rules;

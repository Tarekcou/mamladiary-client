import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-md mx-auto p-6 rounded-lg"
    >
      <h2 className="mb-6 font-bold text-[#004080] text-3xl text-center">
        নিয়মাবলী
      </h2>
      <ul className="space-y-4 px-4 list-none">
        {rules.map((rule, index) => (
          <motion.li
            key={index}
            className="flex items-start text-gray-700 text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="mr-2 text-[#004080] text-xl">➤</span>
            <span>{rule}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Rules;

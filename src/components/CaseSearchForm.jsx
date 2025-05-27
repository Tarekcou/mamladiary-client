import { useTranslation } from "react-i18next";
import axiosPublic from "../axios/axiosPublic";
import { useState } from "react";
import { motion } from "framer-motion";

const districts = [
  "চট্টগ্রাম",
  "কক্সবাজার",
  "কুমিল্লা",
  "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর",
  "ফেনী",
  "লক্ষ্মীপুর",
  "নোয়াখালী",
  "খাগড়াছড়ি",
  "রাঙ্গামাটি",
  "বান্দরবান",
];

const mamlaNames = [
  "সার্টিফিকেট আপিল",
  "নামজারি আপিল",
  "নামজারি রিভিশন",
  "পিটিশন",
  "বিবিধ সংশোধনী রিভিশন",
  "মিচ আপিল",
  "উচ্ছেদ আপিল",
  "মিচ রিভিশন",
  "নামজারি জমাভাগ আপিল",
  "নামজারি জমাখারিজ আপিল",
  "নামজারি রিভিউ আপিল",
  "নামজারি জমাভাগ রিভিশন",
  "হোল্ডিং আপিল",
  "বিবিধ আপিল",
  "সার্টিফিকেট রিভিশন",
  "ভিপি আপিল",
  "নামজরি রিভিশন",
  "নামজারি মিচ আপিল",
  "বন্দোবস্তি রিভিশন",
  "রিভিশন মিচ আপিল",
  "নামজারি জমাখারিজ রিভিশন",
  "মিচ এল আপিল",
  "নামজারি বিবিধ আপিল",
  "অবমূল্যায়ন আপিল",
  "বিবিধ রিভিশন",
  "নামজারি জমাঃ আপিল",
  "বিবিধ রেকড সংশোধনী আপিল",
  "বন্দোবস্তি আপিল",
  "নামজারি রিভিউ",
  "জমাভাগ রিভিশন",
  "নামজারি মিচ রিভিশন",
  "বিবিধ নামজারি আপিল",
  "ভি.পি আপিল",
  "বাজার ফান্ড মিচ আপিল",
  "এল এ মিচ আপিল",
  "বাজার ফান্ড বন্দোবস্ত আপিল",
  "জোত: পূনবহাল রিভিশন",
  "মিউটেশন রিভিশন",
  "মিউটেশন আপিল",
  "জমাখারিজ রিভিশন",
  "বন্দোবস্তি মামলা",
  "জলমহাল আপিল",
  "বন্দোবস্ত রিভিশন",
  "চান্দিনা পেরিফেরি মিচ রিভিশন",
  "সায়রাত আপিল",
  "এস.এ. মিচ রিভিশন",
  "নামজারি ও জমাখারিজ আপিল",
  "জমাখারিজ আপিল",
  "নামজারি আপিল রিভিশন",
  "আপিল",
  "নামজারি জমাভাগ মিচ রিভিশন",
  "নামজারি ও জমাভাগ রিভিশন",
  "বিবিধ মিচ আপিল",
  "সাটির্ফিকেট রিভিশন",
  "নামজারি রিভিউ মিচ মামলা",
  "সিভিল আপিল",
  "রিভিউ পিটিশন",
  "রিভিউ মিচ মামলা",
  "রিভিশন",
];

export default function MamlaSearchForm({ handleSubmit }) {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(2025);
  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((d) => banglaDigits[d])
      .join("");
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-white mx-auto"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex-1 shadow-sm px-4 pt-2 pb-2">
          <div className="bg-[#004080] mb-4 py-2 font-bold text-white text-lg text-center">
            {t("case search")}
          </div>
          <div className="space-y-4 text-sm">
            <div className="gap-4 grid grid-cols-2">
              {/* District */}
              <label>
                {t("district")}:
                <select
                  name="district"
                  required
                  className="mt-1 w-full select-bordered select"
                >
                  <option value="">{t("select district")}</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              {/* Mamla Name */}
              <label>
                {t("mamla name")}:
                <select
                  name="mamlaName"
                  required
                  className="mt-1 w-full select-bordered select"
                >
                  <option value="">{t("select mamla name")}</option>
                  {mamlaNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Case Number */}
              <label>
                {t("case number")}:
                <input
                  name="mamlaNo"
                  type="text"
                  className="input-bordered w-full input"
                />
              </label>

              {/* Year */}
              <label>
                {t("year")}:
                <select
                  name="year"
                  required
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="w-full select-bordered select"
                >
                  <option value="">{t("Select Year")}</option>"
                  {Array.from({ length: 50 }, (_, i) => {
                    const year = 2000 + i;
                    return (
                      <option key={year} value={year}>
                        {toBanglaNumber(year)}
                        {/* {year} */}
                      </option>
                    );
                  })}
                  "
                </select>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="bg-[#004080] mx-auto mt-2 border-none text-white btn btn-neutral"
              >
                {t("search")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

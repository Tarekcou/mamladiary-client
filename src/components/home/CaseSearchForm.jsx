import { useTranslation } from "react-i18next";
import axiosPublic from "../../axios/axiosPublic";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaFolderOpen } from "react-icons/fa";
import logo from "../../assets/bg-image.jpg";
import SearchLottie from "../lottie/SearchLottie";
import { mamlaNames } from "../../data/mamlaNames";
import { districts } from "../../data/districts";

export default function CaseSearchForm({ handleSubmit, isLoading }) {
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
      className="relative bg-gray-100 mx-auto"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex-1 shadow-sm md:px-4 pt-1 pb-2">
          <div className="flex justify-center items-center gap-2 bg-[#004080] border-red-500 font-bold text-white text-xl md:text-2xl text-center">
            {/* <FaFolderOpen /> */}
            {/* <img
              className="rounded-full w-5 md:w-8 h-5 md:h-8"
              src={logo}dfa
              alt="logo"
            /> */}
            <p> {t("case search")}</p>
            <SearchLottie className="bg-base-200 border" />
          </div>
          <div className=" "></div>
          <div className="space-y-4 p-4 font-semibold text-lg">
            <div className="gap-4 grid grid-cols-2">
              {/* District */}
              {/* District */}
              <label>
                {t("district")}:
                <select
                  name="district"
                  required
                  className="bg-gray-100 mt-1 w-full select-bordered select"
                >
                  <option value="">{t("select district")}</option>
                  {districts.map((d) => (
                    <option key={d.en} value={JSON.stringify(d)}>
                      {d.bn}
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
                  className="bg-gray-100 mt-1 w-full select-bordered select"
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
                  className="bg-gray-100 input-bordered w-full input"
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
                  className="bg-gray-100 w-full select-bordered select"
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
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>{" "}
                    <h1> অনুসন্ধান হচ্ছে..</h1>
                  </>
                ) : (
                  <h1>অনুসন্ধান করুন </h1>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

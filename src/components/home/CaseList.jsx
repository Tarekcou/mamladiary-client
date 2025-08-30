import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import { useTranslation } from "react-i18next";
import { MdError } from "react-icons/md";
import Loading from "../common/Loading";
import { motion } from "framer-motion";
import ResultLottie from "../lottie/ResultLottie";
import { FaFolderOpen } from "react-icons/fa6";
import CaseListSkeleton from "./CaseListSkeleton";

const CasesList = ({ mamla, isLoading, isError, error }) => {
  console.log(mamla);
  const { t } = useTranslation();
  function toBanglaNumber(num) {
    if (num === null || num === undefined) return "-"; // fallback
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) =>
        /\d/.test(digit) ? banglaDigits[parseInt(digit)] : digit
      )
      .join("");
  }

  if (isLoading) return <CaseListSkeleton />;
  if (isError) {
    const isNetworkError =
      error?.message?.includes("Network Error") ||
      error?.code === "ERR_NETWORK" ||
      !window.navigator.onLine;

    return (
      <div className="flex flex-col justify-center items-center gap-2 p-10 text-red-600 text-center">
        <MdError className="text-4xl" />
        {isNetworkError ? (
          <h1>
            ইন্টারনেট সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আপনার সংযোগ পরীক্ষা
            করুন।
          </h1>
        ) : (
          <h1>দুঃখিত, মামলার তথ্য পাওয়া যায়নি।</h1>
        )}
      </div>
    );
  }

  if (!mamla || mamla.length === 0)
    return (
      <div className="flex justify-center items-center p-10 text-red-600">
        <MdError className="text-4xl" />

        <h1 className="p-2 text-center">{"দুঃখিত মামলার তথ্য পাওয়া যায়নি "}</h1>
      </div>
    );
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-sm mx-auto md:p-3 py-10 rounded-xl h-full"
    >
      <div className="mt-5">
        <div className="border">
          <h1 className="flex justify-center items-center gap-2 bg-[#004080] py-2 font-semibold text-white text-xl md:text-2xl text-center">
            <FaFolderOpen /> {t("case search result")}
            <div>
              <ResultLottie />
            </div>
          </h1>
        </div>

        <div className="border border-gray-300 overflow-x-auto">
          <table className="shadow-lg border border-gray-400 rounded-lg min-w-full overflow-hidden text-base md:text-lg">
            <tbody>
              {[
                { label: t("mamla name"), value: mamla.mamlaName || "-" },
                {
                  label: t("mamla no"),
                  value: toBanglaNumber(mamla?.mamlaNo) || "-",
                },
                {
                  label: t("mamla year"),
                  value: toBanglaNumber(mamla?.year) || "-",
                },
                { label: t("district"), value: mamla?.district?.bn || "-" },
                {
                  label: t("next date"),
                  value: toBanglaNumber(mamla?.nextDate) || "-",
                },
                {
                  label: t("completion stage"),
                  value: mamla?.lastCondition || "-",
                },
                {
                  label: t("completion date"),
                  value: toBanglaNumber(mamla?.completionDate) || "-",
                },
                { label: t("comments"), value: mamla?.comments || "-" },
              ].map((row, index) => (
                <tr
                  key={row.label}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <td className="px-6 py-3 w-1/3 font-semibold text-gray-700">
                    {row.label}
                  </td>
                  <td className="px-6 py-3 text-gray-800">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CasesList;

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
  const { t } = useTranslation();
  function toBanglaNumber(num) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => banglaDigits[parseInt(digit)] || digit)
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
          <h1 className="flex justify-center items-center gap-2 bg-[#004080] py-4 font-semibold text-white text-xl md:text-2xl text-center">
            <FaFolderOpen /> {t("case search result")} 
            <div>
              <ResultLottie />
            </div>
          </h1>
          
        </div>

        <div className="max-w-screen overflow-x-auto">
          <table className="table table-bordered shadow border border-gray-200 rounded-lg max-w-full text-base md:text-lg">
            <thead className="bg-gray-200">
              <tr className="font-medium text-gray-700 text-xl text-center">
                <th className="px-4 py-2">{t("mamla name")}</th>
                <th className="px-4 py-2">{t("mamla no")}</th>
                <th className="px-4 py-2">{t("mamla year")}</th>
                <th className="px-4 py-2">{t("district")}</th>
                <th className="px-4 py-2">{t("next date")}</th>

                <th className="px-4 py-2">{t("completion stage")}</th>
                {/* <th className="px-4 py-2">{t("গৃহীত কার্যক্রম")}</th> */}

                <th className="px-4 py-2">{t("completion date")}</th>
                <th className="px-4 py-2">{t("comments")}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                key={mamla._id}
                className="hover:bg-gray-100 border border-gray-300 text-center"
              >
                <td className="px-4 py-2">{mamla.mamlaName || "-"}</td>
                <td className="px-4 py-2">
                  {toBanglaNumber(mamla.mamlaNo.replace(/\D/g, "")) || "-"}
                </td>
                <td className="px-4 py-2">
                  {toBanglaNumber(mamla.year.replace(/\D/g, "")) || "-"}
                </td>
                <td className="px-4 py-2">{mamla?.district || "-"}</td>
                <td className="px-4 py-2">
                  {toBanglaNumber(mamla?.nextDate) || "-"}
                </td>

                <td className="px-4 py-2">{mamla?.compltedMamla || "-"}</td>
                <td className="px-4 py-2">
                  {toBanglaNumber(mamla?.completionDate) || "-"}
                </td>
                <td className="px-4 py-2">{mamla?.comments || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default CasesList;

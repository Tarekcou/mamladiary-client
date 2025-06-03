import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import { useTranslation } from "react-i18next";
import { MdError } from "react-icons/md";
import Loading from "../common/Loading";
import { motion } from "framer-motion";
import ResultLottie from "../lottie/ResultLottie";
import { FaFolderOpen } from "react-icons/fa6";

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

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p>
        <MdError />
        {
          <h1 className="p-10 text-center">
            {"দুঃখিত মামলার তথ্য পাওয়া যায়নি "}
          </h1>
        }
      </p>
    );
  if (!mamla || mamla.length === 0)
    return (
      <div className="flex justify-center items-center p-10">
        <MdError />
        {
          <h1 className="p-2 text-center">
            {"দুঃখিত মামলার তথ্য পাওয়া যায়নি "}
          </h1>
        }
      </div>
    );
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-sm mx-auto p-3 py-10 rounded-xl h-full"
    >
      <div className="mt-5">
        <div className="py-2">
        <h1 className="bg-[#004080] mb-4 py-4 font-semibold text-xl md:text-3xl flex gap-2 items-center justify-center text-white  text-center">
          <FaFolderOpen /> {t("case search result")}
        </h1>
        <ResultLottie />
        </div>
       
        <div className="overflow-x-auto">
          <table className="shadow border  table table-bordered border-gray-200 rounded-lg min-w-full text-xl">
            <thead className="bg-gray-200">
              <tr className="font-medium text-gray-700 text-xl  text-center">
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
                className="hover:bg-gray-100 border-gray-300 border text-center"
              >
                <td className="px-4 py-2">{mamla.mamlaName || "-"}</td>
                <td className="px-4 py-2">
                  {toBanglaNumber(mamla.mamlaNo.replace(/\D/g, "")) || "-"}
                </td>
                <td className="px-4 py-2">
                  {toBanglaNumber(mamla.year.replace(/\D/g, "")) || "-"}
                </td>
                <td className="px-4 py-2">{mamla?.district || "-"}</td>
                <td className="px-4 py-2">{toBanglaNumber(mamla?.nextDate) || "-"}</td>

                <td className="px-4 py-2">{mamla?.compltedMamla || "-"}</td>
                <td className="px-4 py-2">{toBanglaNumber(mamla?.completionDate) || "-"}</td>
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

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../axios/axiosPublic";
import { useTranslation } from "react-i18next";
import { MdError } from "react-icons/md";
import Loading from "./common/Loading";
import { motion } from "framer-motion";

const CasesList = ({ mamla, isLoading, isError, error }) => {
  const { t } = useTranslation();

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
      className="bg-white shadow-md mx-auto p-6 rounded-xl"
    >
      <div className="mt-10">
        <h1 className="bg-[#004080] mb-4 py-2 font-semibold text-white text-xl text-center">
          📂 {t("case search result")}
        </h1>
        <div className="overflow-x-auto">
          <table className="shadow border border-gray-200 rounded-lg min-w-full">
            <thead className="bg-gray-100">
              <tr className="font-medium text-gray-700 text-sm text-left">
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
                className="hover:bg-gray-50 border-gray-200 border-t text-sm"
              >
                <td className="px-4 py-2">{mamla.mamlaName || "-"}</td>
                <td className="px-4 py-2">
                  {mamla.mamlaNo.replace(/\D/g, "") || "-"}
                </td>
                <td className="px-4 py-2">
                  {mamla.year.replace(/\D/g, "") || "-"}
                </td>
                <td className="px-4 py-2">{mamla?.district || "-"}</td>
                <td className="px-4 py-2">{mamla?.nextDate || "-"}</td>

                <td className="px-4 py-2">{mamla?.compltedMamla || "-"}</td>
                <td className="px-4 py-2">{mamla?.completionDate || "-"}</td>
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

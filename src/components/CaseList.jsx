import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../axios/axiosPublic";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import { MdError } from "react-icons/md";


const CasesList = ({ mamla, isLoading, isError, error }) => {
  const { t } = useTranslation();

  if (isLoading) return <Loading />;
  if (isError) return <p><MdError />
{<h1 className="text-center p-10">{"দুঃখিত মামলার তথ্য পাওয়া যায়নি "}</h1>}</p>;
  if (!mamla || mamla.length === 0) return <div className="flex justify-center p-10 items-center"><MdError />
{<h1 className="text-center p-2">{"দুঃখিত মামলার তথ্য পাওয়া যায়নি "}</h1>}</div>;
  return (
    <div className="mt-10">
      <h1 className="bg-green-200 mb-4 py-2 font-semibold text-xl text-center">
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

              <th className="px-4 py-2">{t("completion date")}</th>
              <th className="px-4 py-2">{t("final task")}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              key={mamla._id}
              className="hover:bg-gray-50 border-gray-200 border-t text-sm"
            >
              <td className="px-4 py-2">{mamla.mamlaName || "-"}</td>
              <td className="px-4 py-2">{mamla.mamlaNo || "-"}</td>
              <td className="px-4 py-2">{mamla.year || "-"}</td>
              <td className="px-4 py-2">{mamla.district || "-"}</td>
              <td className="px-4 py-2">{mamla.nextDate || "-"}</td>

              <td className="px-4 py-2">{mamla.completionDate || "-"}</td>
              <td className="px-4 py-2">{mamla.finalTask || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CasesList;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../axios/axiosPublic";

const CasesList = ({ mamla, isLoading, isError, error }) => {
  if (isLoading) return <p>Loading cases...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!mamla || mamla.length === 0) return <p>No cases found.</p>;
  return (
    <div className="mt-10">
      <h1 className="bg-blue-200 mb-4 py-2 font-semibold text-xl text-center">
        📂 Mamla Cases
      </h1>
      <div className="overflow-x-auto">
        <table className="bg-white shadow border border-gray-200 rounded-lg min-w-full">
          <thead className="bg-gray-100">
            <tr className="font-medium text-gray-700 text-sm text-left">
              <th className="px-4 py-2">Mamla Name</th>
              <th className="px-4 py-2">Mamla No</th>
              <th className="px-4 py-2">Mamla Year</th>
              <th className="px-4 py-2">District</th>
              <th className="px-4 py-2">Completed Date</th>
              <th className="px-4 py-2">Completion Date</th>
              <th className="px-4 py-2">Final Task</th>
              <th className="px-4 py-2">Next Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              key={mamla._id}
              className="hover:bg-gray-50 border-gray-200 border-t text-sm"
            >
              <td className="px-4 py-2">{mamla.mamlaName || "-"}</td>
              <td className="px-4 py-2">{mamla.mamlaNo || "-"}</td>
              <td className="px-4 py-2">{mamla.mamlaYear || "-"}</td>
              <td className="px-4 py-2">{mamla.district || "-"}</td>
              <td className="px-4 py-2">{mamla.completedMamla || "-"}</td>
              <td className="px-4 py-2">{mamla.completionDate || "-"}</td>
              <td className="px-4 py-2">{mamla.finalTask || "-"}</td>
              <td className="px-4 py-2">{mamla.nextDate || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CasesList;

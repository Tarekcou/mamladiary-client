import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { FiDownload } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const MonthlyReport = () => {
  const localDate = new Date();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const {
    data: mamlaList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["monthlyMamla"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/monthlyReport`, {
        params: { month, year },
      });
      return res.data || [];
    },
  });

  const totalPages = Math.ceil(mamlaList.length / itemsPerPage);
  const paginatedData = mamlaList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Monthly Report - ${month}/${year}`, 14, 15);

    const tableData = mamlaList.map((item, index) => [
      index + 1,
      item.mamlaName || "",
      item.mamlaNo?.replace(/\D/g, "") || "",
      item.year?.replace(/\D/g, "") || "",
      item.district || "",
      item.previousDate || "-",
      item.nextDate || "-",
      item.completedMamla || "-",
      item.completionDate || "-",
    ]);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "#",
          "Mamla Name",
          "Mamla No",
          "Year",
          "District",
          "Previous Date",
          "Next Date",
          "Last Status",
          "Completion Date",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      theme: "grid",
    });

    doc.save(`monthly_report_${month}_${year}.pdf`);
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError)
    return <p className="text-red-500 text-center">{error.message}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">মাসিক রিপোর্ট</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
          >
            <FiDownload /> Download PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="bg-white border min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Mamla Name</th>
              <th className="px-4 py-2 border">Mamla No</th>
              <th className="px-4 py-2 border">Year</th>
              <th className="px-4 py-2 border">District</th>
              <th className="px-4 py-2 border">Previous Date</th>
              <th className="px-4 py-2 border">Next Date</th>
              <th className="px-4 py-2 border">Last Status</th>
              <th className="px-4 py-2 border">Completion Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-2 border">{item?.mamlaName}</td>
                  <td className="px-4 py-2 border">
                    {item?.mamlaNo?.replace(/\D/g, "")}
                  </td>
                  <td className="px-4 py-2 border">
                    {item?.year?.replace(/\D/g, "")}
                  </td>
                  <td className="px-4 py-2 border">{item?.district}</td>
                  <td className="px-4 py-2 border">
                    {item?.previousDate || "-"}
                  </td>
                  <td className="px-4 py-2 border">{item?.nextDate || "-"}</td>
                  <td className="px-4 py-2 border">
                    {item?.completedMamla || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.completionDate || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 border text-center" colSpan="10">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p>
          Showing {paginatedData?.length || 0} of {mamlaList?.length || 0}{" "}
          records
        </p>
        <div className="flex gap-2">
          <button
            className="bg-gray-200 disabled:opacity-50 px-3 py-1 rounded"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-200 disabled:opacity-50 px-3 py-1 rounded"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;

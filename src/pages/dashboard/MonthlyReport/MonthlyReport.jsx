import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axiosPublic from "../../../axios/axiosPublic";
import BanglaPDF from "./BanglaPDF";
import { FaDownload } from "react-icons/fa";

const MonthlyReport = () => {
  const localDate = new Date();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const thisMonth = `${month}-${year}`;

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
  function toBanglaNumber(num) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => banglaDigits[parseInt(digit)] || digit)
      .join("");
  }

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">মাসিক রিপোর্ট {thisMonth}</h2>

        <PDFDownloadLink
          document={<BanglaPDF data={mamlaList} thisMonth={thisMonth} />}
          fileName={`মাসিক_প্রতিবেদন ${thisMonth}.pdf`}
          className="bg-red-500 text-white btn-sm btn btn-error"
        >
          {({ loading }) =>
            loading ? (
              "Generating..."
            ) : (
              <div className="flex gap-2">
                <FaDownload />
                {" Download PDF"}
              </div>
            )
          }
        </PDFDownloadLink>
      </div>

      <div className="overflow-x-auto">
        <table className="bg-white border min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ক্রম</th>
              <th className="px-4 py-2 border">মামলার নাম</th>
              <th className="px-4 py-2 border">মামলা নম্বর</th>
              <th className="px-4 py-2 border">সাল</th>
              <th className="px-4 py-2 border">জেলা</th>
              <th className="px-4 py-2 border">পূর্বের তারিখ</th>
              {/* <th className="px-4 py-2 border">পরবর্তী তারিখ</th>
              <th className="px-4 py-2 border">সর্বশেষ অবস্থা</th> */}
              <th className="px-4 py-2 border">নিষ্পত্তির তারিখ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border">
                    {toBanglaNumber((currentPage - 1) * itemsPerPage + idx + 1)}
                  </td>
                  <td className="px-4 py-2 border">{item?.mamlaName}</td>
                  <td className="px-4 py-2 border">
                    {toBanglaNumber(item?.mamlaNo?.replace(/\D/g, ""))}
                  </td>
                  <td className="px-4 py-2 border">
                    {toBanglaNumber(item?.year?.replace(/\D/g, ""))}
                  </td>
                  <td className="px-4 py-2 border">{item?.district}</td>
                  {/* <td className="px-4 py-2 border">
                    {toBanglaNumber(item?.previousDate || "-")}
                  </td>
                  <td className="px-4 py-2 border">{toBanglaNumber(item?.nextDate || "-")}</td> */}
                  <td className="px-4 py-2 border">
                    {item?.completedMamla || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {toBanglaNumber(item.completionDate || "-")}
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

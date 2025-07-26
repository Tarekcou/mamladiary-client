import React from "react";

const CaseDetailsSenior = ({ rootCaseId, activeStage }) => {
  const orders = activeStage.orderSheets || [];
  const rowsPerPage = 10;

  // Split into pages
  const pages = [];
  for (let i = 0; i < orders.length; i += rowsPerPage) {
    pages.push(orders.slice(i, i + rowsPerPage));
  }

  return (
    <div className="border border-gray-300 print-container">
      {/* Header */}

      {pages.map((pageOrders, pageIndex) => (
        <div
          className="p-6 page"
          key={pageIndex}
          style={{
            pageBreakAfter: pageIndex < pages.length - 1 ? "always" : "auto",
          }}
        >
          <div className="mb-4 text-center">
            <h2 className="font-bold text-lg">আদেশপত্র </h2>
            {/* <p>(১৯১৭ সালের রেকর্ড ম্যানুয়েল ১২২ নম্ব ধারা)</p> */}
          </div>

          {/* Case Header Table */}
          <table className="table bg-base-100 mb-4 border border-base-content/5 rounded-box w-full text-sm">
            <tbody>
              <tr>
                <td className="p-2 w-1/4 font-semibold">Tracking ID</td>
                <td className="p-2" colSpan={3}>
                  {rootCaseId}
                </td>
              </tr>

              <tr>
                <td className="p-2 font-semibold">মামলার নাম</td>
                <td className="p-2">{activeStage.mamlaName || "N/A"}</td>

                <td className="p-2 font-semibold">মামলার নং</td>
                <td className="p-2">{activeStage.mamlaNo || "N/A"}</td>
              </tr>

              <tr>
                <td className="p-2 font-semibold">বছর</td>
                <td className="p-2">{activeStage.year || "N/A"}</td>
                <td className="p-2 font-semibold">জেলা</td>
                <td className="p-2">{activeStage.district?.bn || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          {/* Ordersheet Table */}
          <table className="table bg-base-100 border border-base-content/5 rounded-box w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-gray-300 border-r w-1/5">
                  আদেশের ক্রমিক নং ও তারিখ
                </th>
                <th className="p-2 border-gray-300 border-r w-3/5">
                  আদেশ ও অফিসারের সাক্ষর
                </th>
                <th className="p-2 w-1/5">আদেশের উপর গৃহীত ব্যবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {pageOrders.map((sheet, i) => (
                <tr key={i} className="pb-30 align-top">
                  <td className="p-2 pb-30 border-gray-300 border-r border-b">
                    {sheet.date || "N/A"}
                  </td>
                  <td className="p-2 pb-30 border-gray-300 border-r border-b whitespace-pre-wrap">
                    {sheet.order || "N/A"}
                    {/* <div className="mt-4 border-t border-dotted h-10"></div> */}
                  </td>
                  <td className="p-2 pb-30 border-gray-300 border-b whitespace-pre-wrap">
                    {sheet.actionTaken || "N/A"}
                  </td>
                </tr>
              ))}

              {/* Fill empty rows to keep table height consistent */}
              {Array.from({ length: rowsPerPage - pageOrders.length }).map(
                (_, j) => (
                  <tr key={`empty-${j}`}>
                    <td className="p-2 border-gray-300 border-r">&nbsp;</td>
                    <td className="p-2 border-gray-300 border-r">&nbsp;</td>
                    <td className="p-2">&nbsp;</td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {/* Footer / Page Number */}
          <div className="mt-4 text-xs text-center">
            পৃষ্ঠা {pageIndex + 1} এর {pages.length}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CaseDetailsSenior;

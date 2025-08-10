import React, { useRef } from "react";
import { toBanglaNumber } from "../../utils/toBanglaNumber";

const CaseDetailsUpper = ({ rootCaseId, activeStage }) => {
  const orders = activeStage.orderSheets || [];
  const rowsPerPage = 3; // fits A4 height on screen
  const componentRef = useRef();

  const pages = [];
  for (let i = 0; i < orders.length; i += rowsPerPage) {
    pages.push(orders.slice(i, i + rowsPerPage));
  }

  const renderCaseHeader = () => (
    <div className="text-black case-info text-[14px] mb-4">
      <div className="flex justify-between mb-1">
        <div>বাংলাদেশ ফরম নং - {activeStage?.formNo}</div>
        <div className="text-right">
          মোঃ আব্দুল আউয়াল গং<br />
          বনাম<br />
          আবুল হোসেন
        </div>
      </div>

      <h1 className="text-center font-bold text-lg mb-1">আদেশপত্র</h1>
      <p className="text-center mb-2">
        (১৯৯১ সালের ভূমি রেকর্ড ও জরিপ আদেশ ১৯২ নং বিধি অনুযায়ী)
      </p>

      <div className="space-y-2">
        <div className="flex w-full gap-2 justify-between">
          <div className="flex gap-1 w-1/2 items-center whitespace-nowrap">
            <h1 className="font-semibold inline">আদেশপত্র তারিখ</h1>
            <div className="flex-1 border-b border-dotted border-black"></div>
          </div>
          <div className="flex items-center w-1/2 gap-2">
            <label className="font-semibold">হইতে</label>
            <div className="border-b border-dotted border-black w-full"></div>
            <label className="font-semibold">পর্যন্ত</label>
          </div>
        </div>

        <div className="flex w-full gap-2 justify-between">
          <div className="flex gap-1 w-2/5 items-center whitespace-nowrap">
            <h1 className="font-semibold inline">জেলা</h1>
            <div className="flex-1 border-b border-dotted border-black"></div>
          </div>
          <div className="flex items-center w-3/5 gap-2">
            <label className="font-semibold">২০০</label>
            <div className="border-b border-dotted border-black w-full"></div>
            <label className="font-semibold">সালের</label>
            <div className="border-b border-dotted border-black w-full"></div>
            <label className="font-semibold">পর্যন্ত</label>
          </div>
        </div>
      </div>

      <div className="my-4">
        মামলার ধরন: {activeStage.mamlaName} মামলার নংঃ{" "}
        {activeStage?.mamlaNo + " "}/({activeStage?.year}) ({activeStage.district?.bn})
      </div>
    </div>
  );

  return (
    <>
      <style>{`
       @media print {
    @page {
      margin-top: 0;
    }
        #printable-area {
          width: 210mm;
          height: 297mm;
          background: white;
          display: flex;
          flex-direction: column;
          padding: 10px;
          margin: auto;
        }

       
       

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            padding-top: 8px !important;
          }
          button {
            display: none;
          }
        }
      }
      `}</style>

      <button className="mb-4 btn btn-primary" onClick={() => window.print()}>
        PDF ডাউনলোড (Print)
      </button>

    <div id="printable-area" ref={componentRef}>
      {pages.map((pageOrders, pageIndex) => (
        <div
          key={pageIndex}
          className="w-[210mm] h-[297mm] p-10 bg-white mb-10 mx-auto shadow border border-gray-300"
        >
          {renderCaseHeader()}

          <table className="table-fixed w-full border text-center text-sm">
            <thead>
              <tr className="border-b">
                <th className="border p-2 w-1/5 break-words">
                  আদেশের ক্রমিক নং ও তারিখ
                </th>
                <th className="border p-2 w-1/2 break-words">
                  আদেশ ও অফিসারের সাক্ষর
                </th>
                <th className="border p-2 w-2/5 break-words">
                  আদেশের উপর গৃহীত ব্যবস্থা
                </th>
              </tr>
            </thead>
            <tbody>
              {[...pageOrders, ...Array(rowsPerPage - pageOrders.length).fill({})].map((sheet, i) => (
                <tr key={i}>
                  <td className="border p-3 break-words whitespace-pre-wrap w-1/5">
                    {sheet.date || ""}
                  </td>
                  <td className="border p-3 break-words whitespace-pre-wrap w-1/2">
                    {sheet.order || ""}
                  </td>
                  <td className="border p-3 break-words whitespace-pre-wrap w-2/5">
                    {sheet.actionTaken || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>

    </>
  );
};

export default CaseDetailsUpper;
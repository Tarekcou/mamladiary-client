import React, { useRef } from "react";
import { toBanglaNumber } from "../../utils/toBanglaNumber";

const CaseDetailsSenior = ({ rootCaseId, activeStage, headerText }) => {
  const orders = activeStage.orderSheets || [];
  const rowsPerPage = 10; // Tune this number as per page size and spacing
  const printDateTime = new Date().toLocaleString();
  const componentRef = useRef();

  return (
    <>
      <style>{`
  @media print {
    @page {
      margin-top: 0;
    }

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
      width: 200mm;
      height: 260mm;
      background: white;
      display: flex;
      flex-direction: column;
      margin: auto;
    }

    button {
      display: none;
    }

    .orders-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      flex-grow: 1;
      border: 1px solid #000;
    }

    .orders-table th {
      background: #f3f4f6;
      font-weight: bold;
      padding: 6px;
      font-size: 12px;
      border: 1px solid #000;
    }

    .orders-table td {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
      padding: 6px;
      font-size: 12px;
      word-break: break-word;
    }

    .orders-table th:nth-child(1),
    .orders-table td:nth-child(1) {
      width: 20%;
    }
    .orders-table th:nth-child(2),
    .orders-table td:nth-child(2) {
      width: 60%;
    }
    .orders-table th:nth-child(3),
    .orders-table td:nth-child(3) {
      width: 20%;
    }

    .orders-table tbody {
      height: 100%;
    }

    .orders-table tr {
      height: calc((100% - 30px) / 10);
    }
  }
`}</style>



      <button className="mb-4 btn btn-primary print:hidden" onClick={() => window.print()}>
  PDF ডাউনলোড (Print)
</button>

       <div  className=""       style={{ marginTop: 0 }}
            id="printable-area" ref={componentRef}>
        {/* Case Header Info */}
        <div className="text-[16px] text-black case-info">
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

          <div className="mt-2">
            মামলার ধরন: {activeStage.mamlaName} <span>মামলার নংঃ </span>
            {toBanglaNumber(activeStage?.mamlaNo + " ")}/{toBanglaNumber(activeStage?.year)} ({activeStage.district.bn})
          </div>
        </div>

        {/* Order Table */}
        <table className="orders-table">
          <thead>
            <tr>
              <th>আদেশের ক্রমিক নং ও তারিখ</th>
              <th>আদেশ ও অফিসারের সাক্ষর</th>
              <th>আদেশের উপর গৃহীত ব্যবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {[...orders, ...Array(rowsPerPage - orders.length).fill({})].map(
              (sheet, i) => (
                <tr key={i}>
                  <td>{sheet.date || ""}</td>
                  <td>{sheet.order || ""}</td>
                  <td>{sheet.actionTaken || ""}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CaseDetailsSenior;

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Edit, Save, Plus, Trash2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import axiosPublic from "../../axios/axiosPublic";

const CaseDetailsUpper = ({ caseData }) => {
  // console.log(caseData);
  const [orderSheets, setOrderSheets] = useState(
    caseData?.divComReview?.orderSheets || []
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const rowsPerPage = 3;

  const totalPages = Math.ceil(orderSheets.length / rowsPerPage);
  const badi = caseData?.nagorikSubmission?.badi?.[0];
  const bibadi = caseData?.nagorikSubmission?.bibadi?.[0];
  const divComReview = caseData?.divComReview || {};

  const handlePrint = () => {
    window.print();
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...orderSheets];
    updated[index][field] = value;
    setOrderSheets(updated);
  };

  const handleAddRow = () => {
    setOrderSheets([
      ...orderSheets,
      { orderNo: "", date: "", order: "", actionTaken: "" },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updated = orderSheets.filter((_, i) => i !== index);
    setOrderSheets(updated);
  };

  const handleSave = async () => {
    const res = await axiosPublic.patch(`/cases/${caseData._id}`, {
      divComReview: { ...divComReview, orderSheets },
    });
    if (res.data.modifiedCount > 0) {
      alert("সফলভাবে সংরক্ষণ করা হয়েছে");
    }
  };

  const renderCaseHeader = () => (
    <div className="mb-4 text-[14px] text-black case-info">
      <div className="flex justify-between mb-1">
        <div>বাংলাদেশ ফরম নং - {divComReview.formNo}</div>
        <div className="text-right">
          {badi?.name || "বাদী"} <br /> বনাম <br /> {bibadi?.name || "বিবাদী"}
        </div>
      </div>

      <h1 className="mb-1 font-bold text-lg text-center">আদেশপত্র</h1>
      <p className="mb-2 text-center">
        (১৯৯১ সালের ভূমি রেকর্ড ও জরিপ আদেশ ১৯২ নং বিধি অনুযায়ী)
      </p>

      <div className="space-y-2">
        <div className="flex justify-between gap-2 w-full">
          <div className="flex items-center gap-1 w-1/2 whitespace-nowrap">
            <h1 className="inline font-semibold">আদেশপত্র তারিখ</h1>
            <div className="flex-1 border-b border-black border-dotted"></div>
          </div>
          <div className="flex items-center gap-2 w-1/2">
            <label className="font-semibold">হইতে</label>
            <div className="border-b border-black border-dotted w-full"></div>
            <label className="font-semibold">পর্যন্ত</label>
          </div>
        </div>

        <div className="flex justify-between gap-2 w-full">
          <div className="flex items-center gap-1 w-2/5 whitespace-nowrap">
            <h1 className="inline font-semibold">জেলা</h1>
            <div className="flex-1 border-b border-black border-dotted"></div>
          </div>
          <div className="flex items-center gap-2 w-3/5">
            <label className="font-semibold">{toBanglaNumber("২০০")}</label>
            <div className="border-b border-black border-dotted w-full"></div>
            <label className="font-semibold">সালের</label>
            <div className="border-b border-black border-dotted w-full"></div>
            <label className="font-semibold">পর্যন্ত</label>
          </div>
        </div>
      </div>

      <div className="my-4">
        মামলার ধরন: {divComReview.mamlaName} মামলার নংঃ {divComReview.mamlaNo} /
        ({divComReview.year}) ({divComReview.district?.bn})
      </div>
    </div>
  );

  const visibleRows = orderSheets.slice(
    currentPageIndex * rowsPerPage,
    (currentPageIndex + 1) * rowsPerPage
  );
  const handleNext = () => {
    setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevious = () => {
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <>
      <style>{`
 @media print {
  body {
    margin: 0;
    padding: 0;
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
    width: 210mm;
    min-height: 297mm;
    padding: 5mm;
    box-sizing: border-box;
    background: white;
    page-break-after: always;
  }

  .no-print {
    display: none !important;
  }
    textarea,
input {
  border: none;
  outline: none;
  resize: none;
  background: none;
  color: black;
}
  #action{
  display:none
  }

}



`}</style>

      <div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={handlePrint}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            PDF ডাউনলোড (Print)
          </button>

          <button className="btn btn-success" onClick={handleSave}>
            <Save className="w-4" /> সংরক্ষণ করুন
          </button>
          <button className="btn-outline btn" onClick={handleAddRow}>
            <Plus className="w-4" /> নতুন আদেশ
          </button>
        </div>

        <div id="printable-area" className="bg-white p-4">
          {renderCaseHeader()}
          <table className="border w-full text-sm text-center table-fixed">
            <thead>
              <tr className="border-b">
                <th className="p-2 border w-2/12">তারিখ ও নম্বর</th>
                <th className="p-2 border w-7/12">আদেশ ও সাক্ষর</th>
                <th className="p-2 border w-3/12">গৃহীত ব্যবস্থা</th>
                <th id="action" className="p-2 border w-[50px]">
                  X
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={row.date + "\n" + row.orderNo}
                      onChange={(e) => {
                        const [date, orderNo] = e.target.value.split("\n");
                        handleInputChange(
                          currentPageIndex * rowsPerPage + idx,
                          "date",
                          date || ""
                        );
                        handleInputChange(
                          currentPageIndex * rowsPerPage + idx,
                          "orderNo",
                          orderNo || ""
                        );
                      }}
                      className="w-full h-full resize-none"
                      rows={2}
                    />
                  </td>
                  <td className="p-2 border">
                    <textarea
                      value={row.order}
                      onChange={(e) =>
                        handleInputChange(
                          currentPageIndex * rowsPerPage + idx,
                          "order",
                          e.target.value
                        )
                      }
                      className="w-full h-full resize-none"
                      rows={15}
                    ></textarea>
                  </td>
                  <td className="p-2 border">
                    <textarea
                      value={row.actionTaken || ""}
                      onChange={(e) =>
                        handleInputChange(
                          currentPageIndex * rowsPerPage + idx,
                          "actionTaken",
                          e.target.value
                        )
                      }
                      className="w-full h-full resize-none"
                      rows={15}
                    ></textarea>
                  </td>
                  <td id="action" className="p-2 border">
                    <button
                      className="text-red-600"
                      onClick={() =>
                        handleDeleteRow(currentPageIndex * rowsPerPage + idx)
                      }
                    >
                      <Trash2 className="w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="print:hidden flex justify-between items-center mt-4">
          <button
            className="btn btn-sm"
            disabled={currentPageIndex === 0}
            onClick={() => setCurrentPageIndex((prev) => prev - 1)}
          >
            পূর্ববর্তী
          </button>

          <span>
            পৃষ্ঠা {toBanglaNumber(currentPageIndex + 1)} /{" "}
            {toBanglaNumber(totalPages)}
          </span>
          <button
            className="btn btn-sm"
            disabled={currentPageIndex === totalPages - 1}
            onClick={handleNext}
          >
            পরবর্তী
          </button>
        </div>
      </div>
    </>
  );
};
export default CaseDetailsUpper;

import React, { useRef } from "react";
import { toBanglaNumber } from "../../utils/toBanglaNumber";

const CaseDetailsUpper = ({ rootCaseId, activeStage }) => {
  // const orders = activeStage.orderSheets || [];
  const componentRef = useRef();

  const rowsPerPage = 3; // fits A4 height on screen
  const orders = activeStage.orderSheets || [];
  const maxWordsPerPage = 300;

  const pages = [];
  let currentPage = [];
  let currentWordCount = 0;

  orders.forEach((order) => {
    const fullText = order?.order || "";
    const words = fullText.trim().split(/\s+/);
    let wordIndex = 0;

    while (wordIndex < words.length) {
      const spaceLeft = maxWordsPerPage - currentWordCount;
      const remainingWords = words.length - wordIndex;

      if (remainingWords <= spaceLeft) {
        const chunk = words.slice(wordIndex).join(" ");
        currentPage.push({ ...order, order: chunk });
        currentWordCount += remainingWords;
        wordIndex = words.length;
      } else {
        const chunk = words.slice(wordIndex, wordIndex + spaceLeft).join(" ");
        currentPage.push({ ...order, order: chunk });
        pages.push(currentPage);

        // Reset for next page
        currentPage = [];
        currentWordCount = 0;
        wordIndex += spaceLeft;
      }
    }
  });

  // Push the last page if not empty
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  console.log(pages);

  // const pages = [];
  // for (let i = 0; i < orders.length; i += rowsPerPage) {
  //   pages.push(orders.slice(i, i + rowsPerPage));
  // }
  // Debug: See how your orders are grouped

  const renderCaseHeader = () => (
    <div className="mb-4 text-[14px] text-black case-info">
      <div className="flex justify-between mb-1">
        <div>বাংলাদেশ ফরম নং - {activeStage?.orderSheets[0].formNo}</div>
        <div className="text-right">
          {activeStage?.nagorikData?.badi[0].name ||
            activeStage.badi[0].badiName}{" "}
          <br />
          বনাম
          <br />
          {activeStage?.nagorikData.bibadi[0].name}
          <br />
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
            <label className="font-semibold">২০০</label>
            <div className="border-b border-black border-dotted w-full"></div>
            <label className="font-semibold">সালের</label>
            <div className="border-b border-black border-dotted w-full"></div>
            <label className="font-semibold">পর্যন্ত</label>
          </div>
        </div>
      </div>

      <div className="my-4">
        মামলার ধরন: {activeStage.mamlaName} মামলার নংঃ{" "}
        {activeStage?.mamlaNo + " "}/({activeStage?.year}) (
        {activeStage.district?.bn})
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
            className="bg-white mx-auto mb-10 p-5 w-[210mm] h-[297mm]"
          >
            {renderCaseHeader()}

            <table className="border w-full min-h-[200mm] text-sm text-center table-fixed">
              <thead>
                <tr className="border-b">
                  <th className="p-2 border w-2/12 break-words">
                    আদেশের ক্রমিক নং ও তারিখ
                  </th>
                  <th className="p-2 border w-7/12 break-words">
                    আদেশ ও অফিসারের সাক্ষর
                  </th>
                  <th className="p-2 border w-3/12 break-words">
                    আদেশের উপর গৃহীত ব্যবস্থা
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {[
                  ...pageOrders,
                  ...Array(rowsPerPage - pageOrders.length).fill({}),
                ].map((sheet, i) => (
                  <tr className="h-auto" key={i}>
                    <td className="p-3 border-r break-words whitespace-pre-wrap">
                      <h1 className="">
                        {sheet.date || "  "} <br />
                      </h1>
                      {sheet.date && <div className="m-0 divider"></div>}
                      <h1>{sheet.orderNo || ""}</h1>
                    </td>
                    <td className="p-3 border-r break-words whitespace-pre-wrap">
                      {sheet.order || ""}
                    </td>
                    <td className="p-3 border-r break-words whitespace-pre-wrap">
                      {sheet.actionTaken || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* <tfoot></tfoot> */}
            </table>
            {/* <div className="divider"></div> */}
          </div>
        ))}
      </div>
    </>
  );
};

export default CaseDetailsUpper;

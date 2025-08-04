import React, { useEffect, useRef, useState } from "react";
import { Save, Plus, Trash2, Printer } from "lucide-react";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import axiosPublic from "../../../axios/axiosPublic";
import { toast } from "sonner";

const AdcOrderDetails = ({ caseData, officeName, refetch }) => {
  const matchingResponses =
    caseData.responsesFromOffices?.filter(
      (res) => res.role === "adc" && res.officeName?.en === officeName?.en
    ) || [];

  const mergedOrderSheets = matchingResponses.flatMap(
    (res) => res.orderSheets || []
  );
  console.log(matchingResponses);

  const [orderSheets, setOrderSheets] = useState(mergedOrderSheets);

  // Take metadata from the most recent response
  const latestResponse = matchingResponses[matchingResponses.length - 1] || {};

  const [headerInfo, setHeaderInfo] = useState({
    formNo: latestResponse.formNo || "",
    mamlaName: latestResponse.mamlaName || "",
    mamlaNo: latestResponse.mamlaNo || "",
    year: latestResponse.year || "",
    district: latestResponse.district?.bn || "",
  });

  const textareaRefs = useRef([]);

  useEffect(() => {
    orderSheets.forEach((_, idx) => {
      const ref = textareaRefs.current[idx];
      if (ref) {
        ref.style.height = "auto";
        ref.style.height = `${ref.scrollHeight}px`;
      }
    });
  }, [orderSheets]);

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
    try {
      // Update the last matched response only
      const updatedResponse = {
        ...latestResponse,
        orderSheets,
      };

      const updatedPayload = {
        responsesFromOffices: [updatedResponse],
      };

      const res = await axiosPublic.patch(
        `/cases/${caseData._id}`,
        updatedPayload
      );

      if (res.data.modifiedCount > 0) {
        toast.success("✅ সফলভাবে সংরক্ষণ ও প্রেরণ করা হয়েছে");
        refetch(); // Refetch to get the latest data
      } else {
        toast.warning("⚠️ কোনো পরিবর্তন সংরক্ষণ হয়নি");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ সংরক্ষণে সমস্যা হয়েছে");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderCaseHeader = () => (
    <div className="mb-4 text-[14px] text-black case-info">
      <div className="flex justify-between mb-1">
        <div>বাংলাদেশ ফরম নং - {headerInfo.formNo || "-"}</div>
        <div className="text-right">
          {caseData.nagorikSubmission?.badi?.[0]?.name || "বাদী"} <br /> বনাম{" "}
          <br />
          {caseData.nagorikSubmission?.bibadi?.[0]?.name || "বিবাদী"}
        </div>
      </div>

      <h1 className="mb-1 font-bold text-lg text-center">আদেশপত্র</h1>
      <p className="mb-10 text-center">
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
        মামলার ধরন: {headerInfo.mamlaName || "-"} মামলার নংঃ{" "}
        {headerInfo.mamlaNo || "-"} / ({headerInfo.year || "-"}) (
        {headerInfo.district || "-"})
      </div>
    </div>
  );

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
          }
          .no-print {
            display: none !important;
          }
          textarea, input {
            border: none;
            outline: none;
            resize: none;
            background: none;
            color: black;
          }
          #action {
            display: none;
          }
        }
      `}</style>

      <div className="flex justify-end gap-2 mb-4">
        <button onClick={handlePrint} className="no-print btn btn-sm btn-info">
          <Printer /> প্রিন্ট করুন
        </button>
      </div>

      <div id="printable-area" className="bg-white p-4">
        {renderCaseHeader()}

        <table className="border w-full h-full text-sm text-center table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-2 border w-2/12">তারিখ ও নম্বর</th>
              <th className="p-2 border w-7/12">আদেশ ও সাক্ষর</th>
              <th className="p-2 border w-3/12">গৃহীত ব্যবস্থা</th>
              {!matchingResponses && (
                <th id="action" className="p-2 border w-[50px]">
                  X
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {orderSheets.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border-r align-top">
                  <div className="flex flex-col items-center">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleInputChange(idx, "date", e.target.value)
                      }
                      className="w-full text-center input"
                    />
                  </div>

                  <div className="m-0 p-0 divider"></div>
                  <textarea
                    value={row.orderNo}
                    placeholder="আদেশের নম্বর"
                    onChange={(e) =>
                      handleInputChange(idx, "orderNo", e.target.value)
                    }
                    className="w-full overflow-hidden text-center resize-none"
                  />
                </td>
                <td className="p-2 border-r align-top">
                  <textarea
                    ref={(el) => (textareaRefs.current[idx] = el)}
                    value={row.order}
                    placeholder="আদেশ ও সাক্ষর"
                    onChange={(e) => {
                      handleInputChange(idx, "order", e.target.value);
                      const el = e.target;
                      el.style.height = "auto";
                      el.style.height = `${el.scrollHeight}px`;
                    }}
                    className="w-full overflow-hidden resize-none"
                  />
                </td>
                <td className="p-2 border-r align-top">
                  <textarea
                    ref={(el) => (textareaRefs.current[idx + "-action"] = el)}
                    value={row.actionTaken || ""}
                    placeholder="গৃহীত ব্যবস্থা"
                    onChange={(e) => {
                      handleInputChange(idx, "actionTaken", e.target.value);
                      const el = e.target;
                      el.style.height = "auto";
                      el.style.height = `${el.scrollHeight}px`;
                    }}
                    className="w-full overflow-hidden resize-none"
                  />
                </td>
                {!matchingResponses && (
                  <td id="action" className="p-2 border-r">
                    <button
                      className="text-red-600 btn btn-sm btn-ghost"
                      onClick={() => handleDeleteRow(idx)}
                    >
                      <Trash2 className="w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!matchingResponses && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button className="btn-outline btn" onClick={handleAddRow}>
            <Plus className="w-4" /> নতুন আদেশ
          </button>

          <button className="btn btn-success" onClick={handleSave}>
            <Save /> সংরক্ষণ ও প্রেরণ
          </button>
        </div>
      )}
    </>
  );
};

export default AdcOrderDetails;

import React, { useContext, useEffect, useRef, useState } from "react";
import { Save, Plus, Trash2, Printer } from "lucide-react";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import axiosPublic from "../../../axios/axiosPublic";
import { toast } from "sonner";
import { AuthContext } from "../../../provider/AuthProvider";
import Swal from "sweetalert2";

const DivComDetails = ({ caseData,refetch }) => {
  const [orderSheets, setOrderSheets] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const {user}=useContext(AuthContext)

  
  useEffect(() => {
    if (caseData?.divComReview?.orderSheets) {
      setOrderSheets(caseData.divComReview.orderSheets);
    }
  }, [caseData?.divComReview?.orderSheets]);
  const [showHeaderModal, setShowHeaderModal] = useState(false);

  const badi = caseData?.nagorikSubmission?.badi?.[0];
  const bibadi = caseData?.nagorikSubmission?.bibadi?.[0];
  const divComReview = caseData?.divComReview || {};

  const [headerInfo, setHeaderInfo] = useState({
  });
  useEffect(() => {
    if (divComReview) {
      setHeaderInfo({
        formNo: divComReview.formNo || "",
        mamlaName: divComReview.mamlaName || "",
        mamlaNo: divComReview.mamlaNo || "",
        year: divComReview.year || "",
        district: divComReview.district?.bn || "",
      });
    }
  }, [divComReview, showHeaderModal]);
  // Refs for auto-growing textareas
  const textareaRefs = useRef([]);

  useEffect(() => {
    orderSheets.forEach((_, idx) => {
      const ref = textareaRefs.current[idx];
      if (ref) {
        ref.style.height = "auto";
        ref.style.height = `${ref.scrollHeight}px`;
      }
    });
  }, [orderSheets,caseData]);
  const toggleEditing = (rowIndex, fieldName) => {
    const key = `${rowIndex}-${fieldName}`;
    setEditingFields((prev) => ({ ...prev, [key]: true }));
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

  const handleDeleteRow =async (index) => {
    console.log(index )
    const confirm = await Swal.fire({
      title: "আপনি কি ডিলেট  চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, করুন!",
    });

    if (!confirm.isConfirmed) return;
    setEditingRow(index)
    const updated = orderSheets.filter((_, i) => i !== index);
    setOrderSheets(updated);
  };

  const handleSave = async () => {
    try {
      console.log("📦 Saving order sheets:", orderSheets);

      const res = await axiosPublic.patch(`/cases/${caseData._id}`, {
        divComReview: {
          ...divComReview,
          orderSheets,
        },
      });

      if (res.data.modifiedCount > 0) {
        toast("✅ সফলভাবে সংরক্ষণ করা হয়েছে");
        setEditingRow(null);


      } else {
        toast("⚠️ কোনো পরিবর্তন সংরক্ষণ হয়নি");
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      toast("সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  const handlePrint = () => {
    window.print();
  };
  const handleHeader = async () => {
    {
      const { orderSheets, ...rest } = divComReview || {};

const updatedHeader = {
  ...rest,
  formNo: headerInfo.formNo,
  mamlaName: headerInfo.mamlaName,
  mamlaNo: headerInfo.mamlaNo,
  year: headerInfo.year,
  district: {
    ...divComReview?.district,
    bn: headerInfo.district,
  },
};

      const res = await axiosPublic.patch(`/cases/${caseData._id}`, {
        divComReview: updatedHeader,
      });
      if (res.data.modifiedCount > 0) {
        setShowHeaderModal(false);
        toast("হেডার তথ্য সংরক্ষণ হয়েছে");
        refetch(  )
        // location.reload(); // Or refresh divComReview in state if you want live update
      } else {
        toast("হেডার তথ্য সংরক্ষণে সমস্যা হয়েছে");
      }
    }
  };
  const handleAddOrder = () => {
    navigate(`/dashboard/${user?.role}/cases/new`, {
      state: { caseData, mode: "add" },
    });
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
        মামলার ধরন: {divComReview.mamlaName} মামলার নংঃ {divComReview.mamlaNo} /
        ({divComReview.year}) ({divComReview.district?.bn})
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

      <div>
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={handleAddOrder}
            className="flex btn-success btn-sm btn"
          >
            <Plus /> নতুন আদেশ
          </button>
          <button
            onClick={handlePrint}
            className="no-print btn btn-sm btn-info"
          >
            <Printer /> প্রিন্ট করুন
          </button>
          <button
            onClick={() => setShowHeaderModal(true)}
            className="mb-2 btn-outline btn btn-sm"
          >
            হেডার এডিট করুন
          </button>
        </div>

        <div id="printable-area" className="bg-white p-4">
          {renderCaseHeader()}

          <table className="border w-full text-sm text-center table-auto">
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
  {orderSheets.map((row, idx) => {
    const isEditing = editingRow === idx;

    return (
      <tr key={idx}>
        <td className="p-2 border-r align-top">
          <div className="flex flex-col items-center">
            <input
              type="date"
              value={row.date}
              readOnly={!isEditing || user?.role !== "divCom"}
              onChange={(e) =>
                handleInputChange(idx, "date", e.target.value)
              }
              className="w-full text-center input"
            />
          </div>

          <textarea
            value={row.orderNo}
            placeholder="আদেশের নম্বর"
            readOnly={!isEditing || user?.role !== "divCom"}
            onChange={(e) =>
              handleInputChange(idx, "orderNo", e.target.value)
            }
            className="w-full overflow-hidden resize-none"
          />
        </td>

        <td className="p-2 border-r align-top">
          <textarea
            ref={(el) => (textareaRefs.current[idx] = el)}
            value={row.order}
            placeholder="আদেশ ও সাক্ষর"
            readOnly={!isEditing || user?.role !== "divCom"}
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
            readOnly={!isEditing || user?.role !== "divCom"}
            onChange={(e) => {
              handleInputChange(idx, "actionTaken", e.target.value);
              const el = e.target;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
            className="w-full overflow-hidden resize-none"
          />
        </td>

        <td id="action" className="p-2 border-r space-y-2">
          
              {!isEditing ? (
                <button
                  className="text-blue-600 btn btn-sm btn-ghost"
                  onClick={() => setEditingRow(idx)}
                >
                  ✏️
                </button>
              ) : (
                <span className="text-green-600 text-xs">Editing</span>
              )}
         
    
          <button
            className="text-red-600 btn btn-sm btn-ghost"
            onClick={() => handleDeleteRow(idx)}
          >
            <Trash2 className="w-4" />
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <button className="btn-outline btn" onClick={handleAddRow}>
          <Plus className="w-4" /> নতুন আদেশ
        </button>
        {editingRow !== null && (
        <button className="btn btn-success" onClick={handleSave}>
          <Save /> সংরক্ষণ করুন
        </button>)}
      </div>

      {showHeaderModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="space-y-4 bg-white p-6 rounded-md w-[400px]">
            <h2 className="font-semibold text-lg">হেডার তথ্য হালনাগাদ</h2>

            <input
              type="text"
              value={headerInfo.formNo}
              onChange={(e) =>
                setHeaderInfo({ ...headerInfo, formNo: e.target.value })
              }
              className="input-bordered w-full input"
              placeholder="ফরম নম্বর"
            />
            <input
              type="text"
              value={headerInfo.mamlaName}
              onChange={(e) =>
                setHeaderInfo({ ...headerInfo, mamlaName: e.target.value })
              }
              className="input-bordered w-full input"
              placeholder="মামলার ধরন"
            />
            <input
              type="text"
              value={headerInfo.mamlaNo}
              onChange={(e) =>
                setHeaderInfo({ ...headerInfo, mamlaNo: e.target.value })
              }
              className="input-bordered w-full input"
              placeholder="মামলা নম্বর"
            />
            <input
              type="text"
              value={headerInfo.year}
              onChange={(e) =>
                setHeaderInfo({ ...headerInfo, year: e.target.value })
              }
              className="input-bordered w-full input"
              placeholder="সাল"
            />
            <input
              type="text"
              value={headerInfo.district}
              onChange={(e) =>
                setHeaderInfo({ ...headerInfo, district: e.target.value })
              }
              className="input-bordered w-full input"
              placeholder="জেলা"
            />

            <div className="flex justify-end gap-2">
              <button
                className="btn-outline btn"
                onClick={() => setShowHeaderModal(false)}
              >
                বাতিল
              </button>
              

              <button className="btn btn-primary" onClick={handleHeader}>
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DivComDetails;

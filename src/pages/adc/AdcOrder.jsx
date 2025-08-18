import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Printer,
  ArrowLeft,
  Edit,
  Edit2,
  Send,
  Pencil,
  PencilOff,
} from "lucide-react";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import axiosPublic from "../../axios/axiosPublic";
import { toast } from "sonner";
import { AuthContext } from "../../provider/AuthProvider";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { mamlaNames } from "../../data/mamlaNames";
import { aclandOptions } from "../../data/aclandOptions";
import Tippy from "@tippyjs/react";
const AdcOrder = ({ header }) => {
  // console.log(header.mamlaName);
  const [orderSheets, setOrderSheets] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  // Fetch the full case data
  const {
    data: caseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adcOrder", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const adcCaseData = useMemo(() => {
    const responses = caseData?.responsesFromOffices;
    return Array.isArray(responses)
      ? responses.find((r) => r.role === "adc")
      : {};
  }, [caseData]);
  // console.log(adcCaseData);

  // Extract adc data using useEffect (not useMemo)
  useEffect(() => {
    // console.log(caseData.responsesFromOffices.length);
    if (caseData?.responsesFromOffices?.length > 0) {
      const adcData = caseData.responsesFromOffices.find(
        (r) => r.role === "adc"
      );
      console.log(adcData);
      if (adcData?.orderSheets) {
        setOrderSheets(adcData.orderSheets);
      }
      console.log(adcData);
    }
  }, [caseData]);
  const [showHeaderModal, setShowHeaderModal] = useState(false);

  const badi = caseData?.nagorikSubmission?.badi?.[0];
  const bibadi = caseData?.nagorikSubmission?.bibadi?.[0];

  const [headerInfo, setHeaderInfo] = useState({});
  useEffect(() => {
    if (adcCaseData || header) {
      // console.log(header);
      setHeaderInfo((prev) => {
        const newInfo = {
          formNo: adcCaseData?.formNo || header?.formNo || "",
          mamlaName: adcCaseData?.mamlaName || header?.mamlaName || "",
          mamlaNo: adcCaseData?.mamlaNo || header?.mamlaNo || "",
          year: adcCaseData?.year || header?.year || "",
          district: adcCaseData?.district || header?.district || "",
        };

        // Avoid infinite loop by checking if update is needed
        if (JSON.stringify(prev) !== JSON.stringify(newInfo)) {
          return newInfo;
        }
        return prev;
      });
    }
  }, [adcCaseData, header, showHeaderModal]);

  // Refs for auto-growing textareas
  const textareaRefs = useRef([]);

  useEffect(() => {
    orderSheets.forEach((row, idx) => {
      ["judgeNote", "staffNote", "actionTaken"].forEach((field) => {
        const ref = textareaRefs.current[`${idx}-${field}`];
        if (ref) {
          ref.style.height = "auto";
          ref.style.height = `${ref.scrollHeight}px`;
        }
      });
    });
  }, [orderSheets]);

  const toggleEditing = (rowIndex, fieldName) => {
    const key = `${rowIndex}-${fieldName}`;
    setEditingFields((prev) => ({ ...prev, [key]: true }));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...orderSheets];

    if (field === "judgeNote") {
      // Ensure prefix
      if (!updated[index][field]) {
        updated[index][field] = "    দেখলাম ...";
      }

      if (!value.startsWith("    দেখলাম ...")) {
        value = "    দেখলাম ..." + value.replace(/^দেখলাম\s*\.*\.*\s*/, "");
      }
    }

    updated[index][field] = value;
    setOrderSheets(updated);

    // Auto-grow the textarea
    const ref = textareaRefs.current[`${index}-${field}`];
    if (ref) {
      ref.style.height = "auto";
      ref.style.height = `${ref.scrollHeight}px`;
    }
  };
  const toBanglaDigits = (str = "") =>
    String(str).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  const formatBanglaISO = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return toBanglaDigits(`${y}-${m}-${d}`); // or `${d}-${m}-${y}` if you prefer
  };
  const addFirstRow = () => {
    const { aclandMamlaInfo, adcMamlaInfo } = caseData.nagorikSubmission || {};
    if (!caseData?.divComReview?.orderSheets || orderSheets.length === 0) {
      const firstStaffNote = `    ${aclandMamlaInfo[0]?.district.bn} জেলার ${
        aclandMamlaInfo[0]?.officeName.bn || "___"
      } উপজেলার ভূমি সংক্রান্তে সহকারী কমিশনার (ভূমি), ${
        aclandMamlaInfo[0]?.officeName.bn || "___"
      } কর্তৃক ${aclandMamlaInfo[0].mamlaName || "___"} মামলা নং ${
        toBanglaNumber(aclandMamlaInfo[0].mamlaNo) || "___"
      }/${
        toBanglaNumber(aclandMamlaInfo[0].year) || "___"
      } খ্রী. তারিখের আদেশের বিরুদ্ধে নামজারি রিভিশন মামলা দায়েরের প্রার্থনায় ${
        caseData?.nagorikSubmission?.badi?.[0]?.name || "বাদীর নাম"
      } ${
        caseData?.nagorikSubmission?.badi?.length > 1 ? "গং পক্ষে" : ""
      } এই আবেদন দাখিল করা হয়েছে। ${
        caseData?.nagorikSubmission?.tamadi
          ? `অপরদিকে তামাদি আইনের ৫ ধারামতে ${
              caseData?.divComReview?.mamlaName.includes("আপিল")
                ? "আপিলকারী"
                : "রিভিশনকারী"
            } তামাদি মওকুফের আবেদন করেন।`
          : ""
      }`;

      const initialOrderSheet = [
        {
          orderNo: "১",
          orderDate: new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Dhaka",
          }),
          staffNote: firstStaffNote,
          judgeNote: "",
          nextDate: "",
          actionTaken: "",
        },
      ];

      setOrderSheets(initialOrderSheet);
    }
  };

  const handleAddRow = () => {
    if (orderSheets.length === 0) {
      addFirstRow();
    } else {
      setOrderSheets((prev) => [
        ...prev,
        {
          orderNo: `${prev.length + 1}`,
          orderDate: "",
          staffNote: "",
          judgeNote: "",
          nextDate: "",
          actionTaken: "",
        },
      ]);
    }
  };

  const handleDeleteRow = async (index) => {
    const confirm = await Swal.fire({
      title: "আপনি কি ডিলেট চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, করুন!",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Assuming each row is a unique object in orderSheets
      const rowToDelete = orderSheets[index];

      const res = await axiosPublic.patch(`/cases/adc/${caseData._id}/delete`, {
        deleteOrderSheet: {
          role: "adc", // or user.role
          officeName: user?.officeName,
          district: user?.district,
          orderSheet: rowToDelete,
        },
      });

      if (res.status === 200) {
        toast.success("সফলভাবে ডিলেট হয়েছে!");
        setOrderSheets((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error(err);
      toast.error("ডিলেট করতে সমস্যা হয়েছে");
    }
  };

  const handleSave = async () => {
    try {
      console.log("📦 Saving order sheets:", orderSheets);
      if (orderSheets.length === 0) {
        toast("⚠️ আদেশের তথ্য খালি রাখা যাবে না");
        return;
      }
      const res = await axiosPublic.patch(`/cases/adc/${caseData._id}/add`, {
        responsesFromOffices: [
          {
            officeName: user?.officeName,
            district: user?.district,
            role: "adc",
            orderSheets,
          },
        ],
      });

      console.log(res.data);

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
    const { orderSheets, adcHeaderData, ...rest } = adcCaseData || {};

    const updatedFields = {
      ...rest,
      formNo: headerInfo.formNo,
      mamlaName: headerInfo.mamlaName,
      mamlaNo: headerInfo.mamlaNo,
      year: headerInfo.year,
      district: headerInfo.district,
      officeName: headerInfo.officeName, // Fix: don't assign district to officeName
    };

    const res = await axiosPublic.patch(`/cases/adc/${caseData._id}/header`, {
      updatedFields,
    });

    if (res.data.modifiedCount > 0) {
      setShowHeaderModal(false);
      toast(" তথ্য সংরক্ষণ হয়েছে");
      refetch();
    } else {
      toast(" তথ্য সংরক্ষণে সমস্যা হয়েছে");
    }
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? null : date;
  };
  const generateDefaultActionText = (order, date) => {
    console.log(order);
    const newText = `মামলা নং ${order.mamlaNo} (${
      order.mamlaName
    }) সংক্রান্ত আদেশ অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব) আদালতে ${
      date?.split("T")[0] || "___"
    } তারিখে প্রেরণ করা হয়েছে।`;

    // Append if existing text present
    return newText;
  };

  const handleSend = async (order) => {
    const confirm = await Swal.fire({
      title: "আপনি কি প্রেরণ করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রেরণ করুন",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Find the adc response from caseData
      const adcResp = caseData.responsesFromOffices.find(
        (resp) => resp.role === "adc"
      );

      if (!adcResp) {
        toast.error("ADC response data not found.");
        return;
      }

      // Prepare updated actionTaken text
      const updatedActionTaken = order?.actionTaken
        ? order?.actionTaken +
          "\n" +
          generateDefaultActionText(headerInfo, new Date().toISOString())
        : generateDefaultActionText(headerInfo, new Date().toISOString());

      // Prepare payload to update only the matching order sheet
      const payload = {
        responsesFromOffices: [
          {
            role: adcResp.role,

            officeName: { en: adcResp.officeName.en },
            district: { en: adcResp.district.en },
            orderSheets: [
              {
                orderNo: order.orderNo,
                actionTaken: updatedActionTaken,
                sentToDivcom: true,
                sentDate: new Date().toISOString(),
              },
            ],
          },
        ],
        mamlaNo: adcResp.mamlaNo, // 👈 add the mamlaNo being replied
      };

      // Send PATCH request to backend endpoint for sending order
      const res = await axiosPublic.patch(
        `/cases/adc/${caseData._id}/send`,
        payload
      );
      console.log(res.data, "tottho send ");

      if (res.data.modifiedCount > 0) {
        toast.success(`অর্ডার নং ${order.orderNo} সফলভাবে প্রেরণ হয়েছে!`);
        refetch(); // Refresh data after update
      } else {
        toast.error("মামলা প্রেরণে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error(error);
      toast.error("পাঠাতে সমস্যা হয়েছে!");
    }
  };

  const renderCaseHeader = () => (
    <div className="mb-4 h-full text-[14px] text-black case-info">
      <div className="flex justify-between mb-1">
        <div>বাংলাদেশ ফরম নং - ২৭০</div>
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
        মামলার ধরন: {headerInfo?.mamlaName} মামলা নং{" "}
        {toBanglaNumber(headerInfo?.mamlaNo)} /
        {toBanglaNumber(headerInfo?.year)} ({headerInfo?.district?.bn})
      </div>
    </div>
  );
  return (
    <>
      <style>{`
        @media print {
  textarea::placeholder,
  input::placeholder {
    color: transparent !important;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;

  }

  .no-print {
    display: none !important; /* hide elements you don't want in print */
  }

  #printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 216mm;  /* Legal width */
    height: 356mm; /* Legal height */
    padding: 5mm;
    box-sizing: border-box;
    background: white;
  }

  /* make table fit page */
  table {
    table-layout: fixed;
    width: 100%;
    height: 100%;
    border-collapse: collapse;
  }

  td, th {
    page-break-inside: auto; /* allow rows to break across pages */
        page-break-inside: avoid; /* for rows you never want split */

    border: 1px solid black;
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
      <div className="bg-base-200/30 rounded-xl h-full">
        <div className="flex justify-end gap-2 mx-4 my-5 pb-2 border-gray-300 border-b no-print">
          {user?.role == "adc" && !adcCaseData?.sentToDivcom && (
            <>
              <button
                onClick={handleAddRow}
                className="flex btn-success btn-sm btn"
              >
                <Plus /> নতুন আদেশ
              </button>

              <button
                onClick={() => setShowHeaderModal(true)}
                className="mb-2 btn-outline btn btn-sm"
              >
                <Edit2 className="w-4 text-sm" /> শিরোনাম হালনাগাত
              </button>
            </>
          )}
          <button
            onClick={handlePrint}
            className="no-print btn btn-sm btn-info"
          >
            <Printer /> প্রিন্ট করুন
          </button>
        </div>

        <div id="printable-area" className="p-4 min-h-screen">
          <div className="header">
            {renderCaseHeader()} {/* header info */}
          </div>

          <table className="border w-full text-sm text-center table-auto">
            <thead>
              <tr className="border-b">
                <th className="p-2 border w-2/12">তারিখ ও নম্বর</th>
                <th className="p-2 border w-7/12">আদেশ ও সাক্ষর</th>
                <th className="p-2 border w-3/12">গৃহীত ব্যবস্থা</th>
                {user.role === "adc" && (
                  <th id="action" className="p-2 border w-[50px]">
                    X
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orderSheets.map((order, idx) => {
                const isEditing = editingRow === idx;

                return (
                  <tr className="" key={idx}>
                    <td className="mt-5 px-1 py-4 border-r w-2/12 align-top">
                      <div className="flex flex-col items-center border-b">
                        {isEditing && user?.role === "adc" ? (
                          <>
                            <input
                              type="date"
                              value={order?.orderDate || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  idx,
                                  "orderDate",
                                  e.target.value
                                )
                              }
                              className="w-full text-center input screen-only"
                              readOnly={!isEditing || user?.role !== "adc"}
                            />
                            {/* Bangla mirror for screen */}
                            <div className="text-sm screen-only">
                              {formatBanglaISO(order?.orderDate) ||
                                "তারিখ নির্বাচন করুন"}
                            </div>
                          </>
                        ) : (
                          // Read-only Bangla on screen
                          <span className="screen-only">
                            {formatBanglaISO(order?.orderDate)}
                          </span>
                        )}
                      </div>

                      <textarea
                        value={order.orderNo}
                        placeholder="আদেশের নম্বর"
                        readOnly={!isEditing || user?.role !== "adc"}
                        onChange={(e) =>
                          handleInputChange(idx, "orderNo", e.target.value)
                        }
                        className="w-full overflow-hidden text-center resize-none"
                      />
                    </td>

                    <td className="p-2 pt-4 border-r w-7/12 align-top">
                      {/* <p className="font-semibold text-xs text-left">
                        অফিস সহকারীর মন্তব্য
                      </p> */}
                      <textarea
                        ref={(el) =>
                          (textareaRefs.current[`${idx}-staffNote`] = el)
                        }
                        value={order.staffNote || ""}
                        placeholder="সহকারীর মন্তব্য"
                        readOnly={!isEditing || user?.role !== "adc"}
                        onChange={(e) =>
                          handleInputChange(idx, "staffNote", e.target.value)
                        }
                        className="w-full overflow-hidden resize-none"
                      />

                      {/* <p className="font-semibold text-xs text-left">
                        ডিভিশনাল কমিশনার এর আদেশ
                      </p> */}
                      <textarea
                        ref={(el) =>
                          (textareaRefs.current[`${idx}-judgeNote`] = el)
                        }
                        value={order.judgeNote}
                        readOnly={!isEditing || user?.role !== "adc"}
                        placeholder="দেখলাম ..."
                        onChange={(e) =>
                          handleInputChange(idx, "judgeNote", e.target.value)
                        }
                        className="mt-8 w-full overflow-hidden resize-none"
                      />

                      {/* next data */}
                      <div className="flex flex-col justify-end items-end mt-5">
                        {isEditing && user?.role === "adc" ? (
                          <>
                            <DatePicker
                              selected={parseDate(order.nextDate)}
                              readOnly={!isEditing || user?.role !== "adc"}
                              onChange={(date) =>
                                handleInputChange(
                                  idx,
                                  "nextDate",
                                  date?.toISOString().split("T")[0]
                                )
                              }
                              customInput={
                                <input
                                  type="text"
                                  className="text-center input"
                                  value={formatBanglaISO(order.nextDate || "")}
                                />
                              }
                              dateFormat="yyyy-MM-dd"
                              placeholderText="পরবর্তী তারিখ"
                            />
                            {/* Bangla mirror for screen */}
                            <div className="mt-5 w-1/3 text-sm screen-only">
                              {formatBanglaISO(order?.nextDate) ||
                                "তারিখ নির্বাচন করুন"}
                            </div>
                          </>
                        ) : (
                          // Read-only Bangla on screen
                          <span className="mt-5 w-1/3 screen-only">
                            {formatBanglaISO(order?.nextDate)}
                          </span>
                        )}

                        {/* sorbosesh obostha */}
                        <input
                          type="text"
                          value={order?.lastCondition}
                          readOnly={!isEditing || user?.role !== "adc"}
                          onChange={(e) =>
                            handleInputChange(
                              idx,
                              "lastCondition",
                              e.target.value
                            )
                          }
                          className="my-3 input-bordered w-1/2 text-center input"
                          placeholder="সর্বশেষ অবস্থা"
                        />

                        {order.signatureUrl ? (
                          <img
                            src={order.signatureUrl}
                            alt="স্বাক্ষর"
                            className="mt-3 mb-5 w-32 h-auto"
                          />
                        ) : (
                          <div
                            className="mt-3 mb-5 border-b border-black w-32 h-12 no-print"
                            style={{ display: "inline-block" }}
                          >
                            <input
                              className="mb-5 text-center"
                              placeholder="স্বাক্ষর"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-1 pt-5 border-r w-3/12 text-center align-top">
                      <textarea
                        ref={(el) =>
                          (textareaRefs.current[`${idx}-actionTaken`] = el)
                        }
                        value={order.actionTaken}
                        placeholder="গৃহীত ব্যবস্থা"
                        readOnly={!isEditing || user?.role !== "adc"}
                        onChange={(e) => {
                          handleInputChange(idx, "actionTaken", e.target.value);
                          const el = e.target;
                          el.style.height = "auto";
                          el.style.height = `${el.scrollHeight}px`;
                        }}
                        className="w-full overflow-hidden text-center resize-none"
                      />
                    </td>
                    {user?.role == "adc" && !order?.sentToDivcom && (
                      <td id="action" className="space-y-2 p-2 border-r">
                        {!isEditing ? (
                          <Tippy
                            className=""
                            content="সম্পাদন করুন "
                            animation="scale"
                            duration={[150, 100]} // faster show/hide
                          >
                            <button
                              className="btn btn-sm"
                              onClick={() => setEditingRow(idx)}
                            >
                              <Pencil className="w-4" />
                            </button>
                          </Tippy>
                        ) : (
                          <Tippy
                            content="সম্পাদন বন্ধ করুন"
                            animation="scale"
                            duration={[150, 100]} // faster show/hide
                          >
                            <span
                              onClick={() => setEditingRow(null)}
                              className="text-green-600 text-xs btn btn-sm"
                            >
                              <PencilOff className="w-4" />
                            </span>
                          </Tippy>
                        )}
                        <Tippy
                          content="মুছে ফেলুন "
                          animation="scale"
                          duration={[150, 100]} // faster show/hide
                        >
                          <button
                            className="text-red-600 btn btn-sm"
                            onClick={() => handleDeleteRow(idx)}
                          >
                            <Trash2 className="w-4" />
                          </button>
                        </Tippy>

                        <div className="flex justify-center items-center">
                          <Tippy
                            content=" বিভাগীয় কমিশনার অফিসে প্রেরণ করুন "
                            animation="scale"
                            duration={[150, 100]} // faster show/hide
                          >
                            <button
                              onClick={() => handleSend(order)}
                              className="btn btn-sm btn-success"
                            >
                              <h1>
                                <Send className="w-4 text-xl" />
                              </h1>
                            </button>
                          </Tippy>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-2 mb-10">
          {user.role === "adc" && (
            <>
              <button className="btn-outline btn" onClick={handleAddRow}>
                <Plus className="w-4" /> নতুন আদেশ
              </button>

              {editingRow !== null && orderSheets.length > 0 && (
                <button className="btn btn-success" onClick={handleSave}>
                  <Save /> সংরক্ষণ করুন
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {showHeaderModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="space-y-4 bg-base-200 p-6 rounded-md w-[400px]">
            <h2 className="font-semibold text-lg">হেডার তথ্য হালনাগাদ</h2>

            {/* <input
              type="text"
              value={headerInfo.formNo}
              onChange={(e) =>
                setHeaderInfo({ ...headerInfo, formNo: e.target.value })
              }
              className="input-bordered w-full input"
              placeholder="ফরম নম্বর"
            /> */}
            <label>
              মামলার ধরন:
              <select
                name="mamlaName"
                value={headerInfo.mamlaName}
                onChange={(e) =>
                  setHeaderInfo({ ...headerInfo, mamlaName: e.target.value })
                }
                className="bg-gray-100 mt-1 w-full select-bordered select"
                required
              >
                <option value="">নির্বাচন করুন</option>
                {mamlaNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              মামলা নং:
              <input
                name="mamlaNo"
                type="number"
                value={headerInfo.mamlaNo}
                onChange={(e) =>
                  setHeaderInfo({ ...headerInfo, mamlaNo: e.target.value })
                }
                className="bg-gray-100 input-bordered w-full input"
                required
              />
            </label>

            <label>
              সাল:
              <select
                name="year"
                value={headerInfo.year}
                onChange={(e) =>
                  setHeaderInfo({ ...headerInfo, year: e.target.value })
                }
                className="bg-gray-100 input-bordered w-full input"
              >
                {Array.from({ length: 50 }, (_, i) => {
                  const year = 2000 + i;
                  return (
                    <option key={year} value={year}>
                      {toBanglaNumber(year)}
                    </option>
                  );
                })}
              </select>
            </label>

            <select
              name="district"
              className="bg-gray-100 w-full select-bordered select"
              required
              value={
                headerInfo.district.bn
                  ? JSON.stringify(headerInfo.district)
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                const selectedDistrict =
                  value === "" ? null : JSON.parse(value);
                setHeaderInfo((prev) => ({
                  ...prev,
                  district: selectedDistrict,
                }));
              }}
            >
              <option value="" disabled>
                জেলা নির্বাচন করুন
              </option>
              {aclandOptions.map((districtObj, index) => (
                <option
                  key={index}
                  value={JSON.stringify(districtObj.district)}
                >
                  {districtObj.district.bn} ({districtObj.district.en})
                </option>
              ))}
            </select>

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

export default AdcOrder;

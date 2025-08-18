import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Printer,
  ArrowLeft,
  Edit,
  Edit2,
  Pencil,
  PencilOff,
  BookCheck,
  Play,
} from "lucide-react";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import axiosPublic from "../../../axios/axiosPublic";
import { toast } from "sonner";
import { AuthContext } from "../../../provider/AuthProvider";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { mamlaNames } from "../../../data/mamlaNames";
import { aclandOptions } from "../../../data/aclandOptions";
import Tippy from "@tippyjs/react";
import { IoLogoWhatsapp } from "react-icons/io5";
import OfficeMessaging from "./OfficeMessaging";
import { FaPlus } from "react-icons/fa";
import { mamlaStatus } from "../../../data/mamlaStatus";

const DivComOrders = () => {
  const { id } = useParams();
  // console.log(id);

  const [orderSheets, setOrderSheets] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // console.log(caseData);

  const {
    data: caseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["divComOrders", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases/${id}`);

      return res.data;
    },
    enabled: !!id,
  });
  // ✅ Populate `orderSheets` once data is available
  useEffect(() => {
    if (caseData?.divComReview?.orderSheets) {
      setOrderSheets(caseData.divComReview.orderSheets);
    }
  }, [caseData]);

  const [showHeaderModal, setShowHeaderModal] = useState(false);

  const badiArray = caseData?.nagorikSubmission?.badi || [];
  const bibadiArray = caseData?.nagorikSubmission?.bibadi || [];

  const badiName = badiArray[0]?.name
    ? badiArray[0].name + (badiArray.length > 1 ? "গং " : "")
    : "";

  const bibadiName = bibadiArray[0]?.name
    ? bibadiArray[0].name + (bibadiArray.length > 1 ? "গং " : "")
    : "";
  const [divComReview, setDivComReview] = useState(
    caseData?.divComReview || {}
  );

  const [headerInfo, setHeaderInfo] = useState({
    formNo: 270,
    mamlaName: "",
    mamlaNo: "",
    year: "",
    district: "",
  });

    const [options, setOptions] = useState([...new Set(mamlaStatus)]);
      const [lastCondition, setLastCondition] = useState("");
      const [customInput, setCustomInput] = useState("");
      const [showInput, setShowInput] = useState(false);
    
      const handleAddCustom = () => {
        const custom = customInput.trim();
        if (custom && !options.includes(custom)) {
          setOptions([...options, custom]);
        }
        setLastCondition(custom);
        console.log(lastCondition)
        // setFormData((prev) => ({ ...prev, completedMamla: custom }));
        setCustomInput("");
        setShowInput(false);
      };
    
      const handleCompletedMamlaChange = (e) => 
        {
        const value = e.target.value;
        setLastCondition(value);
        console.log(value,lastCondition)
        // setFormData((prev) => ({ ...prev, completedMamla: value }));
      };

  useEffect(() => {
    if (showHeaderModal && divComReview) {
      setHeaderInfo((prev) => {
        const newInfo = {
          mamlaName: divComReview.mamlaName || "",
          mamlaNo: divComReview.mamlaNo || "",
          year: divComReview.year || "",
          district: divComReview.district?.bn || "",
        };

        // Avoid infinite loop by checking if update is needed
        if (JSON.stringify(prev) !== JSON.stringify(newInfo)) {
          return newInfo;
        }
        return prev;
      });
    }
  }, [showHeaderModal]);

  // Refs for auto-growing textareas
  const textareaRefs = useRef([]);

  useEffect(() => {
    orderSheets.forEach((order, idx) => {
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
    console.log(index, field, value);
    if (field === "judgeNote") {
      // Ensure prefix
      if (!updated[index][field]) {
        updated[index][field] = "    দেখলাম। ";
      }

      if (!value.startsWith("    দেখলাম। ")) {
        value = "    দেখলাম। " + value.replace(/^দেখলাম\s*\.*\.*\s*/, "");
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

  useEffect(() => {
    if (caseData?.divComReview) {
      setDivComReview(caseData.divComReview);
    }
  }, [caseData]);

  const handleDivComChange = (field, value) => {
    setDivComReview((prev) => ({ ...prev, [field]: value }));
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
      } হতে উদ্ভূত নামজারি আপিল মামলা নং ${
        toBanglaNumber(adcMamlaInfo[0].mamlaNo) || "___"
      }/${
        toBanglaNumber(adcMamlaInfo[0].year) || "___"
      } এ বিজ্ঞ অতিরিক্ত জেলা প্রশাসক (রাজস্ব), ${
        adcMamlaInfo[0]?.officeName.bn
      } কর্তৃক প্রদত্ত বিগত ${
        toBanglaNumber(adcMamlaInfo[0].year) || "___"
      } তারিখের আদেশের বিরুদ্ধে নামজারি রিভিশন মামলা দায়েরের প্রার্থনায় ${
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
          orderDate: new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Dhaka",
          }),
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
      title: "আপনি কি ডিলেট করতে চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, করুন!",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Remove from local state first
      const updatedOrderSheets = orderSheets.filter((_, i) => i !== index);
      setOrderSheets(updatedOrderSheets);

      // Prepare updated divComReview
      const updatedDivComReview = {
        ...caseData.divComReview,
        orderSheets: updatedOrderSheets, // updated array after delete
      };

      // Send patch to backend
      const res = await axiosPublic.patch(`/cases/divCom/${caseData._id}`, {
        divComReview: updatedDivComReview,
      });

      if (res.data.modifiedCount > 0) {
        toast.success("আদেশ টি মুছে ফেলা হয়েছে");
        refetch();
      } else {
        toast.error("আদশ টি মুছে ফেলা যায়নি");
      }
    } catch (err) {
      console.error(err);
      toast.error("দুঃখিত আদেশ মুছে ফেলা যাচ্ছেনা");
    }
  };

  const handleSave = async () => {
    try {
      console.log("📦 Saving order sheets:", orderSheets);
      if (orderSheets.length === 0) {
        toast("⚠️ আদেশের তথ্য খালি রাখা যাবে না");
        return;
      }
      console.log(divComReview);
      const reviewData = {
        ...(divComReview || {}),
        orderSheets: orderSheets.map(
          ({  nextDate, ...rest }) => rest
        ),
        previousDate: new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Dhaka",
        }),
      };
      const res = await axiosPublic.patch(`/cases/divCom/${caseData._id}`, {
        divComReview: reviewData,
      });

      // Prepare summary for main case update
      const caseUpdate = {
        lastCondition: reviewData.lastCondition || "",
        nextDate: reviewData.nextDate || "",
        previousDate: reviewData.previousDate,
      };

      // Update main case document
      const res2 = await axiosPublic.patch(
        `/mamla/${caseData._id}`,
        caseUpdate
      );

      console.log(caseUpdate);
      // console.log(res.data);
      if (res.data.modifiedCount > 0) {
        toast.success(" সফলভাবে সংরক্ষণ করা হয়েছে");
        setEditingRow(null);
        refetch();
      } else {
        toast.warning("⚠️ কোনো পরিবর্তন সংরক্ষণ হয়নি");
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      toast.warning("সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
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
        district: headerInfo.district,
      };
      console.log(updatedHeader);

      const res = await axiosPublic.patch(`/cases/divCom/${caseData._id}`, {
        divComReview: updatedHeader,
      });
      if (res.data.modifiedCount > 0) {
        setShowHeaderModal(false);
        toast.success("হেডার তথ্য সংরক্ষণ হয়েছে");
        refetch();
        // location.reload(); // Or refresh divComReview in state if you want live update
      } else {
        toast.warning("হেডার তথ্য সংরক্ষণে সমস্যা হয়েছে");
      }
    }
  };
  const toBanglaDigits = (str = "") =>
    String(str).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  const formatBanglaISO = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return toBanglaDigits(`${y}-${m}-${d}`); // or `${d}-${m}-${y}` if you prefer
  };

  const handlePrint = () => {
    window.print();
  };
  const handleTagid = () => {
    document.getElementById("my_modal_5").showModal();
  };
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? null : date;
  };
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSendWhatsApp = async () => {
    let phone = "";
    let targetUserRes;
    if (role === "acland") {
      targetUserRes = await axiosPublic.get("/users/specific-user", {
        params: {
          role: role,
          district: caseData.nagorikSubmission?.aclandMamlaInfo[0]?.district.en,
          officeName:
            caseData.nagorikSubmission?.aclandMamlaInfo[0]?.officeName.en,
        },
      });
    } else if (role === "adc") {
      targetUserRes = await axiosPublic.get("/users/specific-user", {
        params: {
          role: role,
          district: caseData.nagorikSubmission?.adcMamlaInfo[0]?.district.en,
          officeName:
            caseData.nagorikSubmission?.adcMamlaInfo[0]?.officeName.en,
        },
      });
      // console.log(targetUserRes);
    }
    // console.log(targetUserRes.data);
    if (!targetUserRes.data) {
      toast.warning("ফোন নম্বর পাওয়া যায়নি");
      return;
    }
    phone = targetUserRes?.data?.phone;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };
  const generateDefaultActionText = (messages = []) => {
    if (!messages.length) return "";

    return messages
      .flatMap((msg) => {
        if (!msg.caseList || !Array.isArray(msg.caseList)) return []; // skip if missing
        return msg.caseList.map((m) => {
          return `মামলা নং ${m.mamlaNo} (${m.mamlaName}) সংক্রান্ত ${
            msg.sentTo === "acland"
              ? "সহকারী কমিশনার (ভূমি)"
              : "অতিরিক্ত জেলা প্রশাসক"
          } অফিসে ${
            msg.date?.split("T")[0] || "___"
          } তারিখে বার্তা প্রেরণ করা হয়েছে।`;
        });
      })
      .join("\n");
  };

  const handleComplete = async (approval) => {
    const confirm = await Swal.fire({
      title: "আপনি কি মামলাটি নিষ্পন্ন করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, করুন",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosPublic.patch(
        `/cases/divCom/${caseData._id}/complete`,
        {
          isCompleted: approval,
        }
      );
      console.log(res.data);
      if (
        res.data.modifiedCount > 0 ||
        res.data.messages == "Case approved successfully"
      ) {
        toast.success("মামলাটি নিষ্পন্ন হয়েছে।");
        refetch();
      } else {
        toast.warning("নিষ্পন্ন ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("নিষ্পন্ন করতে সমস্যা হয়েছে।");
    }
  };

  const renderCaseHeader = () => (
    <div className="mb-4 text-[14px] text-black case-info">
      <div className="flex justify-between mb-1">
        <div>বাংলাদেশ ফরম নং - {toBanglaNumber(270)}</div>
        <div className="text-right">
          {badiName || "বাদী"} <br /> বনাম <br /> {bibadiName || "বিবাদী"}
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
        মামলার ধরন: {divComReview.mamlaName} মামলা নং{" "}
        {toBanglaNumber(divComReview.mamlaNo)} /
        {toBanglaNumber(divComReview.year)} ({divComReview.district?.bn})
      </div>
    </div>
  );
  if (isLoading) return <div className="text-center">Loading...</div>;
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
    height: 80%;
    border-collapse: collapse;
  }

  td, th {
    page-break-inside: avoid;
    // border: 1px solid black;
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

      <div className="bg-base-200/50 my-5 rounded-xl">
        <div className="flex justify-between items-center mb-4 py-2 font-bold text-xl text-center no-print">
          <button
            onClick={() => navigate(-1)} // -1 means go back one page
            className="mx-2 btn btn-ghost"
          >
            {/* <ArrowLeft /> */}
          </button>
          <h1 className="text-2xl">আদেশ যুক্ত করুন</h1>{" "}
          <div className="  ">{}</div>
        </div>
        <div className="flex justify-end gap-2 mx-4 my-4 pb-5 border-gray-200 border-b no-print">
          {caseData.isCompleted ? (
            <button
              onClick={() => handleComplete(false)}
              className="no-print btn btn-sm btn-info"
            >
              <Play /> পুনরায় চালু করুন
            </button>
          ) : (
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
                <Edit2 className="w-4 text-sm" /> হেডার তথ্য হালনাগাদ
              </button>
              <button
                onClick={handleTagid}
                className="flex bg-none btn-dash btn-sm btn"
              >
                <IoLogoWhatsapp className="text-xl" /> তাগিদ প্রেরণ
              </button>
              <button
                onClick={() => handleComplete(true)}
                className="btn-outline text-red-600 no-print btn btn-sm"
              >
                <BookCheck /> মামলা নিষ্পন্ন
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

        <div id="printable-area" className="p-4">
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
              {orderSheets.map((order, idx) => {
                const isEditing = editingRow === idx;

                return (
                  <tr className="" key={idx}>
                    <td className="mt-5 px-1 py-4 border-r w-2/12 align-top">
                      <div className="flex flex-col items-center text-center">
                        {isEditing && user?.role === "divCom" ? (
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
                              readOnly={!isEditing || user?.role !== "divCom"}
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

                        {/* Bangla for print */}
                        {/* {order?.orderDate && (
                          <span className="print-only-inline">
                            {formatBanglaISO(order.orderDate)}
                          </span>
                        )} */}
                      </div>

                      <textarea
                        value={order.orderNo}
                        placeholder="আদেশের নম্বর"
                        readOnly={!isEditing || user?.role !== "divCom"}
                        onChange={(e) =>
                          handleInputChange(
                            idx,
                            "orderNo",
                            toBanglaNumber(e.target.value)
                          )
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
                        readOnly={!isEditing || user?.role !== "divCom"}
                        onChange={(e) =>
                          handleInputChange(idx, "staffNote", e.target.value)
                        }
                        className="hover:border-cyan-800 w-full overflow-hidden resize-none"
                      />

                      {/* <p className="font-semibold text-xs text-left">
                        ডিভিশনাল কমিশনার এর আদেশ
                      </p> */}
                      <textarea
                        ref={(el) =>
                          (textareaRefs.current[`${idx}-judgeNote`] = el)
                        }
                        value={order.judgeNote}
                        readOnly={!isEditing || user?.role !== "divCom"}
                        placeholder="দেখলাম ..."
                        onChange={(e) =>
                          handleInputChange(idx, "judgeNote", e.target.value)
                        }
                        className="mt-8 w-full overflow-hidden resize-none"
                      />

                      {/* next date */}

                      <div className="flex flex-col justify-end items-end mt-5">
                        {isEditing && user?.role === "divCom" ? (
                          <>
                            <DatePicker
                              selected={parseDate(divComReview?.nextDate)}
                              readOnly={!isEditing || user?.role !== "divCom"}
                              onChange={(date) =>
                                handleDivComChange(
                                  "nextDate",
                                  date?.toISOString().split("T")[0]
                                )
                              }
                              customInput={
                                <input
                                  type="text"
                                  className="text-center input"
                                  value={formatBanglaISO(
                                    divComReview?.nextDate || ""
                                  )}
                                />
                              }
                              dateFormat="yyyy-MM-dd"
                              placeholderText="পরবর্তী তারিখ"
                            />
                            <div className="mt-2 w-1/3 text-sm screen-only">
                              {formatBanglaISO(divComReview?.nextDate) ||
                                "তারিখ নির্বাচন করুন"}
                            </div>
                          </>
                        ) : (
                          <span className="mt-2 w-1/3 screen-only">
                            {formatBanglaISO(caseData.divComReview?.nextDate)}
                          </span>
                        )}

                        {/* sorbosesh obostha */}
                       {/* সর্বশেষ অবস্থা */}

  
  <div className="flex w-52 items-center my-2  space-x-2">
    <select
      value={divComReview?.lastCondition || ""}
      onChange={(e) =>
        handleDivComChange("lastCondition", e.target.value)
      }
      className=" input-bordered w-full input select"
      disabled={!isEditing || user?.role !== "divCom"}
    >
      <option value="">সর্বশেষ অবস্থা নির্বাচন করুন</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>

    {/* add custom option */}
    <button
      type="button"
      className="bg-gray-200 no-print rounded-full btn"
      onClick={() => setShowInput(true)}
            disabled={!isEditing || user?.role !== "divCom"}

    >
      <FaPlus />
    </button>
    
  </div>

  {showInput && (
    <div className="flex space-x-2 mt-2">
      <input
        type="text"
        className="input-bordered w-full input input-sm"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="নতুন অবস্থা লিখুন"
      />
      <button
        type="button"
        className="btn btn-sm btn-success"
        onClick={() => {
          const custom = customInput.trim();
          if (custom && !options.includes(custom)) {
            setOptions([...options, custom]);
          }
          handleDivComChange("lastCondition", custom); // ✅ update main state
          setCustomInput("");
          setShowInput(false);
        }}
      >
        যুক্ত করুন
      </button>
    </div>
  )}
            </div>
                    </td>

                    {/* Action taken */}
                    <td className="px-1 pt-4 border-r w-3/12 h-full align-top">
                      <textarea
                        ref={(el) =>
                          (textareaRefs.current[`${idx}-actionTaken`] = el)
                        }
                        value={order?.actionTaken || ""}
                        placeholder="গৃহীত ব্যবস্থা"
                        readOnly={!isEditing || user?.role !== "divCom"}
                        onChange={(e) => {
                          handleInputChange(idx, "actionTaken", e.target.value);
                          const el = e.target;
                          el.style.height = "auto";
                          el.style.height = `${el.scrollHeight}px`;
                        }}
                        className="w-full overflow-hidden text-center resize-none"
                      />
                    </td>

                    <td
                      id="action"
                      className="space-x-1 space-y-2 p-2 border-r"
                    >
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
                        content="মুছে ফেলুন"
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
                      <div>
                        {caseData?.isApproved &&
                          user?.role === "divCom" &&
                          orderSheets.length === idx + 1 && (
                            <div>
                              <OfficeMessaging
                                caseData={caseData}
                                role={user?.role}
                                refetch={refetch}
                                index={idx}
                                mamlaNo={order?.mamlaNo}
                              />
                            </div>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2 mb-10">
        <button className="btn-outline btn" onClick={handleAddRow}>
          <Plus className="w-4" /> নতুন আদেশ
        </button>
        {editingRow !== null && orderSheets.length > 0 && (
          <button className="btn btn-success" onClick={handleSave}>
            <Save /> সংরক্ষণ করুন
          </button>
        )}
      </div>

      {showHeaderModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="space-y-4 bg-base-200 p-6 rounded-md w-[400px]">
            <h2 className="font-semibold text-lg">হেডার তথ্য হালনাগাদ</h2>

            {/* <input
              type="text"
              value={270}
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
                className="bg-gray-100 mt-1 input-bordered w-full input"
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
                className="bg-gray-100 mt-1 input-bordered w-full input"
              >
                <option value="">বছর নির্বাচন করুন</option>

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
            <label>
              জেলাঃ
              <select
                className="mt-1 w-full select-bordered select"
                value={headerInfo.district?.en || ""}
                onChange={(e) => {
                  const selectedDistrict = aclandOptions.find(
                    (d) => d.district.en === e.target.value
                  );
                  setHeaderInfo({
                    ...headerInfo,
                    district: selectedDistrict?.district || null,
                  });
                }}
              >
                <option value="">জেলা নির্বাচন করুন</option>
                {aclandOptions.map((d, idx) => (
                  <option key={idx} value={d.district.en}>
                    {d.district.bn} ({d.district.en})
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-2 mt-2">
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

      {/* tagid modal */}
      <dialog id="my_modal_5" className="modal">
        <div className="w-96 modal-box">
          <h3 className="mb-4 font-bold text-lg">তাগিদ পাঠান</h3>

          {/* Role dropdown */}
          <label className="block mb-2 font-semibold">পদবি</label>
          <select
            className="mb-4 w-full select-bordered select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">নির্বাচন করুন</option>
            <option value="acland">সহকারী কমিশনার (ভূমি) আদালত </option>
            <option value="adc">অতিরিক্ত জেলা প্রশাসক আদালত</option>
          </select>

          {/* District dropdown */}
          {role && (
            <>
              <label className="block mb-2 font-semibold">জেলা</label>
              <input
                type="text"
                className="mb-4 input-bordered w-full input"
                value={
                  role === "acland"
                    ? caseData?.nagorikSubmission?.aclandMamlaInfo[0]?.district
                        ?.bn || ""
                    : caseData?.nagorikSubmission?.adcMamlaInfo[0]?.district
                        ?.bn || ""
                }
                readOnly
              />
            </>
          )}

          {/* Office dropdown if acland */}
          {role === "acland" && (
            <>
              <label className="block mb-2 font-semibold">অফিস</label>
              <input
                type="text"
                className="mb-4 input-bordered w-full input"
                value={
                  caseData?.nagorikSubmission?.aclandMamlaInfo[0]?.officeName
                    ?.bn || ""
                }
                readOnly
              />
            </>
          )}

          {/* Message */}
          <label className="block mb-2 font-semibold">মেসেজ</label>
          <textarea
            className="mb-4 textarea-bordered w-full textarea"
            rows="3"
            placeholder="তাগিদ মেসেজ লিখুন..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Actions */}
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleSendWhatsApp}
              disabled={!message}
            >
              <IoLogoWhatsapp className="mr-1" /> প্রেরণ করুন
            </button>
            <form method="dialog">
              <button className="btn">বাতিল</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DivComOrders;

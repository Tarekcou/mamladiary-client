import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  CheckCircle2,
  CrossIcon,
  Plus,
  Printer,
  RotateCcw,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import { FcCancel } from "react-icons/fc";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { AuthContext } from "../../provider/AuthProvider";
import axiosPublic from "../../axios/axiosPublic";
import { BsArrowReturnLeft } from "react-icons/bs";

const NagorikDetails = ({ role }) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: caseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["acLandDetails", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases/${id}`);
      console.log("nagorik data:", res.data);
      return res.data;
    },
    enabled: !!id,
  });

  //
  const handlePrint = () => {
    window.print();
  };
  const handleApprove = async (approval) => {
    const confirm = await Swal.fire({
      title: "আপনি কি মামলাটি অনুমোদন করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অনুমোদন করুন",
    });

    if (!confirm.isConfirmed) return;
    console.log(approval);
    const mamlaData = {
      caseId: caseData._id,
      trackingNo: caseData.trackingNo,
      mamlaName: caseData?.nagorikSubmission?.aclandMamlaInfo[0]?.mamlaName,
      mamlaNo: caseData?.nagorikSubmission?.aclandMamlaInfo[0]?.mamlaNo,
      year: caseData?.nagorikSubmission?.aclandMamlaInfo[0]?.year,
      district: caseData.nagorikSubmission?.aclandMamlaInfo[0]?.district,
      officeName: caseData.nagorikSubmission?.aclandMamlaInfo[0]?.officeName,
      nextDate: caseData?.divComReview?.nextDate || "",
      previousDate:
        caseData.divComReview?.previousDate ||
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }),
      lastCondition: caseData?.divComReview?.lastCondition || "",
      completionDate: caseData?.completionDate || "",
      // comments: form.comments.value,
      badi: caseData.nagorikSubmission?.badi,
      bibadi: caseData.nagorikSubmission?.bibadi,

      createdAt: caseData?.createdAt,
    };
    try {
      const res = await axiosPublic.patch(
        `/cases/divCom/${caseData._id}/approve`,
        {
          isApproved: approval,
          // isCompleted: false,
        }
      );
      console.log(res.data);
      let res2;
      if (approval) res2 = await axiosPublic.post("/mamlas", mamlaData);
      // else
      // res2=await axiosPublic.delete(`/mamlas/${id}`)
      // console.log(res.data, res2.data);
      if (res.data.modifiedCount > 0) {
        toast.success("মামলাটি অনুমোদিত হয়েছে।");
        refetch();
      } else {
        toast.warning("অনুমোদন ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("অনুমোদন করতে সমস্যা হয়েছে।");
    }
  };
  const handleCaseSent = async (caseId, stageKey, newStatus) => {
    const confirm = await Swal.fire({
      title: "আপনি কি প্রেরন করতে চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রেরন করুন!",
    });

    if (!confirm.isConfirmed) return;
    try {
      const res = await axiosPublic.patch(
        `/cases/nagorik/sentTodivCom/${caseId}`,
        {
          stageKey,
          status: newStatus,
        }
      );
      // Optimistically update local cache
      queryClient.setQueryData(["myCases", user._id], (oldCases = []) =>
        oldCases.map((cas) =>
          cas._id === caseId
            ? {
                ...cas,
                [stageKey]: {
                  ...cas[stageKey],
                  status: newStatus,
                },
              }
            : cas
        )
      );
      console.log(res.data);

      if (res.data.success) {
        toast.success(" সফলভাবে প্রেরণ  করা হয়েছে");
        navigate(-1);
        refetch();
      } else {
        toast.error(" প্রেরণে  ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("প্রেরণে সমস্যা হয়েছে");
    }
  };

  // if (isLoading) return <div className="p-6 text-center">লোড হচ্ছে...</div>;
  // if (isError)
  //   return <div className="p-6 text-red-500 text-center">{error.message}</div>;
  if (!caseData)
    return <div className="p-6 text-red-500">তথ্য পাওয়া যায়নি</div>;

  const { nagorikSubmission, isApproved, trackingNo, messageToOffices } =
    caseData;
  const isRefused = caseData?.nagorikSubmission?.status === "refused";

  const handleAddOrder = () => {
    navigate(`/dashboard/divCom/cases/order/${caseData._id}`);
  };
  return (
    <>
      <style>
        {`
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
      `}
      </style>
      <div className="bg-base-200 shadow-sm mx-auto p-6 h-full">
        <div className="w-full boder">
          <div>
            <h2 className="mb-10 font-bold text-xl text-center underline">
              মামলার বিস্তারিত তথ্য
            </h2>
            <div className="flex justify-between w-full">
              <p>
                <strong>ট্র্যাকিং নম্বর:</strong> {trackingNo}
              </p>
              <button
                onClick={handlePrint}
                className="my-1 no-print btn btn-sm btn-info"
              >
                <Printer /> প্রিন্ট করুন
              </button>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-1">
                  <h1>অনুমোদনের অবস্থা:</h1>{" "}
                  {isApproved ? (
                    <h1 className="font-bold badge badge-success">
                      "অনুমোদিত"
                    </h1>
                  ) : nagorikSubmission.status == "submitted" ? (
                    <h1 className="font-bold badge badge-info">
                      অনুমোদনের জন্য অপেক্ষমাণ
                    </h1>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                      <h1 className="badge badge-warning">
                        অনুমোদনের জন্য প্রেরণ করুন
                      </h1>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.3 }}
                        className="bg-blue-500 rounded text-white btn btn-sm"
                        onClick={() =>
                          handleCaseSent(
                            caseData._id,
                            "nagorikSubmission",
                            "submitted"
                          )
                        }
                      >
                        {nagorikSubmission?.status != "submitted" && (
                          <h1 className="flex items-center p-4 text-sm">
                            <SendIcon className="w-5" /> প্রেরণ করুন
                          </h1>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
                <h1 className="font-bold">
                  ভূমি অফিসঃ{" "}
                  <span className="font-bold text-blue-600 text-lg">
                    {nagorikSubmission.aclandMamlaInfo[0].officeName.bn}
                  </span>
                </h1>
                <h1 className="font-bold text-lg">
                  জেলাঃ{" "}
                  <span className="text-blue-600">
                    {nagorikSubmission.adcMamlaInfo[0]?.district.bn}
                  </span>
                </h1>
              </div>

              {/* Approve Button */}
              {!isApproved && !isRefused && user?.role === "divCom" ? (
                <div className="flex flex-col justify-end items-end gap-2 w-1/2 text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                    onClick={() => handleApprove(true)}
                    className=""
                  >
                    <h1 className="btn-block flex justify-center items-center gap-2 btn btn-sm btn-success">
                      <CheckCircle />
                      অনুমোদন দিন
                    </h1>
                  </motion.button>

                  <button
                    onClick={() =>
                      handleCaseSent(
                        caseData._id,
                        "nagorikSubmission",
                        "refused"
                      )
                    }
                    className="flex btn-info btn btn-sm"
                  >
                    <RotateCcw /> ফেরত পাঠান
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center no-print btn-sm">
                  {!caseData.divComReview &&
                    isApproved &&
                    user?.role === "divCom" && (
                      <>
                        <button
                          onClick={handleAddOrder}
                          className="flex btn-success btn btn-sm"
                        >
                          <Plus /> নতুন আদেশ
                        </button>
                        <button
                          onClick={() => handleApprove(false)}
                          className="flex items-center btn btn-sm btn-warning"
                        >
                          <FcCancel className="text-2xl" />{" "}
                          <h1 className="text-xs">অনুমোদন বাতিল</h1>
                        </button>
                      </>
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 my-2">
            {/* <button
                className="btn btn-warning"
                onClick={() =>
                  activeTab === "acLand"
                    ? navigate(
                        `/dashboard/${activeTab}/cases/edit/${caseData._id}`,
                        { state: { caseData } }
                      )
                    : navigate(
                        `/dashboard/${activeTab}/cases/order/edit/${caseData._id}`,
                        { state: { caseData } }
                      )
                }
              >
                <Edit className="w-6" />
              </button> */}
          </div>
        </div>

        {/* Badi Table */}
        <div className="mt-4">
          <h3 className="font-semibold">বাদী</h3>
          {nagorikSubmission?.badi?.length > 0 ? (
            <table className="table table-sm bg-base-200 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
              <thead>
                <tr className="bg-base-200 text-center">
                  <th>নাম</th>
                  <th>মোবাইল</th>
                  <th>ঠিকানা</th>
                </tr>
              </thead>
              <tbody>
                {nagorikSubmission.badi.map((b, idx) => (
                  <tr key={idx} className="text-center">
                    <td>{b.name || "-"}</td>
                    <td>{b.phone || "-"}</td>
                    <td>{b.address || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>কোনো তথ্য নেই</p>
          )}
        </div>

        {/* Bibadi Table */}
        <div className="my-6">
          <h3 className="font-semibold">বিবাদী</h3>
          {nagorikSubmission?.bibadi?.length > 0 ? (
            <table className="table table-sm bg-base-200 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
              <thead>
                <tr className="bg-base-200 text-center">
                  <th>নাম</th>
                  <th>মোবাইল</th>
                  <th>ঠিকানা</th>
                </tr>
              </thead>
              <tbody>
                {nagorikSubmission.bibadi.map((b, idx) => (
                  <tr key={idx} className="text-center">
                    <td>{b.name || "-"}</td>
                    <td>{b.phone || "-"}</td>
                    <td>{b.address || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>কোনো তথ্য নেই</p>
          )}
        </div>

        {/* ACLAND Info */}
        {(role == "acLand" || role == "nagorik") && (
          <div className="mt-4">
            <h3 className="font-semibold">
              সহকারী কমিশনার (ভূমি),{" "}
              {nagorikSubmission.aclandMamlaInfo[0].officeName.bn} আদালতের তথ্য
            </h3>
            {nagorikSubmission?.aclandMamlaInfo?.length > 0 ? (
              <table className="table table-sm bg-base-200 shadow mt-2 border border-base-content/5 rounded-box w-full overflow-x-auto">
                <thead>
                  <tr className="bg-base-200 text-center">
                    <th>মামলার নাম</th>
                    <th>মামলা নম্বর</th>
                    <th>সাল</th>
                    <th>জেলা</th>
                    <th>অফিস</th>
                  </tr>
                </thead>
                <tbody>
                  {nagorikSubmission.aclandMamlaInfo.map((m, idx) => (
                    <tr className="text-center" key={idx}>
                      <td>{m.mamlaName}</td>
                      <td>{m.mamlaNo}</td>
                      <td>{m.year}</td>
                      <td>{m.district.bn}</td>
                      <td>{m.officeName.bn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>তথ্য নেই</p>
            )}
          </div>
        )}

        {/* ADC Info */}
        {(role == "adc" || role == "nagorik") && (
          <div className="mt-4">
            <h3 className="font-semibold">
              অতিরিক্ত জেলা প্রশাসক(রাজস্ব),{" "}
              {nagorikSubmission?.adcMamlaInfo[0]?.officeName?.bn} আদালতের তথ্য
            </h3>
            {nagorikSubmission?.adcMamlaInfo?.length > 0 ? (
              <table className="table table-sm bg-base-200 shadow mt-2 border border-base-content/5 rounded-box w-full overflow-x-auto">
                <thead>
                  <tr className="bg-base-200 text-center">
                    <th>মামলার নাম</th>
                    <th>মামলা নম্বর</th>
                    <th>সাল</th>
                    <th>জেলা</th>
                    <th>অফিস</th>
                    <th>এডিসি আদেশের তারিখ</th>
                  </tr>
                </thead>
                <tbody>
                  {nagorikSubmission.adcMamlaInfo.map((m, idx) => (
                    <tr className="text-center" key={idx}>
                      <td>{m.mamlaName}</td>
                      <td>{m.mamlaNo}</td>
                      <td>{m.year}</td>
                      <td>{m.district.bn}</td>
                      <td>{m.officeName.bn}</td>
                      <td>{m?.adcOrderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>তথ্য নেই</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NagorikDetails;

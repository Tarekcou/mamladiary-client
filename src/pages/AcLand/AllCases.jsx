// src/pages/Allcases.jsx
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import axiosPublic from "../../axios/axiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import {
  ArrowDownWideNarrowIcon,
  Delete,
  DeleteIcon,
  Edit,
  PlusSquareIcon,
  Send,
} from "lucide-react";
import { MdDelete, MdDetails, MdNestCamWiredStand } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import { toast } from "sonner";
import Swal from "sweetalert2";

const AllCases = () => {
  const location = useLocation();
  const isSentCasePage = location.pathname.includes("sendCases");
  const isNagorikCase=location.pathname.includes("/nagorik/mamla")
  console.log(isNagorikCase)
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // console.log("User in AllCases:", user);
  const {
    refetch,
    data: cases = [],
    isLoading,
  } = useQuery({
    queryKey: [
      "allCases",
      isSentCasePage,
      user.role,
      user?.officeName,
      user?.district,
    ],
    queryFn: async () => {
      const params = isSentCasePage
        ? {
            // For SENT CASES: show what this office has sent (acland only, for example)
            fromRole: user._id,
            fromOfficeName: user.officeName.en,
            fromDistrict: user.district.en,
          }
        : {
            // For RECEIVED CASES: filter by user's own inbox
            role: user.role,
            officeName: user.officeName.en,
            district: user.district.en,
          };
      const res = await axiosPublic.get("/cases", { params });
      return res.data;
    },
  });
  const handleSeniorOfficeSend = async (cas) => {
    const toRole = user.role === "acLand" ? "adc" : "divCom";
    const caseStageKey = toRole;

    const existingStages = cas.caseStages?.[0] || {};

    const toOfficeName =
      user.role === "acLand"
        ? {
            en: user.district.en,
            bn: `জেলা প্রশাসকের কার্যালয়, ${user.district.bn}`,
          }
        : {
            en: "divCom",
            bn: "বিভাগীয় কমিশনারের কার্যালয়, চট্টগ্রাম",
          };

    const newStageHistoryEntry = {
      sentBy: {
        role: user.role,
        userId: user._id,
        officeName: user.officeName,
        district: user.district,
      },
      sentTo: {
        role: toRole,
        officeName: toOfficeName,
        district:
          toRole === "divCom"
            ? { en: "Chattogram", bn: "চট্টগ্রাম" }
            : user.district,
      },
      date: new Date(),
    };

    const updatedCaseData = {
      // ✅ No new empty stage here
      currentStage: {
        stage: caseStageKey,
        status:
          caseStageKey === "adc"
            ? `জেলা প্রশাসকের কার্যালয়, ${user.district.bn}`
            : "বিভাগীয় কমিশনারের কার্যালয়, চট্টগ্রাম",
        officeName: toOfficeName,
        district:
          caseStageKey === "divCom"
            ? { bn: "চট্টগ্রাম", en: "Chattogram" }
            : user.district,
      },
      caseStages: [existingStages], // ✅ don't add divCom yet
      stageHistory: [...(cas.stageHistory || []), newStageHistoryEntry],
    };
    const confirm = await Swal.fire({
      title: "আপনি কি উর্ধ্বতন অফিসে প্রেরণ করতে চান?",
      text: "এইটা অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ প্রেরণ করুন!",
    });

    if (confirm.isConfirmed) {
      // console.log("Sending to senior office:", updateCaseData);
      try {
        const response = await axiosPublic.patch(
          `/cases/${cas._id}?district=${user.district.en}`,
          updatedCaseData
        );

        if (response.data.modifiedCount > 0) {
          toast("উর্ধ্বতন অফিসে সফলভাবে প্রেরণ করা হয়েছে।");
          refetch();
        } else {
          toast("প্রেরণ ব্যর্থ হয়েছে।");
        }
      } catch (error) {
        console.error("Error sending to senior office:", error);
        toast("প্রেরণ করতে সমস্যা হয়েছে।");
      }
    }
  };

  const handleDelete = async (caseId) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত যে এই মামলাটি মুছে ফেলতে চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
    });
    console.log(caseId);

    if (confirm.isConfirmed) {
      try {
        const response = await axiosPublic.delete(`/cases/${caseId}`);
        console.log("Delete response:", response);
        if (response.data.result.deletedCount > 0) {
          toast("মামলাটি সফলভাবে মুছে ফেলা হয়েছে।");
          refetch();
        } else {
          toast("মামলাটি মুছে ফেলা যায়নি।");
        }
      } catch (error) {
        console.error("Error deleting case:", error);
        toast("মামলাটি মুছে ফেলতে সমস্যা হয়েছে।");
      }
    }
  };

  if (isLoading) return <p>লোড হচ্ছে...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 font-bold text-xl">মামলার তালিকা</h2>
      <div className="overflow-x-auto">
        <table className="table bg-base-100 border border-base-content/5 rounded-box w-full">
          <thead>
            <tr className="text-center">
              <th>ক্রমিক</th>
              <th>ট্র্যাকিং নম্বর</th>
              <th>বাদীর নাম</th>
              <th>মোবাইল</th>
              <th>মামলার বিবরণ</th>
              <th>বর্তমান অবস্থান</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((cas, index) => (
              <React.Fragment key={cas._id}>
                <tr className="text-center align-top">
                  <td>{index + 1}</td>
                  <td>{cas.rootCaseId}</td>
                  <td>
                    {(Object.values(cas.caseStages?.[0] || {})[0]?.badi || [])
                      .map((a) => a.name || "-")
                      .join(", ")}
                  </td>
                  <td>
                    {(Object.values(cas.caseStages?.[0] || {})[0]?.badi || [])
                      .map((a) => a.phone || "-")
                      .join(", ")}
                  </td>

                  {/* Nested Table for Office Wise Users */}
                  <td className="p-0">
                    <div className="overflow-x-auto">
                      <table className="table table-xs border border-gray-100 min-w-[300px]">
                        <tbody>
                          {cas.caseStages?.map((entry, stageIndex) =>
                            Object.entries(entry).map(
                              ([roleKey, caseData], subIndex) => (
                                <React.Fragment
                                  key={`${stageIndex}-${roleKey}`}
                                >
                                  <tr className="bg-base-200">
                                    <td className="text-center" colSpan={4}>
                                      <strong className="text-blue-700 text-center uppercase">
                                        {roleKey}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr className="bg-base-50 text-xs text-center">
                                    <td>{caseData?.mamlaName || "-"}</td>
                                    <td>{caseData?.mamlaNo || "-"}</td>
                                    <td>{caseData?.year || "-"}</td>
                                    <td>
                                      {roleKey === "acLand"
                                        ? `${
                                            caseData?.officeName?.bn || "-"
                                          } ভূমি অফিস, ${caseData.district?.bn}`
                                        : roleKey === "adc"
                                        ? `জেলা প্রশাসকের কার্যালয়, ${
                                            caseData?.officeName?.bn || "-"
                                          }`
                                        : caseData?.officeName?.bn || "-"}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              )
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </td>

                  {/* Current Stage */}
                  <td>{cas.currentStage?.status || "-"}</td>

                  {/* Action Buttons */}
                  <td className="flex flex-wrap justify-center items-center gap-1 h-full">
                    {/* View Button - Always shown */}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() =>
                        navigate(`/dashboard/${user.role}/cases/${cas._id}`)
                      }
                    >
                      <FcViewDetails className="w-6 text-xl" />
                    </button>

                    {/* Edit & Send buttons - hide on Sent Case Page */}
                    {!isSentCasePage && (
                      <>
                        {/* Order Sheet Button - for both adc and divCom */}
                        {["adc", "divCom"].includes(user.role) && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              navigate(
                                `/dashboard/${user.role}/cases/newOrder/${cas._id}`,
                                {
                                  state: { caseData: cas, mode: "add" }, // <-- edit mode flag
                                }
                              )
                            }
                          >
                            <PlusSquareIcon className="w-6 text-xl" />
                          </button>
                        )}
                        {user.role == "acLand" && (
                          <>
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() =>
                                navigate(
                                  `/dashboard/${user.role}/cases/edit/${cas._id}`,
                                  {
                                    state: { caseData: cas },
                                  }
                                )
                              }
                            >
                              <Edit className="w-6" />
                            </button>

                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleDelete(cas._id)}
                            >
                              <DeleteIcon className="w-6 text-red-900" />
                            </button>
                          </>
                        )}
                        {/* Send to Senior Office Button */}
                        {user.role !== "divCom" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleSeniorOfficeSend(cas)}
                          >
                            <Send className="w-6" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCases;

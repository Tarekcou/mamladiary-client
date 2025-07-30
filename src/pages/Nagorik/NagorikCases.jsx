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
import { FcApprove, FcViewDetails } from "react-icons/fc";
import { toast } from "sonner";
import Swal from "sweetalert2";

const NagorikCases = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const pathName = useLocation().pathname;
  const isRequested = pathName.includes("requestCases");
  const {
    refetch,
    data: cases = [],
    isLoading,
  } = useQuery({
    queryKey: ["nagorikCases", user.id],
    queryFn: async () => {
      const params = isRequested
        ? {
            isApproved: false,
          }
        : {
            id: user?._id,
          };
      console.log(typeof params.isApproved);
      const res = await axiosPublic.get("/cases", { params });
      console.log(res.data.caseStages);
      return res.data;
    },
  });
  const handleDelete = async (trackingNo) => {
    const nagorikData = {};
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই মামলাটি মুছে ফেলবেন!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, বাতিল করুন!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.patch(
            `/cases/nagorik/${trackingNo}`,
            nagorikData
          );
          if (res.data.message === "Nagorik data added to divCom") {
            toast.success("মামলা সফলভাবে মুছে ফেলা হয়েছে!");
            refetch();
          } else {
            toast.error("মামলা মুছতে ব্যর্থ হয়েছে!");
          }
        } catch (error) {
          toast.error("মামলা মুছতে ব্যর্থ হয়েছে!");
        }
      }
    });
  };

  const handleApprove = async (trackingNo) => {
    const payload = { isApproved: true };
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই মামলাটি এপ্রুভ করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, এপ্রুভ করুন!",
      cancelButtonText: "না, বাতিল করুন!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.patch(
            `/cases/nagorik/${trackingNo}`,
            payload
          );
          if (res.data.updated) {
            toast.success("এপ্রুভ করা হয়েছে!");
            refetch();
          } else {
            toast.error("এপ্রুভ করতে ব্যর্থ হয়েছে!");
          }
        } catch (error) {
          toast.error("এপ্রুভ করতে ব্যর্থ হয়েছে!");
        }
      }
    });
  };
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
              <th>বিবাদির নাম</th>
              <th>মোবাইল</th>
              <th>মামলার বিবরণ</th>
              <th>বর্তমান অবস্থা</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((cas, index) => (
              <React.Fragment key={cas._id}>
                <tr className="text-center align-top">
                  <td>{index + 1}</td>
                  <td>{cas.caseStages?.[0].divCom?.nagorikData.trackingNo}</td>
                  <td>
                    {(
                      Object.values(
                        cas?.caseStages?.[0]?.divCom?.nagorikData?.badi || {}
                      ) || []
                    )
                      .map((a) => a?.name || "-")
                      .join(", ")}
                  </td>
                  <td>
                    {(
                      Object.values(
                        cas?.caseStages?.[0]?.divCom?.nagorikData?.badi || {}
                      ) || []
                    )
                      .map((a) => a?.phone || "-")
                      .join(", ")}
                  </td>
                  {/* bibadi */}
                  <td>
                    {(
                      Object.values(
                        cas?.caseStages?.[0]?.divCom?.nagorikData?.bibadi || {}
                      ) || []
                    )
                      .map((a) => a?.name || "-")
                      .join(", ")}
                  </td>
                  <td>
                    {(
                      Object.values(
                        cas?.caseStages?.[0]?.divCom?.nagorikData?.bibadi || {}
                      ) || []
                    )
                      .map((a) => a?.phone || "-")
                      .join(", ")}
                  </td>

                  {/* Nested Table for Office Wise Users */}
                  <td className="p-0">
                    <div className="overflow-x-auto">
                      <table className="table table-xs border border-gray-100 min-w-[300px]">
                        <tbody>
                          {cas.caseStages?.map((entry, stageIndex) => {
                            const caseData = entry?.divCom?.nagorikData;
                            return (
                              caseData && (
                                <React.Fragment key={stageIndex}>
                                  {/* <tr className="bg-base-200">
                                    <td className="text-center" colSpan={4}>
                                      <strong className="text-blue-700 text-center uppercase">
                                        DivCom
                                      </strong>
                                    </td>
                                  </tr> */}
                                  <tr className="bg-base-50 text-xs text-center">
                                    <td>{caseData?.mamlaName || "-"}</td>
                                    <td>{caseData?.mamlaNo || "-"}</td>
                                    <td>{caseData?.year || "-"}</td>
                                    <td>{caseData?.district || "-"}</td>
                                  </tr>
                                  {caseData?.nagorikData && (
                                    <>
                                      <tr className="bg-base-100 text-center">
                                        <td colSpan={4}>
                                          <div className="text-sm">
                                            <strong>Lawyer:</strong>{" "}
                                            {caseData.nagorikData.lawyer?.name}{" "}
                                            (
                                            {caseData.nagorikData.lawyer?.phone}
                                            )
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </React.Fragment>
                              )
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </td>

                  {/* Current Stage */}
                  <td>
                    {cas.caseStages?.[0].divCom?.nagorikData?.isApproved ? (
                      <span className="font-bold text-green-600">
                        "Not Approved"
                      </span>
                    ) : (
                      <span className="font-bold text-red-600">
                        "Not Approved"
                      </span>
                    )}
                  </td>
                  {/* Action Buttons */}
                  <td className="flex flex-wrap justify-center items-center gap-1 h-full">
                    {/* View Button - Always shown */}
                    {/* <button
                      className="btn btn-sm btn-info"
                      onClick={() =>
                        navigate(`/dashboard/${user.role}/cases/${cas._id}`)
                      }
                    >
                      <FcViewDetails className="w-6 text-xl" />
                    </button> */}

                    {/* Edit & Send buttons - hide on Sent Case Page */}
                    <>
                      {user.role == "nagorik" ? (
                        <>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              navigate(
                                `/dashboard/${user.role}/mamla/edit/${cas._id}`,
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
                            onClick={() =>
                              handleDelete(
                                cas.caseStages?.[0].divCom.nagorikData
                                  .trackingNo
                              )
                            }
                          >
                            <DeleteIcon className="w-6 text-red-900" />
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            handleApprove(
                              cas.caseStages?.[0].divCom.nagorikData.trackingNo
                            )
                          }
                        >
                          <FcApprove className="w-6 text-red-900 text-3xl" />{" "}
                          Approve
                        </button>
                      )}
                    </>
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

export default NagorikCases;

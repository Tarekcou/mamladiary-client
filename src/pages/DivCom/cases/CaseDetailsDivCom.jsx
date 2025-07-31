import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../../../provider/AuthProvider";
import axiosPublic from "../../../axios/axiosPublic";

const CaseDetailsDivCom = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: caseData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["caseDetails", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleApprove = async () => {
    try {
      const res = await axiosPublic.patch(`/cases/${id}`, {
        isApproved: true,
      });
      if (res.data.modifiedCount > 0) {
        toast.success("মামলাটি অনুমোদিত হয়েছে");
        refetch();
      } else {
        toast.warning("কোনো পরিবর্তন হয়নি");
      }
    } catch (err) {
      toast.error("অনুমোদন ব্যর্থ হয়েছে");
    }
  };

  if (isLoading) return <div className="p-6 text-center">লোড হচ্ছে...</div>;
  if (isError)
    return <div className="text-red-500 p-6 text-center">{error.message}</div>;
  if (!caseData) return <div className="text-red-500 p-6">তথ্য পাওয়া যায়নি</div>;

  const { nagorikSubmission, isApproved, trackingNo } = caseData;

  const handleAddOrder = () => {
    navigate(`/dashboard/divCom/cases/newOrder/${caseData._id}`, {
      state: { caseData, mode: "add" },
    });
  };
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md border">
     
    <div>


    <div>
     <h2 className="text-xl font-bold mb-4 text-center underline">
        নাগরিক মামলার বিস্তারিত
      </h2>

      <p><strong>ট্র্যাকিং নম্বর:</strong> {trackingNo}</p>
      <p><strong>অনুমোদনের অবস্থা:</strong>{" "}
        <span className={isApproved ? "text-green-600" : "text-red-600"}>
          {isApproved ? "অনুমোদিত" : "অনুমোদনের অপেক্ষায়"}
        </span>
      </p>
    </div>

        <div className="flex gap-2">
              <button
                onClick={handleAddOrder}
                className="flex bg-green-600 hover:bg-green-700 text-white btn"
              >
                <Plus /> নতুন অর্ডার
              </button>
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
  <h3 className="font-semibold mb-2">বাদী</h3>
  {nagorikSubmission?.badi?.length > 0 ? (
    <table className="table table-sm w-full border">
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
<div className="mt-6">
  <h3 className="font-semibold mb-2">বিবাদী</h3>
  {nagorikSubmission?.bibadi?.length > 0 ? (
    <table className="table table-sm w-full border">
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
      <div className="mt-4">
        <h3 className="font-semibold">সহকারী কমিশনার (ভূমি) তথ্য</h3>
        {nagorikSubmission?.aclandMamlaInfo?.length > 0 ? (
          <table className="table table-sm w-full border mt-2">
            <thead>
              <tr>
                <th>মামলার নাম</th>
                <th>মামলা নম্বর</th>
                <th>সাল</th>
                <th>জেলা</th>
              </tr>
            </thead>
            <tbody>
              {nagorikSubmission.aclandMamlaInfo.map((m, idx) => (
                <tr key={idx}>
                  <td>{m.mamlaName}</td>
                  <td>{m.mamlaNo}</td>
                  <td>{m.year}</td>
                  <td>{m.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>তথ্য নেই</p>
        )}
      </div>

      {/* ADC Info */}
      <div className="mt-4">
        <h3 className="font-semibold">ADC আদালতের তথ্য</h3>
        {nagorikSubmission?.adcMamlaInfo?.length > 0 ? (
          <table className="table table-sm w-full border mt-2">
            <thead>
              <tr>
                <th>মামলার নাম</th>
                <th>মামলা নম্বর</th>
                <th>সাল</th>
                <th>জেলা</th>
              </tr>
            </thead>
            <tbody>
              {nagorikSubmission.adcMamlaInfo.map((m, idx) => (
                <tr key={idx}>
                  <td>{m.mamlaName}</td>
                  <td>{m.mamlaNo}</td>
                  <td>{m.year}</td>
                  <td>{m.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>তথ্য নেই</p>
        )}
      </div>

      {/* Approve Button */}
      {!isApproved && (
        <div className="mt-6 text-center">
          <button
            onClick={handleApprove} 
            className="btn btn-success flex items-center gap-2"
          >
            <CheckCircle2 /> অনুমোদন করুন
          </button>
        </div>
      )}
    </div>
  );
};

export default CaseDetailsDivCom;

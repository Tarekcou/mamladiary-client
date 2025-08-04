import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CrossIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../../../provider/AuthProvider";
import axiosPublic from "../../../axios/axiosPublic";
import OfficeMessaging from "./OfficeMessaging";
import { FcCancel } from "react-icons/fc";

const LawyerDetails = ({ caseData, role, refetch }) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  //

  const handleApprove = async (approval) => {
    try {
      const res = await axiosPublic.patch(`/cases/${id}`, {
        isApproved: approval,
      });
      console.log(res.data);
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

  // if (isLoading) return <div className="p-6 text-center">লোড হচ্ছে...</div>;
  // if (isError)
  //   return <div className="p-6 text-red-500 text-center">{error.message}</div>;
  if (!caseData)
    return <div className="p-6 text-red-500">তথ্য পাওয়া যায়নি</div>;

  const { nagorikSubmission, isApproved, trackingNo, messageToOffices } =
    caseData;

  const handleAddOrder = () => {
    navigate(`/dashboard/divCom/cases/order/${caseData._id}`, {
      state: { caseData, mode: "add" },
    });
  };
  return (
    <div className="bg-white shadow-md mx-auto p-6 max-w-4xl">
      <div>
        <div>
          <h2 className="mb-4 font-bold text-xl text-center underline">
            নাগরিক মামলার বিস্তারিত
          </h2>

         
          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
            <p>
            <strong>ট্র্যাকিং নম্বর:</strong> {trackingNo}
          </p>
              <div className="flex gap-1">
              <h1>অনুমোদনের অবস্থা:</h1>{" "}
              <h1 className={isApproved ? "text-green-600" : "text-red-600"}>
                {isApproved ? "অনুমোদিত" : "অনুমোদনের অপেক্ষায়"}
              </h1></div>
            </div>
            <button
                  onClick={() => handleApprove(true)}
                  className="flex items-center btn btn-success"
                >
                  <CheckCircle2 /> অনুমোদন করুন
                </button>
            {/* Approve Button */}
            {(!isApproved && user?.role==="lawyer") ? (
              <div className="text-center">
                <button
                  onClick={() => handleApprove(true)}
                  className="flex items-center btn btn-success"
                >
                  <CheckCircle2 /> অনুমোদন করুন
                </button>
              </div>
            ) : (
              <div className="text-center space-y-1 btn-sm">
                {!caseData.divComReview && (
                  <>
                  <button onClick={handleAddOrder} className="flex btn-success btn">
            <Plus /> নতুন আদেশ যুক্ত
          </button>
          <button
                    onClick={() => handleApprove(false)}
                    className="flex items-center btn btn-warning"
                  >
                    <FcCancel className="text-2xl" /> অনুমোদন বাতিল 
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
          <table className="table table-sm bg-base-100 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
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
          <table className="table table-sm bg-base-100 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
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
      {(role == "acLand" || role == "lawyer") && (
        <div className="mt-4">
          <h3 className="font-semibold">সহকারী কমিশনার (ভূমি) তথ্য</h3>
          {nagorikSubmission?.aclandMamlaInfo?.length > 0 ? (
            <table className="table table-sm bg-base-100 shadow mt-2 border border-base-content/5 rounded-box w-full overflow-x-auto">
              <thead>
                <tr className="bg-base-200">
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
                    <td>{m.district.bn}</td>
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
      {(role == "adc" || role == "lawyer") && (
        <div className="mt-4">
          <h3 className="font-semibold">ADC আদালতের তথ্য</h3>
          {nagorikSubmission?.adcMamlaInfo?.length > 0 ? (
            <table className="table table-sm bg-base-100 shadow mt-2 border border-base-content/5 rounded-box w-full overflow-x-auto">
              <thead>
                <tr className="bg-base-200">
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
                    <td>{m.district.bn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>তথ্য নেই</p>
          )}
        </div>
      )}
      {isApproved &&
      <div>
        <OfficeMessaging caseData={caseData} role={role} />
      </div>
}
    </div>
  );
};

export default LawyerDetails;

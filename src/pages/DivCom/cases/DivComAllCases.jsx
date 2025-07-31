// src/pages/DivComAllCases.jsx
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";
import { toast } from "sonner";
import Swal from "sweetalert2";
import axiosPublic from "../../../axios/axiosPublic";
import { AuthContext } from "../../../provider/AuthProvider";

const DivComAllCases = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { data: cases = [], isLoading, refetch } = useQuery({
    queryKey: ["divcomCases", user?.role],
    queryFn: async () => {
      const res = await axiosPublic.get("/cases", {
        params: {
          "submittedBy.role": "lawyer",
          isApproved: false, // Only pending approval
        },
      });
      return res.data;
    },
  });

  const handleApprove = async (cas) => {
    const confirm = await Swal.fire({
      title: "আপনি কি মামলাটি অনুমোদন করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অনুমোদন করুন",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosPublic.patch(`/cases/${cas._id}`, {
        isApproved: true,
      });

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

  if (isLoading) return <p>লোড হচ্ছে...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 font-bold text-xl">আইনজীবীর দাখিলকৃত মামলা (অনুমোদনের অপেক্ষায়)</h2>
      <div className="overflow-x-auto">
        <table className="table bg-base-100 border border-base-content/5 rounded-box w-full">
          <thead>
            <tr className="text-center">
              <th>ক্রমিক</th>
              <th>ট্র্যাকিং নম্বর</th>
              <th>বাদী</th>
              <th>বিবাদী</th>
              <th>মামলার নাম</th>
              <th>অবস্থা</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((cas, index) => (
              <tr key={cas._id} className="text-center">
                <td>{index + 1}</td>
                <td>{cas.trackingNo}</td>
                <td>
                  {cas.nagorikSubmission?.badi?.map((b) => b.name).join(", ") || "-"}
                </td>
                <td>
                  {cas.nagorikSubmission?.bibadi?.map((b) => b.name).join(", ") || "-"}
                </td>
                <td>
                  {cas.nagorikSubmission?.aclandMamlaInfo?.map((info) => (
                    <div key={info.mamlaNo}>
                      {info.mamlaName} - {info.mamlaNo}/{info.year}
                    </div>
                  )) || "-"}
                </td>
                <td>{cas.isApproved ? "অনুমোদিত" : "অপেক্ষমাণ"}</td>
                <td className="flex gap-1 justify-center">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/dashboard/divCom/cases/${cas._id}`)}
                  >
                    <FcViewDetails className="w-6 text-xl" />
                  </button>

                  {!cas.isApproved && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleApprove(cas)}
                    >
                      অনুমোদন করুন
                    </button>
                  )}
                </td>
              </tr> 
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DivComAllCases;

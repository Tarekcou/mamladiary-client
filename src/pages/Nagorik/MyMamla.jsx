import React, { useContext, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { MdSignalWifiStatusbar1Bar } from "react-icons/md";
import { Check, ReceiptRussianRubleIcon, Send, Undo } from "lucide-react";

const MyMamla = () => {
  const { user } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const queryClient = useQueryClient();  
  const {
    data: caseData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["nagorikCases", user?._id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases`, {
        params: { submittedBy: user?._id },
      });
      // console.log(res.data.nagorikSubmission.status)

      return res.data;
    },
  });
  const filteredCases = caseData.filter((cas) => {
    const badiNames = cas.nagorikSubmission?.badi
      ?.map((b) => b.name)
      .join(" ")
      .toLowerCase();
    const bibadiNames = cas.nagorikSubmission?.bibadi
      ?.map((b) => b.name)
      .join(" ")
      .toLowerCase();
    const trackingNo = cas.trackingNo?.toString().toLowerCase();
    const yearMatch = cas.nagorikSubmission?.aclandMamlaInfo
      ?.map((info) => info.year)
      .join(" ")
      .toLowerCase();

    return (
      badiNames?.includes(searchText.toLowerCase()) ||
      bibadiNames?.includes(searchText.toLowerCase()) ||
      trackingNo?.includes(searchText.toLowerCase()) ||
      yearMatch?.includes(searchText.toLowerCase())
    );
  });

  // Delete handler with confirmation
  const handleDelete = async (caseId) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত যে এই মামলাটি মুছে ফেলতে চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosPublic.delete(`/cases/${caseId}`);
      if (res.data.result.deletedCount > 0) {
        toast.success("মামলাটি সফলভাবে মুছে ফেলা হয়েছে।");
        refetch();
      } else {
        toast.error("মামলাটি মুছে ফেলা যায়নি।");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      toast.error("মামলাটি মুছে ফেলতে সমস্যা হয়েছে।");
    }
  };
  const handleStatusChange = async (caseId, stageKey, newStatus) => {
    const confirm = await Swal.fire({
      title: "আপনি কি প্রেরন চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রেরন করুন!",
    });

    if (!confirm.isConfirmed) return;
    try {
      const res = await axiosPublic.patch(`/cases/${caseId}/status`, {
        stageKey,
        status: newStatus,
      });
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
  
      if (res.data.success) {
        toast.success("স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে");
        refetch();
      } else {
        toast.error("স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে");
    }
  };
  
  

  if (isLoading) return <p>লোড হচ্ছে...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 font-bold text-xl">আমার দাখিলকৃত মামলা সমূহ</h2>

      {/* Search input */}
      <div className="mb-4 max-w-sm">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="সার্চ করুন (ট্র্যাকিং, বাদী, বিবাদী, বছর)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table bg-base-100 border border-base-content/5 rounded-box w-full">
          <thead>
            <tr className="text-center">
              <th>ক্রমিক</th>
              <th>ট্র্যাকিং নম্বর</th>
              <th>বাদী</th>
              <th>বিবাদী</th>
              <th>মামলা (AC Land)</th>
              <th>মামলা (ADC)</th>
              <th>স্টেটাস</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  কোনো মামলা পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filteredCases.map((cas, index) => (
                <tr key={cas._id} className="text-center">
                  <td>{index + 1}</td>
                  <td>{cas.trackingNo}</td>
                  <td>
                    {cas.nagorikSubmission?.badi
                      ?.map((b) => b.name)
                      .join(", ") || "-"}
                  </td>
                  <td>
                    {cas.nagorikSubmission?.bibadi
                      ?.map((b) => b.name)
                      .join(", ") || "-"}
                  </td>
                  <td>
                    {cas.nagorikSubmission?.aclandMamlaInfo?.map((info) => (
                      <div key={info.mamlaNo}>
                        {info.mamlaName} - {info.mamlaNo}/{info.year} ({info.district.bn})
                      </div>
                    )) || "-"}
                  </td>
                  <td>
                    {cas.nagorikSubmission?.adcMamlaInfo?.map((info) => (
                      <div key={info.mamlaNo}>
                        {info.mamlaName} - {info.mamlaNo}/{info.year} ({info.district.bn})
                      </div>
                    )) || "-"}
                  </td>
                  <td className="">{cas.isApproved ? <h1 className="text-green-500 font-bold">"অনুমোদিত"</h1> : <h1 className="text-red-500 font-bold">"অনুমোদনের জন্য অপেক্ষমাণ"</h1>}</td>
                  <td className="flex flex-col justify-center gap-2">
                    {/* Edit button */}
                    {cas?.nagorikSubmission?.status!="submitted" &&
                    <>
                     <button
                      onClick={() =>
                        navigate(`/dashboard/${user.role}/cases/edit/${cas._id}`, {
                          state: { caseData: cas },
                        })
                      }
                      className="btn btn-sm btn-warning"
                    >
                      সম্পাদনা
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(cas._id)}
                      className="btn btn-sm btn-error"
                    >
                      মুছে ফেলুন
                    </button>
                    <button
          onClick={() => handleStatusChange(cas._id, "nagorikSubmission", "submitted")}
          className="btn btn-sm bg-blue-500 text-white"
        >
          {cas?.nagorikSubmission?.status!="submitted" && <h1 className="flex items-center  text-xs">প্রেরন   </h1>}
        </button>
                    </>
                   
              }
                      
                    {cas?.nagorikSubmission?.status=="submitted" &&  <h1 className="flex items-center  text-md gap-1  text-success font-semibold"><Check className="w-5"/>প্রেরিত </h1>}

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyMamla;

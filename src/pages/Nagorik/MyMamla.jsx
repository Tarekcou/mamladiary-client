import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";

const MyMamla = () => {
  const { user } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const {
    data: cases = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myCases", user?._id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases`, {
        params: { submittedBy: user?._id },
      });
      return res.data;
    },
  });

  const filteredCases = cases.filter((cas) => {
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
                        {info.mamlaName} - {info.mamlaNo}/{info.year} ({info.district})
                      </div>
                    )) || "-"}
                  </td>
                  <td>
                    {cas.nagorikSubmission?.adcMamlaInfo?.map((info) => (
                      <div key={info.mamlaNo}>
                        {info.mamlaName} - {info.mamlaNo}/{info.year} ({info.district})
                      </div>
                    )) || "-"}
                  </td>
                  <td className="">{cas.isApproved ? <h1 className="text-green-500 font-bold">"অনুমোদিত"</h1> : <h1 className="text-red-500 font-bold">"অনুমোদনের জন্য অপেক্ষমাণ"</h1>}</td>
                  <td className="flex justify-center gap-2">
                    {/* Edit button */}
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

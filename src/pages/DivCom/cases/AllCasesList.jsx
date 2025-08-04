// src/pages/DivComAllCases.jsx
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { FcViewDetails } from "react-icons/fc";
import { toast } from "sonner";
import Swal from "sweetalert2";
import axiosPublic from "../../../axios/axiosPublic";
import { AuthContext } from "../../../provider/AuthProvider";
import { Edit, PlusSquareIcon, Send } from "lucide-react";
import OfficeMessaging from "./OfficeMessaging";

const AllCasesList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const allCasesPath = location.pathname.includes("allCases");
  const {
    data: caseData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["caseData", user?.role, allCasesPath],
    queryFn: async () => {
      const params = { role: user.role };

      if (user.role === "acLand" || user.role === "adc") {
        params.officeName = user.officeName.en;
        params.district = user.district.en;
      }

      if (user.role === "divCom" && !allCasesPath) {
        params.isApproved = false; // optional filter
      }

      if (user.role === "nagorik" || user.role === "lawyer") {
        params.userId = user._id;
      }
      console.log("DivComAllCases params:", params);
      const res = await axiosPublic.get("/cases", { params });
      console.log("DivComAllCases response:", res.data);
      return res.data;
    },
    enabled: !!user,
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
  if (isError) return <p>ত্রুটি ঘটেছে</p>;
  return (
    <div className="p-4">
      <h2 className="mb-4 font-bold text-xl">
        আইনজীবীর দাখিলকৃত মামলা (অনুমোদনের অপেক্ষায়)
      </h2>
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
            {caseData?.map((cas, index) => (
              <tr key={cas._id} className="text-center">
                <td>{index + 1}</td>
                <td>{cas.trackingNo}</td>
                <td>
                  {cas.nagorikSubmission?.badi?.map((b) => b.name).join(", ") ||
                    "-"}
                </td>
                <td>
                  {cas.nagorikSubmission?.bibadi
                    ?.map((b) => b.name)
                    .join(", ") || "-"}
                </td>
                <td>
                  {(user.role === "acLand"
                    ? cas.nagorikSubmission?.aclandMamlaInfo
                    : cas.nagorikSubmission?.adcMamlaInfo
                  )?.map((info) => (
                    <div key={info.mamlaNo}>
                      {info.mamlaName} - {info.mamlaNo}/{info.year}
                    </div>
                  )) || "-"}
                </td>
                <td>{cas.isApproved ? "অনুমোদিত" : "অপেক্ষমাণ"}</td>


                <td className="flex flex-col justify-center gap-1">
                  <div>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() =>
                      navigate(`/dashboard/${user.role}/cases/${cas._id}`, {
                        state: { id: cas._id, mode: "view" },
                      })
                    }
                  >
                    <FcViewDetails className="w-6 text-xl" />
                  </button>

                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(
                        `/dashboard/${user.role}/cases/order/${cas._id}`,
                        {
                          state: { caseData: cas, mode: "add" }, // <-- edit mode flag
                        }
                      )
                    }
                  >
                    <PlusSquareIcon className="w-6 text-xl" />
                  </button>
                  </div>

                  <OfficeMessaging caseData={caseData} role={user.role}/>
                

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

export default AllCasesList;

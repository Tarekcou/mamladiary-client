import React, { useContext, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // default tooltip style
import "tippy.js/animations/scale.css"; // animation
import axiosPublic from "../../axios/axiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { MdDelete, MdSignalWifiStatusbar1Bar } from "react-icons/md";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Delete,
  DeleteIcon,
  Edit,
  LucideDelete,
  ReceiptRussianRubleIcon,
  Send,
  SendIcon,
  Undo,
} from "lucide-react";
import { FcViewDetails } from "react-icons/fc";

const AllCasesList = () => {
  const { user } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const allCasesPath = location.pathname.includes("allCases");

  const queryClient = useQueryClient();
  const {
    data: caseData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["caseData", user?.role, allCasesPath],
    queryFn: async () => {
      const params = { role: user.role };
      // console.log(user.officeName.en);
      if (user.role === "acLand") {
        params.officeName = user.officeName.en;
        params.district = user.district.en;
      }
      if (user.role === "adc") {
        params.district = user.district.en;
        params.officeName = user.district.en;
      }

      if (user.role === "divCom" && !allCasesPath) {
        params.isApproved = false; // optional filter
        params.status = "submitted";
      }

      if (user.role === "nagorik" || user.role === "lawyer") {
        params.userId = user._id;
      }
      // console.log("DivComAllCases params:", params);
      const res = await axiosPublic.get("/cases", { params });
      // console.log("DivComAllCases response:", res.data);
      return res.data;
    },
    enabled: !!user,
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
  const handleApprove = async (cas) => {
    console.log(cas);
    const confirm = await Swal.fire({
      title: "আপনি কি মামলাটি অনুমোদন করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অনুমোদন করুন",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosPublic.patch(`/cases/divCom/${cas._id}/approve`, {
        isApproved: true,
      });
      console.log(res.data);
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
      const res = await axiosPublic.delete(`/cases/nagorik/${caseId}`);
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
  const handleCaseSent = async (caseId, stageKey, newStatus) => {
    const confirm = await Swal.fire({
      title: "আপনি কি প্রেরন চান?",
      text: "এই কাজটি অপরিবর্তনীয়!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রেরন করুন!",
    });

    if (!confirm.isConfirmed) return;
    try {
      const res = await axiosPublic.patch(`/cases/nagorik/sentTodivCom/${caseId}`, {
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
      console.log(res.data);

      if (res.data.success) {
        toast.success(" সফলভাবে প্রেরণ  করা হয়েছে");
        refetch();
      } else {
        toast.error(" প্রেরণে  ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("প্রেরণে সমস্যা হয়েছে");
    }
  };

  if (isLoading) return <p>লোড হচ্ছে...</p>;

  return (
    <div className="p-4">
      <h2 className="flex items-center gap-1 mb-4 font-bold text-xl">
        আমার দাখিলকৃত মামলা সমূহ
      </h2>

      {/* Search input */}
      <div className="mb-4 max-w-sm">
        <input
          type="text"
          className="input-bordered w-full input"
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
                <td colSpan="8" className="py-4 text-center">
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
                        {info?.mamlaName} - {info?.mamlaNo}/{info.year} (
                        {info?.officeName?.bn}- {info?.district?.bn} )
                      </div>
                    )) || "-"}
                  </td>
                  <td>
                    {cas.nagorikSubmission?.adcMamlaInfo?.map((info) => (
                      <div key={info.mamlaNo}>
                        {info.mamlaName} - {info.mamlaNo}/{info.year} (
                        {info.district.bn})
                      </div>
                    )) || "-"}
                  </td>
                  <td className="">
                    {cas.isApproved ? (
                      <h1 className="font-bold text-green-500">"অনুমোদিত"</h1>
                    ) : cas.nagorikSubmission.status == "submitted" ? (
                      <>
                        <div className="my-1 badge badge-success">
                          <Check className="w-5" />
                          প্রেরিত{" "}
                        </div>

                        <h1 className="font-bold text-red-500">
                          "অনুমোদনের জন্য অপেক্ষমাণ"
                        </h1>
                      </>
                    ) : (
                      <>
                        <h1 className="font-bold text-secondary">
                          {" "}
                          অনুমোদনের জন্য প্রেরণ করুন{" "}
                        </h1>
                      </>
                    )}
                  </td>
                  <td className="p-1">
                    <div className="justify-center items-center gap-2 grid grid-cols-2 h-full">
                      <Tippy
                        className=""
                        content="বিস্তারিত দেখুন "
                        animation="scale"
                        duration={[150, 100]} // faster show/hide
                      >
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() =>
                            navigate(
                              `/dashboard/${user.role}/cases/${cas._id}`,
                              {
                                state: { id: cas._id, mode: "view" },
                              }
                            )
                          }
                        >
                          <h1>
                            <FcViewDetails className="text-2xl" />
                          </h1>
                        </button>
                      </Tippy>

                      {/* Edit button */}
                      {cas?.nagorikSubmission?.status != "submitted" &&
                        user.role == "lawyer" && (
                          <>
                            <Tippy
                              content="প্রেরণ করুন"
                              animation="scale"
                              duration={[150, 100]} // faster show/hide
                            >
                              <button
                                onClick={() =>
                                  handleCaseSent(
                                    cas._id,
                                    "nagorikSubmission",
                                    "submitted"
                                  )
                                }
                                className="bg-blue-500 text-white btn-sm btn"
                              >
                                {cas?.nagorikSubmission?.status !=
                                  "submitted" && (
                                  <h1 className="flex flex-col items-center text-xs">
                                    <SendIcon />
                                  </h1>
                                )}
                              </button>
                            </Tippy>
                            <Tippy
                              content="সম্পাদন করুন "
                              animation="scale"
                              duration={[150, 100]} // faster show/hide
                            >
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/${user.role}/cases/edit/${cas._id}`,
                                    {
                                      state: { caseData: cas },
                                    }
                                  )
                                }
                                className="btn btn-warning btn-sm"
                              >
                                <h1>
                                  <Edit />
                                </h1>
                              </button>
                            </Tippy>

                            {/* Delete button */}
                            <Tippy
                              content="মুছে ফেলুন "
                              animation="scale"
                              duration={[150, 100]} // faster show/hide
                            >
                              <button
                                onClick={() => handleDelete(cas._id)}
                                className="btn btn-error btn-sm"
                              >
                                <h1>
                                  <DeleteIcon className="text-white text-2xl" />
                                </h1>
                              </button>
                            </Tippy>
                          </>
                        )}
                      {!cas.isApproved && user?.role == "divCom" && (
                        <Tippy
                          className=""
                          content="অনুমোদন দিন"
                          animation="scale"
                          duration={[150, 100]} // faster show/hide
                        >
                          <button
                            onClick={() => handleApprove(cas)}
                            className="flex items-center w-full text-xs btn btn-sm btn-success"
                          >
                            <h1>
                              <CheckCircle2 />
                            </h1>
                          </button>
                        </Tippy>
                      )}
                    </div>
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

export default AllCasesList;

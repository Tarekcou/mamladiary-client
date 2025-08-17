import {
  ArrowDownWideNarrowIcon,
  CloudUpload,
  Delete,
  DeleteIcon,
  Edit,
  Edit2,
  FilePlus2,
  Plus,
  PlusSquareIcon,
  Send,
  SquareCheckBig,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { toast } from "sonner";
import Swal from "sweetalert2";
import axiosPublic from "../../axios/axiosPublic";
import { MdWarning } from "react-icons/md";
import Tippy from "@tippyjs/react";
import { useQuery } from "@tanstack/react-query";
import AcLandCaseUpload from "./AcLandCaseUpload";
import AcLandCases from "./AcLandCases";
const AcLandDetails = ({ id }) => {
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
      console.log("Ac land Case Data:", res.data);
      return res.data;
    },
    enabled: !!id,
  });

  const navigate = useNavigate();
  const acLandMessages =
    caseData?.messagesToOffices?.filter(
      (msg) => msg.sentTo?.role === "acLand"
    ) || [];
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(
    acLandMessages.length > 0 ? acLandMessages.length - 1 : 0
  );
  const acLandCaseData =
    caseData?.responsesFromOffices?.filter((r) => r.role === "acLand") || [];
  // console.log(acLandCaseData[0].role);
  const isUploaded = (mamlaNo) =>
    caseData?.responsesFromOffices
      ?.filter((r) => r.role === "acLand")
      ?.some((r) => r.caseEntries?.some((cas) => cas?.mamlaNo == mamlaNo));

  // console.log(isUploaded(10));
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [isFirstCollapseOpen, setIsFirstCollapseOpen] = useState(true);

  const toggleCollapse = () => setIsCollapseOpen(!isCollapseOpen);
  const toggleFirstCollapse = () =>
    setIsFirstCollapseOpen(!isFirstCollapseOpen);
  const [addedCase, setNewAddedCase] = useState({});
  const handleAddCases = () => {
    // navigate(`/dashboard/${user.role}/cases/new`, {
    //   state: { caseData, mode: "add" },
    // });
    console.log("Adding new cases for AC Land");
    setIsOpenCaseForm(true);

    setIsCollapseOpen(!isCollapseOpen);
  };
  const handleDeleteCase = async (caseId, officeIndex, entryIndex) => {
    console.log(caseId, officeIndex, entryIndex);
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই পরিবর্তন অপরিবর্তনীয় !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ ডিলেট করুন !",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.patch(
          `/cases/acLand/${caseId}/delete-mamla-entry`,
          {
            officeIndex,
            entryIndex,
          }
        );
        // console.log(res.data);
        if (res.data.message == "Mamla entry deleted successfully") {
          Swal.fire({
            title: "ডিলেট হয়েছে !",
            text: "আপনার মামলার তথ্য সফলভাবে ডিলেট হয়েছে !",
            icon: "success",
          });
          refetch();
        }
      } else toast.error("কিছু সমস্যা হয়েছে, পরে আবার চেষ্টা করুন");
    });
  };
  const handleSend = async (entry) => {
    console.log("hewfwf");
    const confirm = await Swal.fire({
      title: "আপনি কি প্রেরণ করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রেরণ করুন",
    });

    if (!confirm.isConfirmed) return;

    // Find acland response from caseData
    const aclandResp = caseData.responsesFromOffices.find(
      (resp) => resp.role === "acLand"
    );

    if (!aclandResp || !Array.isArray(aclandResp.caseEntries)) {
      toast.error("কোনো রেসপন্স পাওয়া যায়নি।");
      return;
    }

    try {
      const payload = {
        responsesFromOffices: [
          {
            role: "acLand",
            officeName: aclandResp.officeName,
            district: aclandResp.district,
            caseEntries: [
              {
                ...entry,
                mamlaNo: entry.mamlaNo, // identifier
                sentToDivcom: true,
                sentDate: new Date().toISOString(),
              },
            ],
          },
        ],
      };

      const res = await axiosPublic.patch(
        `/cases/acLand/${caseData._id}`,
        payload
      );

      if (res.data.modifiedCount > 0) {
        toast.success("প্রেরণ সফল হয়েছে!");
        refetch();
      } else {
        toast.error("মামলা আপডেট হয়নি!");
      }
    } catch (error) {
      console.error(error);
      toast.error("পাঠাতে সমস্যা হয়েছে!");
    }
  };

  return (
    <>
      {user?.role === "acLand" && (
        <>
          <h4 className="m-4 mb-2 font-semibold text-lg">
            অনুরোধকৃত মামলার তথ্য
          </h4>

          {acLandMessages.length > 0 && (
            <div className="flex flex-col w-full tabs">
              {/* Tab headers */}
              <div role="tablist" className="tabs-bordered tabs">
                {acLandMessages
                  .slice()
                  .reverse()
                  .map((_, idx) => {
                    const actualIndex = acLandMessages.length - 1 - idx; // get original index
                    return (
                      <a
                        key={actualIndex}
                        role="tab"
                        className={`tab ${
                          activeTab === actualIndex ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab(actualIndex)}
                      >
                        তাগিদ {toBanglaNumber(acLandMessages.length - idx)}
                      </a>
                    );
                  })}
              </div>

              {/* Tab contents */}
              <div className="mt-4">
                {acLandMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`${activeTab === idx ? "block" : "hidden"}`}
                  >
                    <div className="bg-base-200 shadow-sm mb-4 p-4 rounded">
                      <p className="mb-2 font-medium text-gray-700">
                        <strong>তারিখ:</strong>{" "}
                        {toBanglaNumber(msg.date.split("T")[0])}
                      </p>

                      {/* --- মামলার তথ্য Collapse --- */}
                      {/* --- Add New Case Collapse --- */}

                      <>
                        <div
                          className={`collapse collapse-arrow  bg-base-200 border border-base-300  ${
                            isFirstCollapseOpen ? "collapse-open" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isFirstCollapseOpen}
                            onChange={toggleFirstCollapse}
                          />
                          <div
                            onClick={toggleFirstCollapse}
                            className="collapse-title bg-blue-100 font-semibold"
                          >
                            মামলার তথ্য
                          </div>

                          <table className="collapse-content table shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
                            <thead>
                              <tr className="bg-gray-100">
                                <th>ক্রমিক</th>
                                <th>মামলার নাম</th>
                                <th>মামলা নং</th>
                                <th>সাল</th>
                                <th>জেলা</th>
                                <th>অফিস</th>
                                <th>আপলোড</th>
                              </tr>
                            </thead>
                            <tbody>
                              {msg.caseList?.map((m, i) => (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{m.mamlaName}</td>
                                  <td>{toBanglaNumber(m.mamlaNo)}</td>
                                  <td>{toBanglaNumber(m.year)}</td>
                                  <td>{m.district.bn}</td>
                                  <td>
                                    {m.officeName.bn}, <br /> ভূমি অফিস
                                  </td>
                                  <td>
                                    {user?.role === "acLand" &&
                                    !isUploaded(m.mamlaNo) ? (
                                      <Tippy
                                        className=""
                                        content="মামলার তথ্য যুক্ত করুন"
                                        animation="scale"
                                        duration={[150, 100]} // faster show/hide
                                      >
                                        <button
                                          onClick={() => {
                                            setNewAddedCase(m);
                                            setIsCollapseOpen(!isCollapseOpen);
                                          }}
                                          className="flex items-center gap-2 rotate-180 btn btn-sm btn-success"
                                        >
                                          <Upload className="rotate-360" />{" "}
                                        </button>
                                      </Tippy>
                                    ) : (
                                      <Tippy
                                        className=""
                                        content="এই মামলার তথ্য আপলোড হয়েছে"
                                        animation="scale"
                                        duration={[150, 100]} // faster show/hide
                                      >
                                        <h1 className="">
                                          {" "}
                                          <SquareCheckBig className="text-success" />
                                        </h1>
                                      </Tippy>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div
                          tabIndex="0"
                          className="collapse collapse-arrow bg-base-200 my-2 border border-base-300"
                        >
                          <input type="checkbox" />

                          <div className="collapse-title bg-blue-100 font-semibold">
                            বাদী বিবাদীর তথ্য
                          </div>
                          <ul className="collapse-content flex flex-col gap-1 p-0 list-disc list-inside">
                            <div className="p-2">
                              <h3 className="font-semibold">বাদী</h3>
                              {msg?.parties?.badiList.length > 0 ? (
                                <table className="table table-sm bg-base-200 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
                                  <thead>
                                    <tr className="bg-base-200 text-center">
                                      <th>ক্রমিক</th>
                                      <th>নাম</th>
                                      <th>মোবাইল</th>
                                      <th>ঠিকানা</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {msg.parties?.badiList?.map((badi, i) => (
                                      <tr
                                        className="text-center"
                                        key={`badi-${i}`}
                                      >
                                        <td>{i + 1}</td>
                                        <td>{badi.name}</td>
                                        <td>{badi.phone}</td>
                                        <td>{badi.address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>কোনো তথ্য নেই</p>
                              )}
                            </div>
                            <div className="p-2">
                              <h3 className="font-semibold">বিবাদী</h3>
                              {msg?.parties?.bibadiList.length > 0 ? (
                                <table className="table table-sm bg-base-200 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
                                  <thead>
                                    <tr className="bg-base-200 text-center">
                                      <th>ক্রমিক</th>

                                      <th>নাম</th>
                                      <th>মোবাইল</th>
                                      <th>ঠিকানা</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {msg.parties?.bibadiList?.map((badi, i) => (
                                      <tr
                                        className="text-center"
                                        key={`badi-${i}`}
                                      >
                                        <td>{i + 1}</td>
                                        <td>{badi.name}</td>
                                        <td>{badi.phone}</td>
                                        <td>{badi.address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>কোনো তথ্য নেই</p>
                              )}
                            </div>
                          </ul>
                        </div>

                        <div
                          className={`collapse collapse-arrow  bg-base-200 border border-base-300 my-2 `}
                        >
                          <input type="checkbox" />
                          <div className="collapse-title bg-blue-100 font-semibold">
                            আদেশ ও অনুরোধ
                          </div>
                          <div className="collapse-content">
                            <>
                              <p className="mt-2 whitespace-pre-wrap">
                                <span className="text-lg underline">
                                  আদেশ বিবরণী:
                                </span>
                                <br />
                                <span className="text-lg underline">
                                  সহকারীর মন্তব্যঃ{" "}
                                </span>
                                {msg?.staffNote}
                              </p>
                              <p className="mt-2 whitespace-pre-wrap">
                                <span className="underline">
                                  অতিরিক্ত কমিশনার(রাজস্ব) মহোদয়ঃ{" "}
                                </span>{" "}
                                {msg?.judgeNote}
                              </p>
                              <p className="mt-2 whitespace-pre-wrap">
                                <span className="underline">মন্তব্যঃ</span>{" "}
                                {msg?.comments}
                              </p>
                            </>

                            <p className="mt-2">
                              এই মামলার নথি যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ
                              করার জন্য অনুরোধ করা হলো।
                            </p>
                          </div>
                        </div>

                        <div
                          className={`collapse collapse-arrow  bg-base-200 border border-base-300  ${
                            isCollapseOpen ? "collapse-open" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isCollapseOpen}
                            onChange={toggleCollapse}
                          />

                          <div
                            onClick={toggleCollapse}
                            className="collapse-title flex gap-2 bg-green-100 font-semibold cursor-pointer"
                          >
                            <Plus /> মামলার তথ্য যোগ করুন
                          </div>

                          <div className="collapse-content text-sm">
                            <AcLandCaseUpload
                              cas={addedCase}
                              refetch={refetch}
                              setIsCollapseOpen={setIsCollapseOpen}
                            />
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Response Area --- */}
        </>
      )}
      <AcLandCases
        acLandCaseData={acLandCaseData}
        user={user}
        caseData={caseData}
      />
    </>
  );
};
export default AcLandDetails;

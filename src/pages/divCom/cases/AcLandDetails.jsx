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
} from "lucide-react";
import { useNavigate } from "react-router";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { toast } from "sonner";
import Swal from "sweetalert2";
import axiosPublic from "../../../axios/axiosPublic";
import { MdWarning } from "react-icons/md";
import Tippy from "@tippyjs/react";
import { useQuery } from "@tanstack/react-query";
import AcLandCaseUpload from "./AcLandCaseUpload";
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

  const acLandCaseData =
    caseData?.responsesFromOffices?.filter((r) => r.role === "acLand") || [];
  // console.log(acLandCaseData[0].role);
  const isUploaded = (mamlaNo) =>
    caseData?.responsesFromOffices
      ?.filter((r) => r.role === "acLand")
      ?.some((r) => r.caseEntries?.some((cas) => cas?.mamlaNo == mamlaNo));

  // console.log(isUploaded(10));
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const toggleCollapse = () => setIsCollapseOpen(!isCollapseOpen);
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
          `/cases/${caseId}/delete-mamla-entry`,
          {
            officeIndex,
            entryIndex,
          }
        );
        console.log(res.data);
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
  const confirm = await Swal.fire({
    title: "আপনি কি প্রেরণ করতে চান?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "হ্যাঁ, প্রেরণ করুন",
  });

  if (!confirm.isConfirmed) return;

  // Find the acLand response object in caseData
  const aclandResp = caseData.responsesFromOffices.find(
    (resp) => resp.role === "acLand"
  );

  if (
    !aclandResp ||
    !aclandResp.caseEntries ||
    aclandResp.caseEntries.length === 0
  ) {
    toast.error("কোনো রেসপন্স পাওয়া যায়নি।");
    return;
  }

  try {
    // PATCH request payload: update only one caseEntry with mamlaNo
    const res = await axiosPublic.patch(`/cases/${caseData._id}`, {
      responsesFromOffices: [
        {
          role: "acLand",
          officeName: aclandResp.officeName,
          district: aclandResp.district,
          caseEntries: [
            { ...entry,
              mamlaNo: entry.mamlaNo,         // key to identify which entry to update
              sentToDivcom: true,
              sentDate: new Date().toISOString(),
            },
          ],
        },
      ],
    });

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
      <h4 className="m-4 mb-2 font-semibold text-lg">
        রিকোয়েস্টকৃত মামলার তালিকা
      </h4>

      {acLandMessages.length > 0 &&
        acLandMessages.map((msg, idx) => (
          <div key={idx} className="bg-white shadow-sm mb-4 p-4 rounded">
            <p className="mb-2 font-medium text-gray-700">
              <strong>প্রেরণের তারিখ:</strong>{" "}
              {toBanglaNumber(msg.date.split("T")[0])}
            </p>
            <div
              tabIndex="0"
              className="collapse collapse-arrow bg-base-100 my-2 border border-base-300"
            >
              <input type="checkbox" />

              <div className="collapse-title bg-green-100 font-semibold">
                মামলার তথ্য
              </div>

              <table className="collapse-content table shadow my-2 mt-2 border border-base-content/5 rounded-box w-full overflow-x-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th>ক্রমিক</th>
                    <th>মামলার নাম</th>
                    <th>মামলা নং</th>
                    <th>সাল</th>
                    <th>জেলা</th>
                    <th>কার্যক্রম</th>
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
                        {user?.role === "acLand" && !isUploaded(m.mamlaNo) ? (
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
                              className="flex items-center gap-2 btn btn-sm btn-success"
                            >
                              <CloudUpload className="" />{" "}
                            </button>
                          </Tippy>
                        ) : (
                          <h1>
                            {" "}
                            <SquareCheckBig className="text-success" />
                          </h1>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              tabIndex="0"
              className="collapse collapse-arrow bg-base-100 my-2 border border-base-300"
            >
              <input type="checkbox" />

              <div className="collapse-title bg-green-100 font-semibold">
                বাদী বিবাদীর তথ্য
              </div>
              <ul className="collapse-content flex flex-col gap-1 p-0 list-disc list-inside">
                <div className="p-2">
                  <h3 className="font-semibold">বাদী</h3>
                  {msg?.parties?.badiList.length > 0 ? (
                    <table className="table table-sm bg-base-100 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
                      <thead>
                        <tr className="bg-base-200 text-center">
                          <th>নাম</th>
                          <th>মোবাইল</th>
                          <th>ঠিকানা</th>
                        </tr>
                      </thead>
                      <tbody>
                        {msg.parties?.badiList?.map((badi, i) => (
                          <tr key={`badi-${i}`}>
                            <td rowSpan={i + 1}>বাদী</td>
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
                    <table className="table table-sm bg-base-100 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
                      <thead>
                        <tr className="bg-base-200 text-center">
                          <th>নাম</th>
                          <th>মোবাইল</th>
                          <th>ঠিকানা</th>
                        </tr>
                      </thead>
                      <tbody>
                        {msg.parties?.bibadiList?.map((badi, i) => (
                          <tr key={`badi-${i}`}>
                            <td rowSpan={i + 1}>বাদী</td>
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
          </div>
        ))}
      {/* --- Add New Case Collapse --- */}
      {user?.role === "acLand" && (
        <div
          className={`collapse collapse-arrow  bg-base-100 border border-base-300  ${
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
            className="collapse-title flex gap-2 bg-green-100 m-4 font-semibold text-success cursor-pointer"
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
      )}

      {/* --- Response Area --- */}

      {acLandCaseData.length > 0 ? (
        <>
          <div className="flex justify-between mt-10">
            <h4 className="m-4 font-semibold text-2xl"> মামলার তথ্য</h4>
            <div className="flex flex-col gap-2">
              {acLandCaseData[0].sentToDivcom && (
                <button className="text-sm text-center whitespace-break-spaces btn btn-active">
                  {" "}
                  বর্তমান অবস্থানঃ <br /> অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব)
                  আদালত
                </button>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="print:hidden btn btn-primary btn-sm"
                >
                  PDF ডাউনলোড (Print)
                </button>
                {user?.role === "acLand" && (
                  <button
                    onClick={toggleCollapse}
                    className="flex items-center gap-2 btn btn-sm btn-primary"
                  >
                    <PlusSquareIcon className="w-5" /> মামলা যোগ করুন
                  </button>
                )}
              </div>
            </div>
          </div>

          <div id="printable-area">
            <style>{`
              #printable-area {
                min-width: 210mm;
                padding: 5mm;
                background: white;
              }
              #printable-area table {
                border-collapse: collapse;
                width: 100%;
                font-size: 12px;
                table-layout: fixed;
                border: 1px solid #000;
              }
              #printable-area th, #printable-area td {
                border: 1px solid #ccc;
                padding: 6px;
                word-break: break-word;
              }
              .section-title {
                font-weight: bold;
                font-size: 16px;
                margin: 10px 0 4px 0;
              }
              @media print {
                body * { visibility: hidden; }
                #printable-area, #printable-area * {
                  visibility: visible;
                }
                #printable-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                }
                button { display: none; }
              }
            `}</style>

            {acLandCaseData.map((res, officeIndex) =>
              res.caseEntries?.map((entry, entryIndex) => (
                <div
                  key={`${officeIndex}-${entryIndex}`}
                  className="bg-white shadow mb-8 p-4 print:break-after-page"
                >
                  <div className="flex justify-between mb-2 font-bold text-lg">
                    <div>
                      <h1>
                        {" "}
                        অফিস: {res.officeName?.bn || res.officeName.en} ভূমি
                        অফিস{" "}
                      </h1>
                      <h1> জেলা: {res.district?.bn || res.district.en} </h1>
                    </div>

                    {user?.role === "acLand" &&
                      !acLandCaseData[0].sentToDivcom && !entry?.sentToDivcom? (
                        <div className="flex flex-col  justify-end items-end gap-2">
                          <div className="flex gap-2">
                            <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              navigate(
                                `/dashboard/${user?.role}/cases/edit/${caseData._id}`,
                                {
                                  state: {
                                    id: caseData._id,
                                    caseData,
                                    mode: "edit",
                                    entryIndex,
                                  },
                                }
                              )
                            }
                          >
                            <Edit2 className="w-4" />
                          </button>
                          {/* handle delete */}
                          <button
                            className="btn btn-error btn-sm"
                            onClick={() =>
                              handleDeleteCase(
                                caseData._id,
                                officeIndex,
                                entryIndex
                              )
                            }
                          >
                            <DeleteIcon className="w-5" />
                          </button>

                          </div>
                          
                          
              <button
              onClick={() => handleSend(entry)}
           className="gap-2 mb-4 btn btn-success btn-sm"
           >
              <Send /> প্রেরণ করুন
             </button>
        
  
                        </div>
                      ):
                      <>
                      <h1 className="text-xs badge badge-accent">অতিরিক্ত বিভাগীয় কমিশনার(রাজস্ব) আদালতে প্রেরন করা হয়েছে </h1>
                      </>}
                  </div>

                  {/* Tracking No */}
                  <div className="mb-2">
                    <strong>Tracking ID:</strong> {caseData.trackingNo}
                  </div>

                  {/* Case Info Table */}
                  <div className="overflow-x-auto">
                    <table className="table table-md table-zebra bg-base-100 shadow-md p-4 border border-base-200 rounded-box w-full overflow-x-auto text-sm">
                      <tbody>
                        <tr className="p-4">
                          <td className="font-semibold text-gray-600">
                            মামলার নাম:
                          </td>
                          <td className="text-gray-800">
                            {entry.mamlaName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-600">
                            মামলা নং:
                          </td>
                          <td className="text-gray-800">
                            {entry.mamlaNo || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-600">সাল:</td>
                          <td className="text-gray-800">
                            {entry.year || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-600">জেলা:</td>
                          <td className="text-gray-800">
                            {res.district?.bn || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Case History */}
                  {entry?.caseHistory ? (
                    <div className="my-4">
                      <strong className="font-bold underline">
                        মামলার ইতিহাস:
                      </strong>
                      <div>{entry?.caseHistory || "N/A"}</div>
                    </div>
                  ) : (
                    <>
                    {(entry.orderSheets ?? []).map((o) => (                    
                          <div className="my-4">
                          <div className="flex gap-2 my-4">
                            <h1 className="underline">আদেশের তারিখঃ</h1>{" "}
                            <h1 className="">{toBanglaNumber(o.date)}</h1>
                          </div>
                          <strong className="font-bold underline">
                            মামলার আদেশ:
                          </strong>
                          <div>{o?.order || "N/A"}</div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Remarks */}
                  <div className="mb-4">
                    <strong>মন্তব্য:</strong>
                    <div>{entry.remarks || "N/A"}</div>
                  </div>

                  {/* Documents */}
                  {entry.documents?.length > 0 ? (
                    <div className="mb-2">
                      <strong>সংযুক্তি:</strong>
                      <ul className="ml-5 text-blue-600 list-disc">
                        {entry.documents.map((doc, k) => (
                          <li key={k}>
                            <a
                              href={doc.url}
                              // target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {doc.label || "সংযুক্তি নেই "}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <>
                      <h1>N/A</h1>
                    </>
                  )}
                </div>
              ))
            )}

            {/* {user.role === "acLand" && !acLandCaseData[0].sentToDivcom && (
              <div className="flex justify-center items-center w-full">
                <button
                  onClick={() => handleSend()}
                  className="gap-2 mb-4 btn btn-success"
                >
                  <Send /> প্রেরণ করুন
                </button>
              </div>
            )} */}
          </div>
        </>
      ) : (
        <div className="flex gap-2 mb-20 px-4 text-gray-500 italic">
          <MdWarning className="text-xl" /> AC Land থেকে কোনো রেসপন্স পাওয়া
          যায়নি।
        </div>
      )}
    </>
  );
};
export default AcLandDetails;

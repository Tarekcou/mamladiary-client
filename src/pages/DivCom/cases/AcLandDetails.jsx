import {
  ArrowDownWideNarrowIcon,
  Delete,
  DeleteIcon,
  Edit,
  Edit2,
  PlusSquareIcon,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router";
import LawyerDetails from "./LawyerDetails";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import { useContext } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
const AcLandDetails = ({ caseData }) => {
  const navigate = useNavigate();
  const acLandMessages =
    caseData?.messagesToOffices?.filter(
      (msg) => msg.sentTo?.role === "acLand"
    ) || [];
  const { role } = useContext(AuthContext);

  const responses =
    caseData?.responsesFromOffices?.filter((r) => r.role === "acLand") || [];
  return (
    <>
      <h4 className="m-4 mb-2 font-semibold text-lg">
        রিকোয়েস্টকৃত মামলার তালিকা
      </h4>

      {acLandMessages.length > 0 ? (
        acLandMessages.map((msg, idx) => (
          <div key={idx} className="bg-white shadow-sm mb-4 p-4 rounded">
            <p className="mb-2 font-medium text-gray-700">
              <strong>প্রেরণের তারিখ:</strong>{" "}
              {toBanglaNumber(msg.date.split("T")[0])}
            </p>

            <table className="table bg-base-100 shadow mt-2 border border-base-content/5 rounded-box w-full overflow-x-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th>ক্রমিক</th>
                  <th>মামলার নাম</th>
                  <th>মামলা নং</th>
                  <th>সাল</th>
                  <th>জেলা</th>
                </tr>
              </thead>
              <tbody>
                {msg.mamlaList?.map((m, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{m.mamlaName}</td>
                    <td>{m.mamlaNo}</td>
                    <td>{m.year}</td>
                    <td>{m.district.bn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              tabIndex="0"
              className="collapse collapse-arrow bg-base-100 my-2 border border-base-300"
            >
              <input type="checkbox" />

              <div className="collapse-title font-semibold">
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
        ))
      ) : (
        <LawyerDetails role={"acLand"} caseData={caseData} />
      )}

      {/* --- Response Area --- */}

      {responses.length > 0 ? (
        <>
          <div className="flex justify-between">
            <h4 className="m-4 font-semibold text-2xl">আগত মামলার তথ্য</h4>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="print:hidden btn btn-primary btn-sm"
              >
                PDF ডাউনলোড (Print)
              </button>
              <div className="">
                {role === "acLand" && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(`/dashboard/acLand/newCase`, {
                        state: { id: caseData._id, mode: "add" },
                      })
                    }
                  >
                    <PlusSquareIcon className="mr-2 w-5" /> মামলা যোগ করুন
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

            {responses.map((res, i) =>
              res.mamlaEntries?.map((entry, j) => (
                <div
                  key={`${i}-${j}`}
                  className="bg-white shadow mb-8 p-4 print:break-after-page"
                >
                  <div className="flex justify-between mb-2 font-bold text-lg">
                    <h1> অফিস: {res.officeName?.bn || res.officeName}</h1>
                    {role === "acLand" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          navigate(`/dashboard/acLand/newCase`, {
                            state: { id: caseData._id, caseData, mode: "edit" },
                          })
                        }
                      >
                        <Edit2 className="mr-2 w-5" /> মামলা সম্পাদনা করুন
                      </button>
                    )}
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
                  <div className="my-4">
                    <strong className="font-bold underline">
                      মামলার ইতিহাস:
                    </strong>
                    <div>{entry?.caseHistory || "N/A"}</div>
                  </div>
                  <div className="mb-4">
                    <strong>আদেশ:</strong>
                    <div>{entry?.order || "N/A"}</div>
                  </div>

                  {/* Remarks */}
                  <div className="mb-4">
                    <strong>মন্তব্য:</strong>
                    <div>{entry.remarks || "N/A"}</div>
                  </div>

                  {/* Documents */}
                  {entry.documents?.length > 0 && (
                    <div className="mb-2">
                      <strong>সংযুক্তি:</strong>
                      <ul className="ml-5 text-blue-600 list-disc">
                        {entry.documents.map((doc, k) => (
                          <li key={k}>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {doc.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="px-4 text-gray-500 italic">
          AC Land থেকে কোনো রেসপন্স পাওয়া যায়নি।
        </div>
      )}
    </>
  );
};
export default AcLandDetails;

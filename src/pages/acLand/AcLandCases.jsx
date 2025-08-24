import { useState } from "react";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { MdWarning } from "react-icons/md";
import { DeleteIcon, Edit2, PlusSquareIcon, Send } from "lucide-react";
import Swal from "sweetalert2";
import axiosPublic from "../../axios/axiosPublic";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 1; // change as needed

export default function AcLandCases({ acLandCaseData, user, caseData,refetch }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Flatten the nested structure (office -> entries) into one array
  const flattenedEntries = acLandCaseData.flatMap(
    (res, officeIndex) =>
      res.caseEntries?.map((entry, entryIndex) => ({
        entry,
        officeIndex,
        entryIndex,
        res,
      })) || []
  );
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const toggleCollapse = () => setIsCollapseOpen(!isCollapseOpen);

  const totalPages = Math.ceil(flattenedEntries.length / ITEMS_PER_PAGE);

  const paginatedEntries = flattenedEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handleSend = async (entry) => {
    console.log("hewfwf");
    const confirm = await Swal.fire({
      title: "আপনি কি প্রেরণ করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, প্রেরণ করুন",
    });

    if (!confirm.isConfirmed) return;

    // Find acLand response from caseData
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
    <div>
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
                #print-hidden{
                display:none
                }
              }
                
            `}</style>

      {acLandCaseData.length > 0 ? (
        <div>
          <div>
            <div className="flex justify-between mt-10">
              <h4 className="m-4 font-semibold text-2xl">
                আপলোড কৃত মামলার তথ্য
              </h4>
              <div className="flex flex-col gap-2">
                {acLandCaseData[0].sentToDivcom && (
                  <button className="text-sm text-center whitespace-break-spaces btn btn-error">
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
                  {/* {user?.role === "acLand" && (
                    <button
                      onClick={toggleCollapse}
                      className="flex items-center gap-2 btn btn-sm btn-primary"
                    >
                      <PlusSquareIcon className="w-5" /> মামলা যোগ করুন
                    </button>
                  )} */}
                </div>
              </div>
            </div>
            <div id="printable-area">
              {paginatedEntries
                .slice()
                .reverse()
                .map(({ entry, res, officeIndex, entryIndex }) => (
                  <div
                    key={`${officeIndex}-${entryIndex}`}
                    className="bg-base-200 shadow mb-8 p-4 overflow-x-auto print:break-after-page"
                  >
                    <div className="flex justify-between bg-gray-100 mb-2 p-2 rounded font-bold text-lg">
                      <div>
                        <h1>
                          নম্বরঃ {entryIndex + 1}
                          <br />
                          অফিস: {res.officeName?.bn || res.officeName.en} ভূমি
                          অফিস
                        </h1>
                        <h1> জেলা: {res.district?.bn || res.district.en} </h1>
                      </div>

                      {user?.role === "acLand" &&
                      !acLandCaseData[0].sentToDivcom &&
                      !entry?.sentToDivcom ? (
                        <div className="flex flex-col flex-wrap justify-end items-end gap-2">
                          <div className="flex justify-center items-center gap-2 w-full">
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
                            className="gap-2 btn btn-success btn-sm"
                          >
                            <Send /> প্রেরণ করুন
                          </button>
                        </div>
                      ) : (
                        <div id="print-hidden" className="flex items-center">
                          <h1 className="bg-blue-300 text-xs badge">
                            বর্তমান অবস্থানঃ অতিরিক্ত বিভাগীয় কমিশনার(রাজস্ব)
                            আদালত
                          </h1>
                        </div>
                      )}
                    </div>

                    {/* Tracking No */}
                    <div className="mb-2">
                      <strong>Tracking ID:</strong> {caseData.trackingNo}
                    </div>

                    {/* Case Info */}
                    <div className="overflow-x-auto">
                      <table className="table table-md table-zebra w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="font-semibold">মামলার নাম:</td>
                            <td>{entry.mamlaName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold">মামলা নং:</td>
                            <td>{entry.mamlaNo || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold">সাল:</td>
                            <td>{entry.year || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold">জেলা:</td>
                            <td>{res.district?.bn || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

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
                  </div>
                ))}
            </div>
          </div>
          {/* Render paginated entries */}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${
                  currentPage === idx + 1 ? "btn-active btn-primary" : ""
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 shadow-2xl my-20 px-6 text-gray-500 italic">
          <MdWarning className="text-xl" /> ভূমি অফিসএক্স থেকে কোনো রেসপন্স
          পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}

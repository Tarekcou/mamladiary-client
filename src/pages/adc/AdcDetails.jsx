import {
  ArrowDownWideNarrowIcon,
  CloudUpload,
  Delete,
  DeleteIcon,
  Edit,
  Edit2,
  Plus,
  PlusSquareIcon,
  Send,
  SquareCheckBig,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import AdcOrder from "./AdcOrder";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import { MdWarning } from "react-icons/md";
import Tippy from "@tippyjs/react";
import DivComOrders from "../divCom/cases/DivComOrders";
const AdcDetails = ({ id }) => {
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);
  const [isCollapseOpen, setIsCollapseOpen] = useState(true);
  const [addedOrder, setNewAddedOrder] = useState({});

  const toggleCollapse = () => setIsCollapseOpen(!isCollapseOpen);
  const {
    data: caseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adcDetails", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases/${id}`);
      console.log("ADC Case Data:", res.data);
      return res.data;
    },
    enabled: !!id,
  });
  const isUploaded = (mamlaNo) =>
    caseData?.responsesFromOffices?.some(
      (r) =>
        r.role === "adc" &&
        r.mamlaNo == mamlaNo &&
        Array.isArray(r.orderSheets) &&
        r.orderSheets.length > 0
    );

  const adcMessages = useMemo(() => {
    return (
      caseData?.messagesToOffices?.filter(
        (msg) => msg.sentTo?.role === "adc"
      ) || []
    );
  }, [caseData]);
  // console.log(adcMessages);
  const adcOrderData =
    caseData?.responsesFromOffices?.filter((r) => r.role === "adc") || [];
  // console.log(adcOrderData);
  const isAnyOrderSent = adcOrderData[0]?.orderSheets?.some(
    (order) => order.sentToDivcom === true
  );

  return (
    <>
      <style>{`
       @media print {
       .no-print {
    display: none !important; /* hide elements you don't want in print */
  }
       }
      `}</style>
      {adcMessages.length > 0 ? (
        adcMessages.map((msg, idx) => (
          <div key={idx} className="bg-base-200 mb-4 rounded h-full">
            {user?.role === "adc" && (
              <>
                <h4 className="my-2 font-semibold text-lg no-print">
                  মামলার তথ্য
                </h4>

                <p className="mb-2 font-medium text-gray-700 no-print">
                  <strong> তারিখ:</strong>{" "}
                  {toBanglaNumber(msg.date.split("T")[0])}
                </p>
                <div
                  tabIndex="0"
                  className="collapse collapse-open bg-base-200 my-2 border border-base-300 no-print"
                >
                  <input type="checkbox" />

                  <div className="collapse-title bg-green-100 font-semibold">
                    মামলার তথ্য
                  </div>
                  <table className="collapse-content table bg-base-200 mt-2 border border-base-content/5 rounded-box w-full overflow-x-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th>ক্রমিক</th>
                        <th>মামলার নাম</th>
                        <th>মামলা নং</th>
                        <th>সাল</th>
                        <th>জেলা</th>
                        <th>অফিস </th>
                        <th>কার্যক্রম</th>
                      </tr>
                    </thead>
                    <tbody>
                      {msg.caseList?.map((m, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{m.mamlaName}</td>
                          <td>{m.mamlaNo}</td>
                          <td>{m.year}</td>
                          <td>{m.district.bn}</td>
                          <td>
                            জেলা প্রশাসকের <br /> কার্যালয়, {m.officeName.bn}
                          </td>
                          <td>
                            {user?.role === "adc" && !isUploaded(m.mamlaNo) ? (
                              <Tippy
                                className=""
                                content="মামলার তথ্য যুক্ত করুন"
                                animation="scale"
                                duration={[150, 100]} // faster show/hide
                              >
                                <button
                                  onClick={() => {
                                    setNewAddedOrder(m);
                                    setIsCollapseOpen(!isCollapseOpen);
                                  }}
                                  className="flex items-center gap-2 btn btn-sm btn-success"
                                >
                                  <CloudUpload className="" />{" "}
                                </button>
                              </Tippy>
                            ) : (
                              <Tippy
                                className=""
                                content="এই মামলার তথ্য আপলোড হয়েছে"
                                animation="scale"
                                duration={[150, 100]} // faster show/hide
                              >
                                <h1>
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
                  className="collapse collapse-arrow bg-base-200 my-2 border border-base-300 no-print"
                >
                  <input type="checkbox" />

                  <div className="collapse-title bg-green-100 font-semibold no-print">
                    বাদী বিবাদীর তথ্য
                  </div>
                  <ul className="collapse-content flex flex-col gap-1 p-0 list-disc list-inside">
                    <div className="p-2">
                      <h3 className="font-semibold">বাদী</h3>
                      {msg?.parties?.badiList.length > 0 ? (
                        <table className="table table-sm bg-base-200 border border-base-content/5 rounded-box w-full overflow-x-auto">
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
                        <table className="table table-sm bg-base-200 shadow border border-base-content/5 rounded-box w-full overflow-x-auto">
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

                <div
                  tabIndex={0}
                  className="collapse collapse-arrow bg-base-200 my-2 border border-base-300 no-print"
                >
                  <input type="checkbox" />
                  <div className="collapse-title bg-green-100 pb-1 font-bold text-base">
                    কমিশনার অফিসের আদেশ/অনুরোধ
                  </div>
                  <div className="collapse-content">
                    {msg.caseList?.map((m, i) => (
                      <>
                        <p className="mt-2 whitespace-pre-wrap">
                          <span className="text-lg underline">
                            আদেশ বিবরণী:
                          </span>
                          <br />
                          <span className="text-lg underline">
                            সহকারীর মন্তব্যঃ{" "}
                          </span>
                          {m?.staffNote}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">
                          <span className="underline">
                            অতিরিক্ত কমিশনার(রাজস্ব) মহোদয়ঃ{" "}
                          </span>{" "}
                          {m?.judgeNote}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">
                          <span className="underline">মন্তব্যঃ</span>{" "}
                          {m?.comments}
                        </p>
                      </>
                    ))}
                    <p className="mt-2">
                      এই মামলার নথি যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য
                      অনুরোধ করা হলো।
                    </p>
                  </div>
                  {/* <p className="mt-4">ধন্যবাদান্তে,</p>
        <p>[আপনার নাম বা দপ্তর]</p> */}
                </div>
              </>
            )}

            {/* --- Add New Case Collapse --- */}
            {isAnyOrderSent || user?.role === "adc" ? (
              <div
                className={`collapse collapse-arrow bg-base-200 border border-base-300  ${
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
                  className="collapse-title flex gap-2 bg-green-100 font-semibold text-blue cursor-pointer no-print"
                >
                  <Plus />
                  {user.role == "adc" ? "আদেশ পত্র" : "আদেশ দেখুন"}
                </div>

                <div className="collapse-content h-full text-sm">
                  <div className="bg-gray-100 my-5 text-center no-print card">
                    <h1 className="mt-3 font-bold text-2xl">
                      আপলোড কৃত আদেশ সমূহ
                    </h1>
                  </div>
                  <div className="">
                    <AdcOrder
                      caseData={caseData}
                      officeName={user?.officeName}
                      refetch={refetch}
                      header={addedOrder}
                      setIsCollapseOpen={setIsCollapseOpen}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 my-20 px-4 text-gray-500 italic">
                <MdWarning className="text-xl" /> ADC থেকে কোনো রেসপন্স পাওয়া
                যায়নি।
              </div>
            )}
          </div>
        ))
      ) : (
        <>
          <div className="flex gap-2 mb-18 px-4 text-gray-500 italic">
            <MdWarning className="text-xl" /> ADC থেকে কোনো রেসপন্স পাওয়া যায়নি।
          </div>
        </>
      )}
    </>
  );
};

export default AdcDetails;

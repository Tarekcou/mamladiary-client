import {
  ArrowDownWideNarrowIcon,
  Delete,
  DeleteIcon,
  Edit,
  Edit2,
  Plus,
  PlusSquareIcon,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router";
import LawyerDetails from "./LawyerDetails";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import AdcOrderDetails from "./AdcOrderDetails";
import DivComOrders from "./DivComOrders";
import AdcOrder from "./AdcOrder";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../../axios/axiosPublic";
import { MdWarning } from "react-icons/md";
const AdcDetails = ({ id }) => {
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

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
  const handleAddCases = () => {
    console.log("Adding new cases for ADC");
    navigate(`/dashboard/${user.role}/cases/order/${user._id}`, {
      state: { caseData, mode: "add" },
    });
  };
  const adcMessages = useMemo(() => {
    return (
      caseData?.messagesToOffices?.filter(
        (msg) => msg.sentTo?.role === "adc"
      ) || []
    );
  }, [caseData]);
  console.log(adcMessages);
  const adcOrderData =
    caseData?.responsesFromOffices?.filter((r) => r.role === "adc") || [];
  console.log(adcOrderData);

  return (
    <>
      <h4 className="m-4 mb-2 font-semibold text-lg">
        রিকোয়েস্টকৃত মামলার তালিকা
      </h4>
      {adcMessages.length > 0 ? (
        adcMessages.map((msg, idx) => (
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

            {/* --- Add New Case Collapse --- */}
            {adcOrderData[0]?.sentToDivcom || user?.role === "adc" ? (
              <div
                className={`collapse collapse-arrow bg-base-100 border border-base-300  ${
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
                  className="collapse-title flex gap-2 bg-green-100 font-semibold text-blue cursor-pointer"
                >
                  <Plus />
                  {user.role == "adc" ? "আদেশ যোগ করুন" : "আদেশ দেখুন"}
                </div>

                <div className="collapse-content text-sm">
                  <div className="bg-gray-100 my-5 text-center card">
                    <h1 className="my-3 font-bold text-2xl">
                      আপলোড কৃত আদেশ সমূহ
                    </h1>
                  </div>
                  <AdcOrder
                    caseData={caseData}
                    officeName={user?.officeName}
                    refetch={refetch}
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mb-20 px-4 text-gray-500 italic">
                <MdWarning className="text-xl" /> ADC থেকে কোনো রেসপন্স পাওয়া
                যায়নি।
              </div>
            )}
          </div>
        ))
      ) : (
        <>
          <div className="flex gap-2 mb-20 px-4 text-gray-500 italic">
            <MdWarning className="text-xl" /> ADC থেকে কোনো রেসপন্স পাওয়া যায়নি।
          </div>
        </>
      )}
    </>
  );
};

export default AdcDetails;

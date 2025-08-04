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
import { useContext } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import DivComDetails from "./DivComDetails";
import AdcOrderDetails from "./AdcOrderDetails";
const AdcDetails = ({ caseData, refetch }) => {
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);
  const adcMessages =
    caseData?.messagesToOffices?.filter((msg) => msg.sentTo?.role === "adc") ||
    [];
  const handleAddCases = () => {
    console.log("Adding new cases for ADC");
    navigate(`/dashboard/${user.role}/cases/order/${user._id}`, {
      state: { caseData, mode: "add" },
    });
  };

  const responses =
    caseData?.responsesFromOffices?.filter((r) => r.role === "adc") || [];
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
            <div className="bg-gray-100 my-5 text-center card">
              <h1 className="my-3 font-bold text-2xl">আপলোড কৃত আদেশ সমূহ</h1>
            </div>

            <button onClick={handleAddCases} className="flex btn-success btn">
              <Plus /> নতুন আদেশ
            </button>
            <AdcOrderDetails
              caseData={caseData}
              officeName={user?.officeName}
              refetch={refetch}
            />
          </div>
        ))
      ) : (
        <LawyerDetails role={"adc"} caseData={caseData} />
      )}
    </>
  );
};

export default AdcDetails;

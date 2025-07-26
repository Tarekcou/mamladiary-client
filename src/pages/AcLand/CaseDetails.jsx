import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CaseDetailsAcland from "./CaseDetailsAcland";
import { AuthContext } from "../../provider/AuthProvider";
import { Plus, Edit } from "lucide-react";
import CaseDetailsSenior from "../Adc/CaseDetailsSenior";

const CaseDetails = () => {
  const { state } = useLocation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const caseData = state?.caseData;
  if (!caseData) {
    return (
      <div className="p-6 text-red-500 text-center">
        কোন তথ্য পাওয়া যায়নি।
      </div>
    );
  }

  const roleStageMap = caseData.caseStages[0] || {};
  const stageRoles = Object.keys(roleStageMap);
  const [activeTab, setActiveTab] = useState(stageRoles[0]);
  const activeStage = roleStageMap[activeTab];

  const handleAddOrder = () => {
    navigate(
      `/dashboard/${caseData.currentStage.stage}/cases/newOrder/${caseData._id}`
    );
  };

  return (
    <div className="bg-white shadow mx-auto p-6 border border-gray-300 w-full">
      <h1 className="mb-6 font-bold text-2xl text-center underline">
        মামলার বিস্তারিত
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          {stageRoles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              className={`tab ${
                activeTab === role
                  ? "tab-active btn bg-blue-600 text-white"
                  : "bg-gray-200 btn"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Edit & Add buttons */}
        {activeTab === user.role && (
          <div className="flex gap-2">
            <button
              onClick={handleAddOrder}
              className="flex bg-green-600 hover:bg-green-700 text-white btn"
            >
              <Plus /> নতুন অর্ডার
            </button>
            <button
              className="btn btn-warning"
              onClick={() =>
                activeTab === "acLand"
                  ? navigate(
                      `/dashboard/${activeTab}/cases/edit/${caseData._id}`,
                      {
                        state: { caseData },
                      }
                    )
                  : navigate(
                      `/dashboard/${activeTab}/cases/order/edit/${caseData._id}`,
                      {
                        state: { caseData },
                      }
                    )
              }
            >
              <Edit className="w-6" />
            </button>
          </div>
        )}
      </div>

      {/* Render Correct Layout */}
      {activeTab === "acLand" ? (
        <CaseDetailsAcland
          rootCaseId={caseData.rootCaseId}
          activeStage={activeStage}
          applicants={caseData.applicants}
        />
      ) : (
        <CaseDetailsSenior
          rootCaseId={caseData.rootCaseId}
          activeStage={activeStage}
        />
      )}
    </div>
  );
};

export default CaseDetails;

import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CaseDetailsAcland from "./CaseDetailsAcland";
import { AuthContext } from "../../provider/AuthProvider";
import { Plus, Edit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import CaseDetailsUpper from "../Adc/CaseDetailsUpper";

const CaseDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get tab from URL query param only
  const urlParams = new URLSearchParams(location.search);
  const tabFromQuery = urlParams.get("tab");

  // React Query to get case data
  const {
    data: caseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["caseData", id],
    queryFn: async () => {
      const response = await axiosPublic.get(`/cases/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Roles list for tabs
  const roleStageMap = caseData?.caseStages?.[0] || {};
  const stageRoles = Object.keys(roleStageMap);
  console.log()
  // Validate tab from query param, fallback to first role
  const validTab =
    tabFromQuery && stageRoles.includes(tabFromQuery)
      ? tabFromQuery
      : stageRoles[0] || "";

  const [activeTab, setActiveTab] = useState(validTab);

  // When activeTab changes, update URL query param (replace to avoid history clutter)
  useEffect(() => {
    if (!activeTab) return;

    const params = new URLSearchParams(location.search);
    if (params.get("tab") !== activeTab) {
      params.set("tab", activeTab);
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
  }, [activeTab, navigate, location.pathname, location.search]);

  const activeStage = roleStageMap[activeTab] || {};

  if (isLoading) return <div className="p-6 text-center">লোড হচ্ছে...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-500 text-center">
        ডেটা লোড ব্যর্থ: {error.message}
      </div>
    );
  if (!caseData)
    return (
      <div className="p-6 text-red-500 text-center">
        কোন তথ্য পাওয়া যায়নি।
      </div>
    );

  const handleAddOrder = () => {
    navigate(`/dashboard/${activeTab}/cases/newOrder/${caseData._id}`, {
      state: { caseData, mode: "add" },
    });
  };

  return (
    <div className="bg-white shadow mx-auto p-6 border border-gray-300 w-full max-w-5xl">
      <h1 className="mb-6 font-bold text-2xl text-center underline">
        মামলার বিস্তারিত
      </h1>

      {/* Tabs */}
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
        {(activeTab === user.role && activeTab== caseData.currentStage.stage) && (
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
                      { state: { caseData } }
                    )
                  : navigate(
                      `/dashboard/${activeTab}/cases/order/edit/${caseData._id}`,
                      { state: { caseData } }
                    )
              }
            >
              <Edit className="w-6" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === "acLand" ? (
        <CaseDetailsAcland
          rootCaseId={caseData.rootCaseId}
          activeStage={activeStage}
          applicants={caseData.applicants}
        />
      ) : (
        <CaseDetailsUpper
          rootCaseId={caseData.rootCaseId}
          activeStage={activeStage}
        />
      )}
    </div>
  );
};

export default CaseDetails;

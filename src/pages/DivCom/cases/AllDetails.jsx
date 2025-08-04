import React, { useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import CaseDetailsUpper from "../../Adc/CaseDetailsUpper";
import LawyerDetails from "./LawyerDetails";
import { Edit, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../../axios/axiosPublic";
import DivComOrderForm from "./DivComDetails";
import AcLandDetails from "./AcLandDetails";
import { AuthContext } from "../../../provider/AuthProvider";
import AdcDetails from "./AdcDetails";

const AllDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    data: caseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["caseDetails", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cases/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // 🔥 Build tab list dynamically
  const buildTabs = () => {
    if (!caseData || !user?.role) return [];

    const allTabs = [];

    // Check and push each tab based on data presence
    if (caseData.nagorikSubmission) {
      allTabs.push({ key: "lawyer", label: "Lawyer" });
    }

    if (caseData.divComReview?.orderSheets?.length > 0) {
      allTabs.push({ key: "divCom", label: "Divisional Commissioner" });
    }

    const hasAcland =
      caseData.messagesToOffices?.some((msg) => msg.sentTo.role === "acLand") ||
      caseData.responsesFromOffices?.some((res) => res.role === "acLand");

    if (hasAcland) {
      allTabs.push({ key: "acLand", label: "AC Land" });
    }

    const hasAdc =
      caseData.messagesToOffices?.some((msg) => msg.sentTo.role === "adc") ||
      caseData.responsesFromOffices?.some((res) => res.role === "adc");

    if (hasAdc) {
      allTabs.push({ key: "adc", label: "ADC (Revenue)" });
    }
    
    // 🔒 Filter based on strict role permission
    if (user.role === "divCom") return allTabs;

    return allTabs.filter((tab) => tab.key === user.role);
  };

  const dynamicTabs = buildTabs();
  console.log(dynamicTabs);
  const [activeTab, setActiveTab] = useState( user.role);

  const renderContent = () => {
    switch (activeTab) {
      case "divCom":
        return <DivComOrderForm caseData={caseData} refetch={refetch} />;
      case "adc":
        return <AdcDetails caseData={caseData} role="adc" refetch={refetch} />;
      case "acLand":
        return (
          <AcLandDetails caseData={caseData} role="acLand" refetch={refetch} />
        );
      case "lawyer":
        return (
          <LawyerDetails caseData={caseData} role="lawyer" refetch={refetch} />
        );
      default:
        return <p>Invalid tab selected.</p>;
    }
  };

  return (
    <div className="bg-base-100 shadow mx-auto px-4 py-6 rounded max-w-5xl">
      <h2 className="mb-4 font-bold text-xl">
        মামলার বিস্তারিত তথ্য (ভূমিকা অনুযায়ী)
      </h2>

      {/* Tabs */}
      <div role="tablist" className="mb-4 tabs-border tabs tabs-box">
        {dynamicTabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            onClick={() => setActiveTab(tab.key)}
            className={`tab tab-bordered ${
              activeTab === tab.key ? "tab-active text-primary" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-gray-50 border border-gray-200 rounded">
        {renderContent()}
      </div>
    </div>
  );
};

export default AllDetails;

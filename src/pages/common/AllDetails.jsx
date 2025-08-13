import React, { useState, useContext, createContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../axios/axiosPublic";
import DivComDetails from "../divCom/cases/DivComOrders";
import AcLandDetails from "../acLand/AcLandDetails";
import { AuthContext } from "../../provider/AuthProvider";
import AdcDetails from "../adc/AdcDetails";
import NagorikDetails from "../nagorik/nagorikDetails";
const AllDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // console.log(user.role);
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
      allTabs.push({ key: "nagorik", label: "Nagorik" });
    }

    if (caseData?.divComReview) {
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
  // console.log(dynamicTabs);
  const [activeTab, setActiveTab] = useState(dynamicTabs[0]?.key || "nagorik");

  const renderContent = () => {
    switch (activeTab) {
      case "divCom":
        return <DivComDetails id={caseData._id} />;
      case "adc":
        return <AdcDetails id={caseData._id} role="adc" refetch={refetch} />;
      case "acLand":
        return (
          <AcLandDetails id={caseData._id} role="acLand" refetch={refetch} />
        );
      case "nagorik":
        return (
          <NagorikDetails caseData={caseData} role="lawyer" refetch={refetch} />
        );
      default:
        return <p>Invalid tab selected.</p>;
    }
  };

  return (
    <div className="bg-base-100 shadow mx-auto px-4 py-6 rounded max-w-5xl">
      <h2 className="flex items-center mb-4 font-bold text-xl">
        <button
          onClick={() => navigate(-1)} // -1 means go back one page
          className="btn btn-ghost"
        >
          <ArrowLeft />
        </button>{" "}
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

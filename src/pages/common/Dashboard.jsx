import { useContext, useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../provider/AuthProvider";
import axiosPublic from "../../axios/axiosPublic";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCases: 0,
    approvedCases: 0,
    pendingCases: 0,
    totalParties: 0,
    messagesCount: 0,
    responsesCount: 0,
  });
  const [searchText, setSearchText] = useState("");

  const { data: caseData = [], isLoading } = useQuery({
    queryKey: ["casesDashboard", user?._id],
    queryFn: async () => {
      if (!user) return [];
      const params = {};
      switch (user.role) {
        case "acLand":
          params.role = "acLand";
          params.officeName = user.officeName?.en;
          params.district = user.district?.en;
          break;
        case "adc":
          params.role = "adc";
          params.officeName = user.officeName?.en;
          params.district = user.district?.en;
          break;
        case "divCom":
         
          break;
        case "nagorik":
          params.userId = user._id;
          break;
        default:
          break;
      }
      const res = await axiosPublic.get("/cases", { params });
      return res.data;
    },
    enabled: !!user,
  });

  // Filter by search text
  const filteredCases = caseData.filter((cas) => {
    const badiNames = cas.nagorikSubmission?.badi?.map((b) => b.name).join(" ") || "";
    const bibadiNames = cas.nagorikSubmission?.bibadi?.map((b) => b.name).join(" ") || "";
    const trackingNo = cas.trackingNo?.toString() || "";
    const yearMatch = cas.nagorikSubmission?.aclandMamlaInfo?.map((info) => info.year).join(" ") || "";
    return (
      badiNames.toLowerCase().includes(searchText.toLowerCase()) ||
      bibadiNames.toLowerCase().includes(searchText.toLowerCase()) ||
      trackingNo.toLowerCase().includes(searchText.toLowerCase()) ||
      yearMatch.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  useEffect(() => {
    if (!caseData || caseData.length === 0) return;

    const totalCases = caseData.length;
    const approvedCases = caseData.filter((c) => c.isApproved).length;
    const pendingCases = totalCases - approvedCases;

    const totalParties = caseData.reduce((acc, c) => {
      const badiCount = c.nagorikSubmission?.badi?.length || 0;
      const bibadiCount = c.nagorikSubmission?.bibadi?.length || 0;
      return acc + badiCount + bibadiCount;
    }, 0);

    const messagesCount = caseData.reduce(
      (acc, c) => acc + (c.messagesToOffices?.length || 0),
      0
    );

    const responsesCount = caseData.reduce(
      (acc, c) => acc + (c.responsesFromOffices?.length || 0),
      0
    );

    setStats({
      totalCases,
      approvedCases,
      pendingCases,
      totalParties,
      messagesCount,
      responsesCount,
    });
  }, [caseData]);

  // Role-wise activity
  const roleActivity = {
    labels: ["acLand", "adc", "divCom", "nagorik", "nagorik"],
    datasets: [
      {
        label: "Messages Sent",
        data: [
          caseData.filter((c) => c.messagesToOffices?.some((m) => m.sentTo.role === "acLand")).length,
          caseData.filter((c) => c.messagesToOffices?.some((m) => m.sentTo.role === "adc")).length,
          caseData.filter((c) => c.messagesToOffices?.some((m) => m.sentTo.role === "divCom")).length,
          caseData.filter((c) => c.messagesToOffices?.some((m) => m.sentTo.role === "nagorik")).length,
          caseData.filter((c) => c.messagesToOffices?.some((m) => m.sentTo.role === "nagorik")).length,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Responses Received",
        data: [
          caseData.filter((c) => c.responsesFromOffices?.some((r) => r.role === "acLand")).length,
          caseData.filter((c) => c.responsesFromOffices?.some((r) => r.role === "adc")).length,
          caseData.filter((c) => c.responsesFromOffices?.some((r) => r.role === "divCom")).length,
          caseData.filter((c) => c.responsesFromOffices?.some((r) => r.role === "nagorik")).length,
          caseData.filter((c) => c.responsesFromOffices?.some((r) => r.role === "nagorik")).length,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Cases per year for line chart
  const yearsMap = {};
  caseData.forEach((c) => {
    c.nagorikSubmission?.aclandMamlaInfo?.forEach((info) => {
      yearsMap[info.year] = (yearsMap[info.year] || 0) + 1;
    });
    c.nagorikSubmission?.adcMamlaInfo?.forEach((info) => {
      yearsMap[info.year] = (yearsMap[info.year] || 0) + 1;
    });
  });
  const years = Object.keys(yearsMap).sort();
  const casesPerYear = {
    labels: years,
    datasets: [
      {
        label: "Cases per Year",
        data: years.map((y) => yearsMap[y]),
        borderColor: "rgba(255, 99, 132, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by badi, bibadi, year, tracking no..."
        className="border p-2 w-full rounded"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-4 bg-white shadow rounded">
            <h2 className="text-lg capitalize">{key.replace(/([A-Z])/g, " $1")}</h2>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Role activity */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Role-wise Activity</h2>
          <Bar data={roleActivity} />
        </div>

        {/* Cases per year */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Cases per Year</h2>
          <Line data={casesPerYear} />
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import axiosPublic from "../../axios/axiosPublic";
import { AuthContext } from "../../provider/AuthProvider";

const districts = [
  "চট্টগ্রাম",
  "কক্সবাজার",
  "কুমিল্লা",
  "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর",
  "ফেনী",
  "লক্ষ্মীপুর",
  "নোয়াখালী",
  "খাগড়াছড়ি",
  "রাঙ্গামাটি",
  "বান্দরবান",
];

const monthNames = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const toBanglaNumber = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num)
    .split("")
    .map((digit) => (/\d/.test(digit) ? banglaDigits[digit] : digit))
    .join("");
};

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState("");

  useEffect(() => {
    axiosPublic
      .get("/allMamla")
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setCases(res.data);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      });
  }, []);

  // District-wise count
  const districtStats = cases.reduce((acc, curr) => {
    let district = curr.district?.trim();
    if (!district || typeof district !== "string") district = "Unknown";
    acc[district] = (acc[district] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(districtStats).map(([district, count]) => ({
    district,
    সংখ্যা: Math.round(count),
  }));

  const filteredChartData = chartData.filter((item) =>
    districts.includes(item.district)
  );

  // Monthly data
  const monthlyCount = Array(12).fill(0);
  cases.forEach((item) => {
    const date = item.completionDate;
    if (date) {
      const month = dayjs(date).month();
      monthlyCount[month]++;
    }
  });

  const monthlyChartData = monthNames.map((name, index) => ({
    month: name,
    সংখ্যা: monthlyCount[index],
  }));
  if (isLoading)
    return (
      <>
        <h1 className="p-10 font-bold text-2xl">ড্যাশবোর্ডে আপনাকে স্বাগতম</h1>
        <p className="mt-10 text-center">লোড হচ্ছে...</p>;
      </>
    );
  if (isError)
    return (
      <p className="mt-10 text-red-500 text-center">
        ত্রুটি: {isError.message}
      </p>
    );
  return (
    <div className="mb-10 px-4 max-w-[100vw] overflow-x-hidden text-center">
      <h1 className="p-10 font-bold text-2xl">ড্যাশবোর্ডে আপনাকে স্বাগতম</h1>

      {/* District-wise Chart */}
      <div className="bg-gray-50 shadow-sm mb-6 p-4 rounded">
        <h2 className="mb-4 font-semibold text-xl">জেলা ভিত্তিক মামলার তথ্য</h2>
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              width: `${filteredChartData.length * 80}px`,
              minWidth: "600px",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="district"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis
                  allowDecimals={false}
                  tickFormatter={(v) => v.toLocaleString("bn-BD")}
                />
                <Tooltip formatter={(v) => toBanglaNumber(v)} />
                <Legend />
                <Bar dataKey="সংখ্যা" fill="#8884d8" />
                <Line type="monotone" dataKey="সংখ্যা" stroke="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-gray-50 shadow-sm p-4 rounded-md">
        <h2 className="mb-3 font-semibold text-lg">
          মাস ভিত্তিক মামলার নিষ্পত্তির সংখ্যা
        </h2>
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              width: `${monthlyChartData.length * 80}px`,
              minWidth: "600px",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis
                  allowDecimals={false}
                  tickFormatter={(value) => value.toLocaleString("bn-BD")}
                />
                <Tooltip
                  formatter={(value) => toBanglaNumber(value)}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Line type="monotone" dataKey="সংখ্যা" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

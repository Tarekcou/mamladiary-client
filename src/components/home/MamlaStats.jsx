import React, { useEffect, useState } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { CheckCircle, CalendarCheck, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const MamlaStats = () => {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mamlaCount, setMamlaCount] = useState("-");
  const [yearlyMamlaCount, setYearlyMamlaCount] = useState("-");

  const localDate = new Date();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const thisMonth = `${month}-${year}`;

  useEffect(() => {
    axiosPublic
      .get("/allMamla")
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setCases(res.data);
        const regex = /নিষ্পত্তি/; // can be case-insensitive: /অ্যাকাউন্ট/i

        axiosPublic.get("/report").then((res) => {
          setLoading(false);
          setMamlaCount(res.data.length);
        });
        axiosPublic
          .get(`/report`, {
            params: { year },
          })
          .then((res) => {
            setYearlyMamlaCount(res.data.length);
          });
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-sm mx-auto md:p-1 h-full"
    >
      <div className="bg-blue-100 shadow rounded-none w-full stats stats-vertical lg:stats-horizontal">
        <div className="flex-1 stat">
          <div className="text-secondary stat-figure">
            <Briefcase className="stroke-current w-8 h-8" />
          </div>
          <div className="stat-title">মোট চলমান মামলা</div>
          <div className="text-xl md:text-3xl stat-value">
            {cases.length == 0
              ? "-"
              : cases.length.toLocaleString("bn-BD") + "টি"}
          </div>
          <div className="stat-desc">বর্তমানে বিচারাধীন মামলার সংখ্যা</div>
        </div>

        <div className="flex-1 stat">
          <div className="text-secondary stat-figure">
            <CheckCircle className="stroke-current w-8 h-8 text-green-600" />
          </div>
          <div className="stat-title">মোট নিষ্পন্ন মামলা</div>
          <div className="text-xl md:text-3xl stat-value">
            {mamlaCount.toLocaleString("bn-BD")}
          </div>
          <div className="stat-desc">সকল নিষ্পন্ন মামলার মোট সংখ্যা</div>
        </div>

        <div className="flex-1 stat">
          <div className="text-secondary stat-figure">
            <CalendarCheck className="stroke-current w-8 h-8 text-blue-600" />
          </div>
          <div className="stat-title">
            {year.toLocaleString("bn-BD")} সালে মোট নিষ্পন্ন মামলার সংখ্যা
          </div>
          <div className="text-xl md:text-3xl stat-value">
            {yearlyMamlaCount.toLocaleString("bn-BD")}
          </div>
          <div className="stat-desc">
            {year.toLocaleString("bn-BD")} সালের বার্ষিক নিষ্পত্তির হিসাব
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MamlaStats;

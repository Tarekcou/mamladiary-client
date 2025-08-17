import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosPublic from "../../../axios/axiosPublic";
import { toast } from "sonner";

const CauseListDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get today in YYYY-MM-DD format
  const localDate = new Date();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  });
  console.log(today);
  useEffect(() => {
    const fetchTodayCases = async () => {
      try {
        const res = await axiosPublic.get(`/allMamla/${today}`);
        console.log(res.data);
        // Filter cases where case.date matches today's date
        setCases(res.data); // update your state with the fetched data
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayCases();
  }, [today]);

  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = async () => {
    if (!selectedDate) return toast.info("তারিখ নির্বাচন করুন");

    try {
      const res = await axiosPublic.get(`/allMamla/${selectedDate}`);
      setCases(res.data); // update your state with the fetched data
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-bold text-2xl">
          আজকের মামলা কার্যতালিকা - {today}
        </h1>
        <div className="flex items-center gap-2">
          <label>
            <input
              type="date"
              name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 px-5 input-bordered w-full input"
            />
          </label>
          <button
            onClick={handleDateChange}
            className="bg-blue-900 border-none text-white btn btn-success"
          >
            খুঁজুন
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">লোড হচ্ছে...</div>
      ) : cases.length === 0 ? (
        <div className="text-red-500 text-center">
          আজকের জন্য কোন মামলা পাওয়া যায়নি।
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>SL</th>
                <th>মামলার নাম</th>
                <th>মামলা নং</th>
                {/* <th>পূর্ববর্তী তারিখ</th> */}
                <th>মামলার বছর </th>
                <th>সর্বশেষ অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.mamlaName}</td>
                  <td>{item.mamlaNo}</td>
                  {/* <td>{item.previousDate}</td> */}
                  <td>{item.year}</td>
                  <td>{item.completedMamla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CauseListDashboard;

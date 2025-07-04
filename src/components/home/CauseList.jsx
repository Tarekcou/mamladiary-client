import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosPublic from "../../axios/axiosPublic";
import ListLottie from "../lottie/ListLottie";

const CauseList = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get today in YYYY-MM-DD format
  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchTodayCases = async () => {
      try {
        const res = await axiosPublic.get(`/allMamla/${today}`); // Replace with your actual
        setCases(res.data); // update your state with the fetched data
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayCases();
  }, [today]);
  function toBanglaNumber(num) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => banglaDigits[parseInt(digit)] || digit)
      .join("");
  }
  return (
    <div className="p-6">
      <div className="flex justify-start items-center gap-4">
        <h1 className="mb-4 font-bold text-xl md:text-2xl ">
          আজকের মামলা কার্যতালিকা - {toBanglaNumber(today)}
        </h1>
        <ListLottie />
      </div>

      {loading ? (
        <div className="mt-10 text-center">লোড হচ্ছে...</div>
      ) : cases.length === 0 ? (
        <div className="mt-16 h-full text-red-500 text-center">
          আজ কোনো মামলা চলমান নেই।
        </div>
      ) : (
        <div className="max-w-screen overflow-x-auto">
          <table className="table table-pin-cols table-pin-rows table-xs">
            <thead className="bg-base-200">
              <tr>
                <th>ক্রমিক</th>
                <th>মামলার নাম</th>
                <th>মামলা নং</th>
                {/* <th>পূর্ববর্তী তারিখ</th> */}
                <th>মামলার সাল </th>
                <th>সর্বশেষ অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item, index) => (
                <tr key={item._id}>
                  <td>{toBanglaNumber(index + 1)}</td>
                  <td>{item.mamlaName}</td>
                  <td>{toBanglaNumber(item.mamlaNo)}</td>
                  {/* <td>{item.previousDate}</td> */}
                  <td>{toBanglaNumber(item.year)}</td>
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

export default CauseList;

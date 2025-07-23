import React, { useEffect, useState } from "react";
import axiosPublic from "../../../axios/axiosPublic";
import { Toaster, toast } from "sonner";
import { mamlaNames } from "../../../data/mamlaNames";
import { districts } from "../../../data/districts";


const AdcMamlaEditForm = ({ editedMamla: mamla }) => {
  const [formData, setFormData] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: "",
    district: "",
    nextDate: "",
    completedMamla: "",
    completionDate: "",
  });

  const [loading, setLoading] = useState(false);

  // Populate form with existing mamla
  useEffect(() => {
    if (mamla) {
      setFormData({
        mamlaName: mamla.mamlaName || "",
        mamlaNo: mamla.mamlaNo || "",
        year: mamla.year || "",
        district: mamla.district || "",
        nextDate: mamla.nextDate || "",
        completedMamla: mamla.completedMamla || "",
        completionDate: mamla.completionDate || "",
      });
    }
  }, [mamla]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axiosPublic.patch(`/adcMamla/${mamla._id}`, formData);
      toast.success("আপলোড সফল হয়েছে!");
      // console.log("Response data:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.warning("আপলোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-gray-100 shadow-md mx-auto p-6">
        <h2 className="bg-[#004080]/30 mb-4 py-2 font-bold text-xl text-center">
          এডিসি মামলা আপডেট ফর্ম
        </h2>

        <div className="gap-4 grid grid-cols-2 text-sm">
          {/* Mamla Name */}
          <label>
            মামলার নাম:
            <select
              name="mamlaName"
              className="mt-1 w-full select-bordered select"
              value={formData.mamlaName}
              onChange={handleChange}
            >
              <option value="">মামলার নাম নির্বাচন করুন </option>
              {mamlaNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          {/* Mamla Number */}
          <label>
            মামলার নম্বর:
            <input
              type="text"
              name="mamlaNo"
              value={formData.mamlaNo}
              onChange={handleChange}
              className="mt-1 input-bordered w-full input"
            />
          </label>

          {/* Year */}
          <label>
            সাল:
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="mt-1 w-full select-bordered select"
            >
              <option value="">সাল নির্বাচন করুন </option>
              {Array.from({ length: 50 }, (_, i) => {
                const year = 2000 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </label>

          {/* District */}
          <label>
            জেলা:
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="mt-1 w-full select-bordered select"
            >
              <option value="">জেলা নির্বাচন করুন </option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-[#004080] px-6 text-white btn"
            disabled={loading}
          >
            {loading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default AdcMamlaEditForm;

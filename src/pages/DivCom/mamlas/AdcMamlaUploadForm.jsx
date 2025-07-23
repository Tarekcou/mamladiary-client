import { useState } from "react";
import { toast } from "sonner";
import { districts } from "../../../data/districts";
import { mamlaNames } from "../../../data/mamlaNames";
import axiosPublic from "../../../axios/axiosPublic";



export default function AdcMamlaUploadForm() {
  const [loading, setLoading] = useState(false);
  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((d) => banglaDigits[d])
      .join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const mamlaData = {
      adcMamlaName: form.mamlaName.value,
      mamlaNo: form.mamlaNo.value,
      year: form.year.value,
      district: form.district.value,
    };

    try {
      setLoading(true);
      const res = await axiosPublic.post("/adcMamla", mamlaData);
      console.log(res.data);
      toast.success("আপলোড সফল হয়েছে");
      form.reset();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.warning("আপলোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 shadow-md mx-auto p-6">
      <h2 className="bg-[#004080] mb-4 py-2 font-bold text-white text-xl text-center">
        এডিসি মামলা আপলোড ফর্ম
      </h2>

      <div className="gap-4 grid grid-cols-2 text-sm">
        {/* Mamla Name */}
        <label>
          মামলার নাম :
          <select
            name="mamlaName"
            className="mt-1 w-full select-bordered select"
          >
            <option value="">মামলার নাম নির্বাচন করুন </option>
            {mamlaNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        {/* Mamla No */}
        <label>
          মামলার নম্বর :
          <input
            type="text"
            name="mamlaNo"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Year */}
        <label>
          বছর :
          <select name="year" className="mt-1 w-full select-bordered select">
            <option value="">বছর নির্বাচন করুন </option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = 2000 + i;
              return (
                <option key={year} value={year}>
                  {toBanglaNumber(year)}
                </option>
              );
            })}
          </select>
        </label>

        {/* District */}
        <label>
          জেলা :
          <select
            name="district"
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
          {loading ? "আপলোডিং..." : "আপলোড মামলা"}
        </button>
      </div>
    </form>
  );
}

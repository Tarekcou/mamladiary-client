import React, { useContext, useEffect, useState } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { toast } from "sonner";
import { AuthContext } from "../../provider/AuthProvider";
const mamlaNames = [
  "সার্টিফিকেট আপিল",
  "নামজারি আপিল",
  "নামজারি রিভিশন",
  "পিটিশন",
  "বিবিধ সংশোধনী রিভিশন",
  "মিচ আপিল",
  "উচ্ছেদ আপিল",
  "মিচ রিভিশন",
  "নামজারি জমাভাগ আপিল",
  "নামজারি জমাখারিজ আপিল",
  "নামজারি রিভিউ আপিল",
  "নামজারি জমাভাগ রিভিশন",
  "হোল্ডিং আপিল",
  "বিবিধ আপিল",
  "সার্টিফিকেট রিভিশন",
  "ভিপি আপিল",
  "নামজরি রিভিশন",
  "নামজারি মিচ আপিল",
  "বন্দোবস্তি রিভিশন",
  "রিভিশন মিচ আপিল",
  "নামজারি জমাখারিজ রিভিশন",
  "মিচ এল আপিল",
  "নামজারি বিবিধ আপিল",
  "অবমূল্যায়ন আপিল",
  "বিবিধ রিভিশন",
  "নামজারি জমাঃ আপিল",
  "বিবিধ রেকড সংশোধনী আপিল",
  "বন্দোবস্তি আপিল",
  "নামজারি রিভিউ",
  "জমাভাগ রিভিশন",
  "নামজারি মিচ রিভিশন",
  "বিবিধ নামজারি আপিল",
  "ভি.পি আপিল",
  "বাজার ফান্ড মিচ আপিল",
  "এল এ মিচ আপিল",
  "বাজার ফান্ড বন্দোবস্ত আপিল",
  "জোত: পূনবহাল রিভিশন",
  "মিউটেশন রিভিশন",
  "মিউটেশন আপিল",
  "জমাখারিজ রিভিশন",
  "বন্দোবস্তি মামলা",
  "জলমহাল আপিল",
  "বন্দোবস্ত রিভিশন",
  "চান্দিনা পেরিফেরি মিচ রিভিশন",
  "সায়রাত আপিল",
  "এস.এ. মিচ রিভিশন",
  "নামজারি ও জমাখারিজ আপিল",
  "জমাখারিজ আপিল",
  "নামজারি আপিল রিভিশন",
  "আপিল",
  "নামজারি জমাভাগ মিচ রিভিশন",
  "নামজারি ও জমাভাগ রিভিশন",
  "বিবিধ মিচ আপিল",
  "সাটির্ফিকেট রিভিশন",
  "নামজারি রিভিউ মিচ মামলা",
  "সিভিল আপিল",
  "রিভিউ পিটিশন",
  "রিভিউ মিচ মামলা",
  "রিভিশন",
];

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
const MamlaEditForm = ({ editedMamla: mamla }) => {
  const [formData, setFormData] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: "",
    district: "",
    previousDate: "",
    nextDate: "",
    completedMamla: "",
    completionDate: "",
  });

  const [loading, setLoading] = useState(false);
  const { isLoading } = useContext(AuthContext);

  // Populate form with existing mamla
  useEffect(() => {
    if (mamla) {
      setFormData({
        mamlaName: mamla.mamlaName || "",
        mamlaNo: mamla.mamlaNo || "",
        year: mamla.year || "",
        district: mamla.district || "",
        previousDate: mamla.nextDate || "",
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

  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    const newFormData = { ...formData, createdAt: today };
    try {
      setLoading(true);
      const res = await axiosPublic.patch(`/mamla/${mamla._id}`, newFormData);
      toast.success("আপডেট সফল হয়েছে");
      setFormData({
        mamlaName: "",
        mamlaNo: "",
        year: "",
        district: "",
        previousDate: "",
        nextDate: "",
        completedMamla: "",
        completionDate: "",
      });
      console.log("Response data:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.warning("আপলোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md mx-auto p-6">
        <h2 className="bg-[#004080]/30  mb-4 py-2 font-bold text-xl text-center">
          অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব) আদালতের মামলার তথ্য আপডেট করুন
        </h2>

        <div className="gap-4 grid grid-cols-2 text-sm">
          {/* Mamla Name */}
          <label>
            Mamla Name:
            <select
              name="mamlaName"
              className="mt-1 w-full select-bordered select"
              value={formData.mamlaName}
              onChange={handleChange}
            >
              <option value="">Select Mamla Name</option>
              {mamlaNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          {/* Mamla Number */}
          <label>
            Mamla Number:
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
            Year:
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="mt-1 w-full select-bordered select"
            >
              <option value="">Select Year</option>
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
            District:
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="mt-1 w-full select-bordered select"
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          {/* Optional: nextDate */}
          <label>
            Previous Date:
            <input
              type="date"
              name="previousDate"
              value={formData.previousDate}
              readOnly
              className="mt-1 input-bordered w-full input"
            />
          </label>
          {/* Optional: nextDate */}
          <label>
            Next Date:
            <input
              type="date"
              name="nextDate"
              value={formData.nextDate}
              onChange={handleChange}
              className="mt-1 input-bordered w-full input"
            />
          </label>

          {/* Optional: completedMamla */}
          <label>
            Completed Mamla:
            <input
              type="text"
              name="completedMamla"
              value={formData.completedMamla}
              onChange={handleChange}
              className="mt-1 input-bordered w-full input"
            />
          </label>

          {/* Optional: completionDate */}
          <label>
            Completion Date:
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              className="mt-1 input-bordered w-full input"
            />
          </label>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 text-white btn btn-success bg-[#004080]"
            disabled={loading}
          >
            {isLoading ? "আপডেট হচ্ছে ..." : "আপডেট করুন"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MamlaEditForm;

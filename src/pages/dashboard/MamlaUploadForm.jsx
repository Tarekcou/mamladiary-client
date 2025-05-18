import { useState } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { toast } from "sonner";

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

export default function MamlaUploadForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const mamlaData = {
      mamlaName: form.mamlaName.value,
      mamlaNo: form.mamlaNo.value,
      year: form.year.value,
      district: form.district.value,
      nextDate: form.nextDate.value,
      completedMamla: form.completedMamla.value,
      completionDate: form.completionDate.value,
    };

    try {
      setLoading(true);
      const res = await axiosPublic.post("/mamlas", mamlaData);
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
    <form onSubmit={handleSubmit} className="bg-white shadow-md mx-auto p-6">
      <h2 className="bg-green-100 mb-4 py-2 font-bold text-xl text-center">
        Mamla Upload Form
      </h2>

      <div className="gap-4 grid grid-cols-2 text-sm">
        {/* Mamla Name */}
        <label>
          Mamla Name:
          <select
            name="mamlaName"
            className="mt-1 w-full select-bordered select"
          >
            <option value="">Select Mamla Name</option>
            {mamlaNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        {/* Mamla No */}
        <label>
          Mamla Number:
          <input
            type="text"
            name="mamlaNo"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Year */}
        <label>
          Year:
          <select name="year" className="mt-1 w-full select-bordered select">
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

        {/* Next Date */}
        <label>
          Next Date:
          <input
            type="date"
            name="nextDate"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Completed Mamla */}
        <label>
          Completed Mamla:
          <input
            type="text"
            name="completedMamla"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Completion Date */}
        <label>
          Completion Date:
          <input
            type="date"
            name="completionDate"
            className="mt-1 input-bordered w-full input"
          />
        </label>
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="px-6 btn btn-success"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Mamla"}
        </button>
      </div>
    </form>
  );
}

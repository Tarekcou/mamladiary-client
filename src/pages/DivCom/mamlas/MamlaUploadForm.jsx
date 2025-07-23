import { useState } from "react";
import axiosPublic from "../../../axios/axiosPublic";
import { toast } from "sonner";
import { X } from "lucide-react"; // For close icon, optional
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
  const [selectedYear, setSelectedYear] = useState(2025);
  const [badiInput, setBadiInput] = useState("");
  const [bibadiInput, setBibadiInput] = useState("");
  const [badiPhones, setBadiPhones] = useState([]);
  const [bibadiPhones, setBibadiPhones] = useState([]);

    const toBanglaNumber = (number) => {
      const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      return number
        .toString()
        .split("")
        .map((d) => banglaDigits[d])
        .join("");
    };
    const localDate = new Date();
    const today = `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1
    ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

  // Phone no
  const addBadiPhone = () => {
    if (badiInput && !badiPhones.includes(badiInput)) {
      setBadiPhones([...badiPhones, badiInput]);
      setBadiInput("");
    }
  };

  const addBibadiPhone = () => {
    if (bibadiInput && !bibadiPhones.includes(bibadiInput)) {
      setBibadiPhones([...bibadiPhones, bibadiInput]);
      setBibadiInput("");
    }
  };

  const removePhone = (type, number) => {
    if (type === "badi") {
      setBadiPhones(badiPhones.filter((n) => n !== number));
    } else {
      setBibadiPhones(bibadiPhones.filter((n) => n !== number));
    }
  };

  // submit handler
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
      comments: form.comments.value,
      phoneNumbers: {
        badi: badiPhones,
        bibadi: bibadiPhones,
      },
      createdAt: today,
    };

    try {
      setLoading(true);
      const res = await axiosPublic.post("/mamlas", mamlaData);
      toast.success("আপলোড সফল হয়েছে");
      setPhoneNumbers([]); // clear after submit
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
        মামলা আপলোড ফর্ম
      </h2>

      <div className="gap-4 grid grid-cols-2 text-sm">
        {/* Mamla Name */}
        <label>
          মামলার নাম:
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
          মামলা নম্বর:
          <input
            type="text"
            name="mamlaNo"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Year */}
        <label>
          বছর:
          <select
            value={selectedYear}
            name="year"
            className="mt-1 w-full select-bordered select"
          >
            <option value="">সাল নির্বাচন করুন </option>
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
            <option value="">জেলা নির্বাচন করুণ </option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        {/* Next Date */}
        <label>
          পরবর্তী তারিখ:
          <input
            type="date"
            name="nextDate"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Completed Mamla */}
        <label>
          সর্বশেষ অবস্থা:
          <input
            type="text"
            name="completedMamla"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Completion Date */}
        <label>
          নিষ্পত্তির তারিখ:
          <input
            type="date"
            name="completionDate"
            className="mt-1 input-bordered w-full input"
          />
        </label>
        {/* Completion Date */}
        <label>
          মন্তব্য
          <input
            type="text"
            name="comments"
            className="mt-1 input-bordered w-full input"
          />
        </label>
        {/* phone no */}
        {/* ফোন নম্বর (বাদি) */}
        <div className="col-span-2 mt-4">
          <label className="block mb-1">ফোন নম্বর (বাদি):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={badiInput}
              onChange={(e) => setBadiInput(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="input-bordered w-full input"
            />
            <button
              type="button"
              onClick={addBadiPhone}
              className="bg-[#004080] text-white btn"
            >
              যুক্ত করুন
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {badiPhones.map((num) => (
              <div
                key={num}
                className="flex items-center gap-2 px-3 py-4 text-white text-sm badge badge-success"
              >
                {num}
                <button type="button" onClick={() => removePhone("badi", num)}>
                  <X className="cursor-pointer" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ফোন নম্বর (বিবাদি) */}
        <div className="col-span-2 mt-4">
          <label className="block mb-1">ফোন নম্বর (বিবাদি):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={bibadiInput}
              onChange={(e) => setBibadiInput(e.target.value)}
              placeholder="01xxxxxxxxx"
              className="input-bordered w-full input"
            />
            <button
              type="button"
              onClick={addBibadiPhone}
              className="bg-[#004080] text-white btn"
            >
              যুক্ত করুন
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {bibadiPhones.map((num) => (
              <div
                key={num}
                className="flex items-center gap-2 px-3 py-4 text-white text-sm badge badge-error"
              >
                {num}
                <button
                  type="button"
                  onClick={() => removePhone("bibadi", num)}
                >
                  <X className="cursor-pointer" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="bg-[#004080] px-6 text-white btn"
          disabled={loading}
        >
          {loading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
        </button>
      </div>
    </form>
  );
}

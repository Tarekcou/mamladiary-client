import React, { useContext, useEffect, useState } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { toast } from "sonner";
import { AuthContext } from "../../provider/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaPlus, FaTimes } from "react-icons/fa";
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
const mamlaStatus = [
  "মামলা প্রত্যাহার",
  "মঞ্জুর",
  "না-মঞ্জুর",
  "প্রত্যাহার",
  "সোলেনামামূলে নিষ্পত্তি",
  "এসিল্যান্ডে প্রেরণ",
  "খারিজ",
  "স্থানীয় সরকার শাখায় প্রেরণ",
  "নথিজাত",
  "আপোষে নিষ্পত্তি",
  "রিমান্ডে প্রেরণ",
  "আংশিক মঞ্জুর",
];
const MamlaEditForm = ({ editedMamla: mamla, closeModal }) => {
  const [formData, setFormData] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: "",
    district: "",
    previousDate: "",
    nextDate: "",
    completedMamla: "",
    completionDate: "",
    phoneNumbers: "",
  });

  const [loading, setLoading] = useState(false);
  const { isLoading } = useContext(AuthContext);
  const [badiPhones, setBadiPhones] = useState([""]);
  const [bibadiPhones, setBibadiPhones] = useState([""]);
  const [newBadiNumber, setNewBadiNumber] = useState("");
  const [newBibadiNumber, setNewBibadiNumber] = useState("");

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

      setBadiPhones(mamla.phoneNumbers?.badi || [""]);
      setBibadiPhones(mamla.phoneNumbers?.bibadi || [""]);
      setSelected(mamla.completedMamla || "");
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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosPublic.patch(`/mamla/${mamla._id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("আপডেট সফল হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["allMamla"] });
      setFormData({
        mamlaName: "",
        mamlaNo: "",
        year: "",
        district: "",
        previousDate: "",
        nextDate: "",
        completedMamla: "",
        completionDate: "",
        phoneNumbers: "",
      });
      closeModal?.(); // ✅ Close modal if function is passed
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("আপডেট ব্যর্থ হয়েছে");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      phoneNumbers: {
        badi: badiPhones,
        bibadi: bibadiPhones,
      },
      createdAt: today,
    };
    mutation.mutate(updatedData);
  };

  const [options, setOptions] = useState([...new Set(mamlaStatus)]);
  const [selected, setSelected] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddCustom = () => {
    const custom = customInput.trim();
    if (custom && !options.includes(custom)) {
      setOptions([...options, custom]);
    }
    setSelected(custom);
    setFormData((prev) => ({ ...prev, completedMamla: custom }));
    setCustomInput("");
    setShowInput(false);
  };

  const handleCompletedMamlaChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    setFormData((prev) => ({ ...prev, completedMamla: value }));
  };

  const handleAddNumber = () => {
    if (newNumber.trim() !== "") {
      setPhoneNumbers([...phoneNumbers, newNumber.trim()]);
      setNewNumber("");
    }
  };

  const handleDeleteNumber = (index) => {
    const updated = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updated.length ? updated : [""]);
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 shadow-md mx-auto p-6"
      >
        <h2 className="bg-[#004080]/30 mb-4 py-2 font-bold text-xl text-center">
          অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব) আদালতের মামলার তথ্য আপডেট করুন
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
            মামলা নম্বর:
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
            সাল :
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
            জেলা :
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

          {/* Optional: nextDate */}
          <label>
            পূর্ববর্তী তারিখ:
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
            পরবর্তী তারিখ:
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
            সর্বশেষ অবস্থা:
            <div className="flex items-center space-x-2">
              <select
                value={selected}
                onChange={handleCompletedMamlaChange}
                className="border input-bordered w-full input select"
              >
                <option value="">মামলার অবস্থা নির্বাচন করুন</option>
                {options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="bg-gray-200 rounded-full btn"
                onClick={() => setShowInput(true)}
              >
                <FaPlus />
              </button>
            </div>
            {showInput && (
              <div className="flex space-x-2 mt-2">
                <input
                  type="text"
                  className="input-bordered w-full input input-sm"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="নতুন অবস্থা লিখুন"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={handleAddCustom}
                >
                  যুক্ত করুন
                </button>
              </div>
            )}
          </label>

          {/* Optional: completionDate */}
          <label>
            নিষ্পত্তির তারিখ:
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              className="mt-1 input-bordered w-full input"
            />
          </label>

          {/* update phone */}
          {/* বাদীর ফোন নম্বর */}
          <div className="col-span-2 mt-4">
            <label className="block mb-2 font-medium">
              বাদীর ফোন নম্বরসমূহ:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {badiPhones.map((number, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-blue-800"
                >
                  <span>{number}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = badiPhones.filter((_, i) => i !== index);
                      setBadiPhones(updated.length ? updated : [""]);
                    }}
                  >
                    <FaTimes className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newBadiNumber}
                onChange={(e) => setNewBadiNumber(e.target.value)}
                placeholder="নতুন বাদীর ফোন নম্বর লিখুন"
                className="input-bordered w-full input"
              />
              <button
                type="button"
                onClick={() => {
                  if (newBadiNumber.trim() !== "") {
                    setBadiPhones([...badiPhones, newBadiNumber.trim()]);
                    setNewBadiNumber("");
                  }
                }}
                className="btn-outline btn btn-sm"
              >
                <FaPlus /> যোগ করুন
              </button>
            </div>
          </div>

          {/* বিবাদীর ফোন নম্বর */}
          <div className="col-span-2 mt-4">
            <label className="block mb-2 font-medium">
              বিবাদীর ফোন নম্বরসমূহ:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {bibadiPhones.map((number, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-green-800"
                >
                  <span>{number}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = bibadiPhones.filter(
                        (_, i) => i !== index
                      );
                      setBibadiPhones(updated.length ? updated : [""]);
                    }}
                  >
                    <FaTimes className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newBibadiNumber}
                onChange={(e) => setNewBibadiNumber(e.target.value)}
                placeholder="নতুন বিবাদীর ফোন নম্বর লিখুন"
                className="input-bordered w-full input"
              />
              <button
                type="button"
                onClick={() => {
                  if (newBibadiNumber.trim() !== "") {
                    setBibadiPhones([...bibadiPhones, newBibadiNumber.trim()]);
                    setNewBibadiNumber("");
                  }
                }}
                className="btn-outline btn btn-sm"
              >
                <FaPlus /> যোগ করুন
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-[#004080] px-6 text-white btn btn-success"
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

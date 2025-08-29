import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { districts } from "../../../data/districts";
import { mamlaNames } from "../../../data/mamlaNames";
import axiosPublic from "../../../axios/axiosPublic";
import { Plus, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router";

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
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const isAdcPage = location.pathname.includes("allAdcMamla");
  const [formData, setFormData] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: "",
    district: "",
    previousDate: "",
    nextDate: "",
    lastCondition: "",
    completionDate: "",
    comments: "",
  });

  const [badiInput, setBadiInput] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [bibadiInput, setBibadiInput] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [badiList, setBadiList] = useState([]);
  const [bibadiList, setBibadiList] = useState([]);

  const [options, setOptions] = useState([...new Set(mamlaStatus)]);

  const [customInput, setCustomInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const queryClient = useQueryClient();

  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

  // Populate with existing data
  useEffect(() => {
    if (mamla) {
      setFormData({
        mamlaName: mamla.mamlaName || "",
        mamlaNo: mamla.mamlaNo || "",
        year: mamla.year || "",
        district: mamla.district?.en || "",
        previousDate: mamla.previousDate || today,
        nextDate: mamla.nextDate || "",
        lastCondition: mamla.lastCondition || "",
        completionDate: mamla.completionDate || "",
        comments: mamla.comments || "",
      });

      setBadiList(mamla.badi || []);
      setBibadiList(mamla.bibadi || []);

      // ✅ Ensure custom lastCondition exists in dropdown options
      if (mamla.lastCondition && !options.includes(mamla.lastCondition)) {
        setOptions((prev) => [...prev, mamla.lastCondition]);
      }
    }
  }, [mamla]);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add Badi / Bibadi
  const addBadi = () => {
    const isValidPhone = (phone) => /^01[0-9]{9}$/.test(phone);

    if (!badiInput.name || !badiInput.phone) {
      toast.warning("নাম এবং ফোন নম্বর দিতে হবে");
      return;
    }

    if (!isValidPhone(badiInput.phone)) {
      toast.warning("সঠিক ১১ সংখ্যার ফোন নম্বর দিন");
      return;
    }

    if (badiList.some((p) => p.phone === badiInput.phone)) {
      toast.warning("এই ফোন নম্বরটি ইতোমধ্যে যুক্ত হয়েছে");
      return;
    }

    setBadiList([...badiList, badiInput]);
    setBadiInput({ name: "", phone: "", address: "" });
  };
  const addBibadi = () => {
    const isValidPhone = (phone) => /^01[0-9]{9}$/.test(phone);

    if (!bibadiInput.name || !bibadiInput.phone) {
      toast.warning("নাম এবং ফোন নম্বর দিতে হবে");
      return;
    }

    if (!isValidPhone(bibadiInput.phone)) {
      toast.warning("সঠিক ১১ সংখ্যার ফোন নম্বর দিন");
      return;
    }

    if (bibadiList.some((p) => p.phone === bibadiInput.phone)) {
      toast.warning("এই ফোন নম্বরটি ইতোমধ্যে যুক্ত হয়েছে");
      return;
    }

    setBibadiList([...bibadiList, bibadiInput]);
    setBibadiInput({ name: "", phone: "", address: "" });
  };
  //

  const removeParty = (type, phone) => {
    if (type === "badi") setBadiList(badiList.filter((p) => p.phone !== phone));
    else setBibadiList(bibadiList.filter((p) => p.phone !== phone));
  };

  // Add custom status
  const handleAddCustom = () => {
    if (customInput.trim() !== "") {
      setOptions((prev) => [...new Set([...prev, customInput])]);
      setFormData((prev) => ({ ...prev, lastCondition: customInput }));
      setCustomInput("");
      setShowInput(false);
    }
  };

  // Submit handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    let updatedData = {};
    if (isAdcPage)
      updatedData = {
        mamlaName: formData.mamlaName,
        mamlaNo: formData.mamlaNo,
        year: formData.year,
        district: districts.find((d) => d.en === formData.district),
        updatedAt: today,
      };
    else {
      updatedData = {
        ...formData,
        district: districts.find((d) => d.en === formData.district),
        badi: badiList,
        bibadi: bibadiList,
        updatedAt: today,
      };
    }
    // console.log(updatedData);
    setLoading(true);

    try {
      let res;
      if (isAdcPage)
        res = await axiosPublic.patch(`/adcMamla/${mamla._id}`, updatedData);
      else res = await axiosPublic.patch(`/mamla/${mamla._id}`, updatedData);
      if (res.status === 200) {
        toast.success("আপডেট সফল হয়েছে");
        queryClient.invalidateQueries({ queryKey: ["allMamla"] });
        closeModal?.();
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("আপডেট ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="bg-gray-100 shadow-md mx-auto p-6">
      <h2 className="bg-[#004080]/30 mb-4 py-2 font-bold text-xl text-center">
        মামলার তথ্য আপডেট করুন
      </h2>

      <div className="gap-4 grid grid-cols-2 text-sm">
        {/* Mamla Name */}
        <label>
          মামলার নাম:
          <select
            name="mamlaName"
            value={formData.mamlaName}
            onChange={handleChange}
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
          সাল:
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="mt-1 input-bordered w-full input"
          />
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
            <option value="">জেলা নির্বাচন করুন</option>
            {districts.map((d) => (
              <option key={d.en} value={d.en}>
                {d.bn}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!isAdcPage && (
        <>
          <div className="gap-4 grid grid-cols-2 mt-4 text-sm">
            {/* Previous Date (readonly) */}
            <label>
              পূর্ববর্তী তারিখ:
              <input
                type="date"
                name="previousDate"
                value={formData.previousDate}
                className="mt-1 input-bordered w-full input"
              />
            </label>

            {/* Next Date */}
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
            {/* Last Condition */}
            {/* Last Condition */}
            <label className="">
              সর্বশেষ অবস্থা:
              <div className="flex items-center space-x-2">
                <select
                  value={formData.lastCondition}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastCondition: e.target.value,
                    }))
                  }
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
                  <Plus />
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

            {/* Completion Date */}
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
          </div>

          {/* Badi */}
          <div className="col-span-2 mt-4">
            <label className="block mb-1 font-semibold">বাদির তথ্য:</label>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-4 w-full">
                <input
                  type="text"
                  placeholder="নাম"
                  className="input-bordered w-full input"
                  value={badiInput.name}
                  onChange={(e) =>
                    setBadiInput({ ...badiInput, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="ফোন"
                  className="input-bordered w-full input"
                  value={badiInput.phone}
                  onChange={(e) =>
                    setBadiInput({ ...badiInput, phone: e.target.value })
                  }
                />
              </div>
              <input
                type="text"
                placeholder="ঠিকানা"
                className="input-bordered w-full input"
                value={badiInput.address}
                onChange={(e) =>
                  setBadiInput({ ...badiInput, address: e.target.value })
                }
              />
              <button
                type="button"
                onClick={addBadi}
                className="bg-[#004080] text-white btn"
              >
                <Plus /> যুক্ত করুন
              </button>
            </div>
            <div className="flex flex-wrap gap-2 my-2">
              {badiList.map((p) => (
                <div
                  key={p.phone}
                  className="mx-1 p-3 text-white badge badge-success"
                >
                  {p.name} | {p.phone} | {p.address}
                  <X
                    className="cursor-pointer"
                    size={14}
                    onClick={() => removeParty("badi", p.phone)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bibadi */}
          <div className="col-span-2 mt-6">
            <label className="block mb-1 font-semibold">বিবাদির তথ্য:</label>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-4 w-full">
                <input
                  type="text"
                  placeholder="নাম"
                  className="input-bordered w-full input"
                  value={bibadiInput.name}
                  onChange={(e) =>
                    setBibadiInput({ ...bibadiInput, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="ফোন"
                  className="input-bordered w-full input"
                  value={bibadiInput.phone}
                  onChange={(e) =>
                    setBibadiInput({ ...bibadiInput, phone: e.target.value })
                  }
                />
              </div>
              <input
                type="text"
                placeholder="ঠিকানা"
                className="input-bordered w-full input"
                value={bibadiInput.address}
                onChange={(e) =>
                  setBibadiInput({ ...bibadiInput, address: e.target.value })
                }
              />
              <button
                type="button"
                onClick={addBibadi}
                className="bg-[#004080] text-white btn"
              >
                <Plus /> যুক্ত করুন
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {bibadiList.map((p) => (
                <div
                  key={p.phone}
                  className="gap-2 p-3 text-white badge badge-error"
                >
                  {p.name} | {p.phone} | {p.address}
                  <X
                    className="cursor-pointer"
                    size={14}
                    onClick={() => removeParty("bibadi", p.phone)}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Comments */}
      <label className="block mt-4">
        মন্তব্য:
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          rows={4}
          className="mt-1 input-bordered w-full textarea input"
        ></textarea>
      </label>

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
  );
};

export default MamlaEditForm;

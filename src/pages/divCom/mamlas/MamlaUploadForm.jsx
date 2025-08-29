import { useState } from "react";
import axiosPublic from "../../../axios/axiosPublic";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { mamlaNames } from "../../../data/mamlaNames";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import { districts } from "../../../data/districts";
import { useLocation, useNavigate } from "react-router";

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

export default function MamlaUploadForm() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdcPage = location.pathname.includes("adcMamlaUpload");

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

  // Last Condition states
  const [options, setOptions] = useState([...new Set(mamlaStatus)]);
  const [selectedLastCondition, setSelectedLastCondition] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
  const [selectedPreviousDate, setSelectedPreviousDate] = useState(today);

  // Add badi
  const addBadi = () => {
    const isValidPhone = (phone) => /^01[0-9]{9}$/.test(phone);
    if (!badiInput.name || !badiInput.phone)
      return toast.warning("নাম এবং ফোন নম্বর দিতে হবে");
    if (!isValidPhone(badiInput.phone))
      return toast.warning("সঠিক ১১ সংখ্যার ফোন নম্বর দিন");
    if (badiList.some((p) => p.phone === badiInput.phone))
      return toast.warning("এই ফোন নম্বরটি ইতোমধ্যে যুক্ত হয়েছে");

    setBadiList([...badiList, badiInput]);
    setBadiInput({ name: "", phone: "", address: "" });
  };

  // Add bibadi
  const addBibadi = () => {
    const isValidPhone = (phone) => /^01[0-9]{9}$/.test(phone);
    if (!bibadiInput.name || !bibadiInput.phone)
      return toast.warning("নাম এবং ফোন নম্বর দিতে হবে");
    if (!isValidPhone(bibadiInput.phone))
      return toast.warning("সঠিক ১১ সংখ্যার ফোন নম্বর দিন");
    if (bibadiList.some((p) => p.phone === bibadiInput.phone))
      return toast.warning("এই ফোন নম্বরটি ইতোমধ্যে যুক্ত হয়েছে");

    setBibadiList([...bibadiList, bibadiInput]);
    setBibadiInput({ name: "", phone: "", address: "" });
  };

  const removeParty = (type, phone) => {
    if (type === "badi") setBadiList(badiList.filter((p) => p.phone !== phone));
    else setBibadiList(bibadiList.filter((p) => p.phone !== phone));
  };

  // Add custom status
  const handleAddCustom = () => {
    const custom = customInput.trim();
    if (custom && !options.includes(custom)) {
      setOptions([...options, custom]);
    }
    setSelectedLastCondition(custom);
    setCustomInput("");
    setShowInput(false);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const mamlaName = form.elements.mamlaName?.value;
    const mamlaNo = form.elements.mamlaNo?.value;
    const year = form.elements.year?.value;
    const districtEn = form.elements.district?.value;
    const nextDate = form.elements.nextDate?.value;
    const completionDate = form.elements.completionDate?.value;
    const comments = form.elements.comments?.value;

    if (!mamlaName) return toast.warning("মামলার নাম অবশ্যই নির্বাচন করুন");
    if (!mamlaNo) return toast.warning("মামলা নম্বর দিন");
    if (!year) return toast.warning("সাল নির্বাচন করুন");
    if (!districtEn) return toast.warning("জেলা নির্বাচন করুন");

    const selectedDistrictObj = districts.find((d) => d.en === districtEn);
    let mamlaData = {};
    if (isAdcPage) {
      mamlaData = {
        mamlaName,
        mamlaNo,
        year,
        district: selectedDistrictObj,
        comments,

        createdAt: today,
      };
    } else {
      mamlaData = {
        mamlaName,
        mamlaNo,
        year,
        district: selectedDistrictObj,
        nextDate,
        previousDate: selectedPreviousDate,
        lastCondition: selectedLastCondition,
        completionDate,
        comments,
        badi: badiList,
        bibadi: bibadiList,
        createdAt: today,
      };
    }

    try {
      setLoading(true);
      let res;
      if (isAdcPage) res = await axiosPublic.post("/adcMamla", mamlaData);
      else res = await axiosPublic.post("/mamlas", mamlaData);
      if (res.data.insertedId) {
        toast.success("আপলোড সফল হয়েছে");
        if (isAdcPage) navigate("/dashboard/allAdcMamla");
        else navigate("/dashboard/allMamla");
        form.reset();
        setBadiList([]);
        setBibadiList([]);
        setSelectedLastCondition("");
      }
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
            type="number"
            name="mamlaNo"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* Year */}
        <label>
          বছর:
          <select
            name="year"
            className="mt-1 w-full select-bordered select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">সাল নির্বচন করুন</option>
            {Array.from({ length: 50 }, (_, i) => {
              const y = 2000 + i;
              return (
                <option key={y} value={y}>
                  {toBanglaNumber(y)}
                </option>
              );
            })}
          </select>
        </label>

        {/* District */}
        <label>
          জেলা
          <select
            name="district"
            className="mt-1 w-full select-bordered select"
            defaultValue=""
          >
            <option value="">জেলা নির্বাচন করুন</option>
            {districts.map((d, idx) => (
              <option key={idx} value={d.en}>
                {d.bn}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!isAdcPage && (
        <div>
          <div className="gap-4 grid grid-cols-2 mt-4 text-sm">
            {/* Previous Date (readonly) */}
            <label>
              পূর্ববর্তী তারিখ:
              <input
                value={selectedPreviousDate}
                type="date"
                name="previousDate"
                onChange={(e) => setSelectedPreviousDate(e.target.value)}
                className="mt-1 input-bordered w-full input"
              />
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

            {/* Completion Date */}
            <label>
              নিষ্পত্তির তারিখ:
              <input
                type="date"
                name="completionDate"
                className="mt-1 input-bordered w-full input"
              />
            </label>

            {/* Last Condition */}
            <label className="">
              সর্বশেষ অবস্থা:
              <div className="flex items-center space-x-2">
                <select
                  value={selectedLastCondition}
                  onChange={(e) => setSelectedLastCondition(e.target.value)}
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
          </div>

          {/* Badi & Bibadi sections remain same... */}
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
        </div>
      )}
      <label className="block mt-4">
        মন্তব্য
        <textarea
          rows={4}
          name="comments"
          className="mt-1 input-bordered w-full textarea input"
        />
      </label>

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

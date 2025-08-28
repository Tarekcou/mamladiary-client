import { useState } from "react";
import axiosPublic from "../../../axios/axiosPublic";
import { toast } from "sonner";
import { Plus, X } from "lucide-react"; // For close icon, optional
import { mamlaNames } from "../../../data/mamlaNames";
import { districts } from "../../../data/districts";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";

export default function MamlaUploadForm() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);

  const [badiPhones, setBadiPhones] = useState([]);
  const [bibadiPhones, setBibadiPhones] = useState([]);
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
  const removeParty = (type, phone) => {
    if (type === "badi") setBadiList(badiList.filter((p) => p.phone !== phone));
    else setBibadiList(bibadiList.filter((p) => p.phone !== phone));
  };

  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

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
      lastCondition: form.lastCondition.value,
      completionDate: form.completionDate.value,
      comments: form.comments.value,
      badi: badiList,
      bibadi: bibadiList,

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
        {/* Completion Date */}
        <label>
          নিষ্পত্তির তারিখ:
          <input
            type="date"
            name="completionDate"
            className="mt-1 input-bordered w-full input"
          />
        </label>

        {/* last Condition Mamla */}
        <label className="col-span-2">
          সর্বশেষ অবস্থা:
          <textarea
            type="text"
            name="lastCondition"
            className="col-span-3 mt-1 input-bordered w-full textarea input"
          ></textarea>
        </label>

        {/* Completion Date */}

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
      </div>
      <label>
        মন্তব্য
        <textarea
          rows={4}
          type="text"
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

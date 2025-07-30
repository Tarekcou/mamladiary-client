import { useContext, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import axiosPublic from "../../axios/axiosPublic";
import { districts } from "../../data/districts";
import { mamlaNames } from "../../data/mamlaNames";
import { AuthContext } from "../../provider/AuthProvider";

export default function NagorikCaseInfoUpload() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const {user}=useContext(AuthContext)
  console.log(user)
  const [badiInput, setBadiInput] = useState({ name: "", phone: "", address: "" });
  const [bibadiInput, setBibadiInput] = useState({ name: "", phone: "", address: "" });

  const [badiList, setBadiList] = useState([]);
  const [bibadiList, setBibadiList] = useState([]);

  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().split("").map(d => banglaDigits[d] || d).join("");
  };

  const today = new Date().toISOString().split("T")[0];

  const addBadi = () => {
    if (badiInput.name && badiInput.phone) {
      setBadiList([...badiList, badiInput]);
      setBadiInput({ name: "", phone: "", address: "" });
    }
  };

  const addBibadi = () => {
    if (bibadiInput.name && bibadiInput.phone) {
      setBibadiList([...bibadiList, bibadiInput]);
      setBibadiInput({ name: "", phone: "", address: "" });
    }
  };

  const removeParty = (type, phone) => {
    if (type === "badi") setBadiList(badiList.filter(p => p.phone !== phone));
    else setBibadiList(bibadiList.filter(p => p.phone !== phone));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  if (badiInput.name && badiInput.phone) {
    badiList.push(badiInput);
  }

  if (bibadiInput.name && bibadiInput.phone) {
    bibadiList.push(bibadiInput);
  }

  const today = new Date().toISOString();

  const nagorikData = {
    mamlaName: form.mamlaName.value,
    mamlaNo: form.mamlaNo.value,
    year: form.year.value,
    district: form.district.value,
    trackingNo: form.trackingNo.value,
    badi: badiList,
    bibadi: bibadiList,
    isApproved: false,
    createdAt: today,
  };

  const userMamlaData = {
    mamlas: [
      {
        trackingNo: form.trackingNo.value,
        mamlaNo: form.mamlaNo.value,
        district: form.district.value,
      },
    ],
  };

  try {
    setLoading(true);

    const res = await axiosPublic.patch(
      `/cases/nagorik/${nagorikData.trackingNo}`,
      nagorikData
    );

    await axiosPublic.patch(`/users/${user._id}`, userMamlaData);

    if (res.data.message === "Nagorik data added to divCom") {
      toast.success("আপলোড সফল হয়েছে");
      setBadiList([]);
      setBibadiList([]);
      setBadiInput({ name: "", phone: "", address: "" });
      setBibadiInput({ name: "", phone: "", address: "" });
      form.reset();
    } else {
      toast.warning("আপলোড ব্যর্থ হয়েছে");
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
        মামলা তথ্য দিন
      </h2>

      <div className="mb-4">
        <label>
          ট্র্যাকিং নম্বর:
          <input type="number" name="trackingNo" className="mt-1 input input-bordered w-full" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <label>
          মামলার নাম:
          <select name="mamlaName" className="mt-1 select select-bordered w-full">
            <option value="">মামলার নাম নির্বচন করুন</option>
            {mamlaNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>

        <label>
          মামলা নম্বর:
          <input name="mamlaNo" type="text" className="mt-1 input input-bordered w-full" />
        </label>

        <label>
          বছর:
          <select name="year" className="mt-1 select select-bordered w-full" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">সাল নির্বচন করুন</option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = 2000 + i;
              return <option key={year} value={year}>{toBanglaNumber(year)}</option>;
            })}
          </select>
        </label>

        <label>
          জেলা:
          <select name="district" className="mt-1 select select-bordered w-full">
            <option value="">জেলা নির্বচন করুন</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>

      {/* Badi */}
      <div className="col-span-2 mt-4">
        <label className="block mb-1 font-semibold">বাদির তথ্য:</label>
        <div className="flex flex-wrap gap-2">
          <div className="flex w-full gap-4">
            <input type="text" placeholder="নাম" className="input input-bordered w-full" value={badiInput.name} onChange={(e) => setBadiInput({ ...badiInput, name: e.target.value })} />
            <input type="number" placeholder="ফোন" className="input input-bordered w-full" value={badiInput.phone} onChange={(e) => setBadiInput({ ...badiInput, phone: e.target.value })} />
          </div>
          <input type="text" placeholder="ঠিকানা" className="input input-bordered w-full" value={badiInput.address} onChange={(e) => setBadiInput({ ...badiInput, address: e.target.value })} />
          <button type="button" onClick={addBadi} className="btn bg-[#004080] text-white"><Plus /> যুক্ত করুন</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {badiList.map((p) => (
            <div key={p.phone} className="badge badge-success gap-2 p-3 text-white">
              {p.name} | {p.phone} | {p.address}
              <X className="cursor-pointer" size={14} onClick={() => removeParty("badi", p.phone)} />
            </div>
          ))}
        </div>
      </div>

      {/* Bibadi */}
      <div className="col-span-2 mt-6">
        <label className="block mb-1 font-semibold">বিবাদির তথ্য:</label>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-4 w-full">
            <input type="text" placeholder="নাম" className="input input-bordered w-full" value={bibadiInput.name} onChange={(e) => setBibadiInput({ ...bibadiInput, name: e.target.value })} />
            <input type="number" placeholder="ফোন" className="input input-bordered w-full" value={bibadiInput.phone} onChange={(e) => setBibadiInput({ ...bibadiInput, phone: e.target.value })} />
          </div>
          <input type="text" placeholder="ঠিকানা" className="input input-bordered w-full" value={bibadiInput.address} onChange={(e) => setBibadiInput({ ...bibadiInput, address: e.target.value })} />
          <button type="button" onClick={addBibadi} className="btn bg-[#004080] text-white"><Plus /> যুক্ত করুন</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {bibadiList.map((p) => (
            <div key={p.phone} className="badge badge-error gap-2 p-3 text-white">
              {p.name} | {p.phone} | {p.address}
              <X className="cursor-pointer" size={14} onClick={() => removeParty("bibadi", p.phone)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button type="submit" className="btn px-6 bg-[#004080] text-white" disabled={loading}>
          
          {loading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
        </button>
      </div>
    </form>
  );
}

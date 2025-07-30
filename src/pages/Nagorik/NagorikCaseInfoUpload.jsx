import { use, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import axiosPublic from "../../axios/axiosPublic";
import { districts } from "../../data/districts";
import { mamlaNames } from "../../data/mamlaNames";
import { AuthContext } from "../../provider/AuthProvider";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function NagorikCaseInfoUpload() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const caseData = location.state?.caseData || {};
  // console.log(caseData?.caseStages?.[0]?.divCom?.nagorikData.mamlaName);
  const [mamlaName, setMamlaName] = useState("");
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");
  const navigate = useNavigate();
  const [formDefaults, setFormDefaults] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: 2025,
    district: "",
    trackingNo: "",
  });

  useEffect(() => {
    const divComData = caseData?.caseStages?.[0]?.divCom?.nagorikData;
    if (divComData) {
      setFormDefaults({
        mamlaName: divComData.mamlaName || "",
        mamlaNo: divComData.mamlaNo || "",
        year: divComData.year || 2025,
        district: divComData.district || "",
        trackingNo: divComData.trackingNo || "",
      });
      setMamlaName(divComData.mamlaName || ""); // <-- Add this
      setDistrict(divComData.district || ""); // <-- Add this
      setYear(divComData.year || ""); // <-- Add this

      if (divComData.badi?.length) {
        setBadiList(divComData.badi);
      }
      if (divComData.bibadi?.length) {
        setBibadiList(divComData.bibadi);
      }
    }
  }, [caseData]);

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

  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((d) => banglaDigits[d] || d)
      .join("");
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
    if (type === "badi") setBadiList(badiList.filter((p) => p.phone !== phone));
    else setBibadiList(bibadiList.filter((p) => p.phone !== phone));
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
      mamlaName: mamlaName || form.mamlaName.value,
      mamlaNo: form.mamlaNo.value,
      year: year || form.year.value,
      district: district || form.district.value,
      trackingNo: form.trackingNo.value,
      badi: badiList,
      bibadi: bibadiList,
      isApproved: false,
      lawyer: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        userId: user._id,
      },
      createdAt: today,
    };

    try {
      setLoading(true);
      console.log(nagorikData.trackingNo);
      const res = await axiosPublic.patch(
        `/cases/nagorik/${nagorikData.trackingNo}`,
        nagorikData
      );

      if (res.data.updated) {
        await Swal.fire({
          icon: "success",
          title: "সফলভাবে আপলোড হয়েছে",
          confirmButtonText: "ঠিক আছে",
        });

        setBadiList([]);
        setBibadiList([]);
        setBadiInput({ name: "", phone: "", address: "" });
        setBibadiInput({ name: "", phone: "", address: "" });
        setYear("");
        setDistrict("");
        setMamlaName("");
        form.reset();
        navigate("/dashboard/nagorik/mamla");
      } else {
        Swal.fire({
          icon: "warning",
          title: "আপলোড ব্যর্থ হয়েছে",
          text: res.data.message || "দয়া করে আবার চেষ্টা করুন",
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      Swal.fire({
        icon: "error",
        title: "সার্ভার সমস্যা",
        text: "আপলোড ব্যর্থ হয়েছে",
      });
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
          <input
            type="number"
            name="trackingNo"
            defaultValue={formDefaults.trackingNo}
            className="mt-1 input-bordered w-full input"
          />
        </label>
      </div>

      <div className="gap-4 grid grid-cols-2 text-sm">
        <label>
          মামলার নাম:
          <select
            name="mamlaName"
            value={mamlaName}
            onChange={(e) => setMamlaName(e.target.value)}
            className="mt-1 w-full select-bordered select"
          >
            <option value="">মামলার নাম নির্বচন করুন</option>
            {mamlaNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          মামলা নম্বর:
          <input
            name="mamlaNo"
            type="number"
            defaultValue={formDefaults.mamlaNo}
            className="mt-1 input-bordered w-full input"
          />
        </label>

        <label>
          বছর:
          <select
            name="year"
            className="mt-1 w-full select-bordered select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">সাল নির্বচন করুন</option>
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

        <label>
          জেলা:
          <select
            name="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="mt-1 w-full select-bordered select"
          >
            <option value="">জেলা নির্বচন করুন</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
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
        <div className="flex flex-wrap gap-2 mt-2">
          {badiList.map((p) => (
            <div
              key={p.phone}
              className="gap-2 p-3 text-white badge badge-success"
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

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="bg-[#004080] px-6 text-white btn"
          disabled={loading}
        >
          {caseData ? "আপডেট করুন" : "আপলোড করুন"}
        </button>
      </div>
    </form>
  );
}

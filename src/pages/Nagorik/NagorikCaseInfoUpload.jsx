<<<<<<< HEAD
import { useContext, useEffect, useState } from "react";
=======
import { use, useContext, useEffect, useState } from "react";
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993
import { toast } from "sonner";
import { CoinsIcon, Plus, X } from "lucide-react";
import axiosPublic from "../../axios/axiosPublic";
import { districts } from "../../data/districts";
import { mamlaNames } from "../../data/mamlaNames";
import { AuthContext } from "../../provider/AuthProvider";
<<<<<<< HEAD
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { useNavigate, useParams } from "react-router";
=======
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993

export default function NagorikCaseInfoUpload() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
<<<<<<< HEAD
  const {user}=useContext(AuthContext)
  const navigate = useNavigate();
  const { id: editId } = useParams(); // Optional: only present on edit
  const isEditMode = Boolean(editId);
  // console.log(user)
  const [badiInput, setBadiInput] = useState({ name: "", phone: "", address: "" });
  const [bibadiInput, setBibadiInput] = useState({ name: "", phone: "", address: "" });
=======
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
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993

  const [badiList, setBadiList] = useState([]);
  const [bibadiList, setBibadiList] = useState([]);
  const [aclandInput, setAclandInput] = useState({ mamlaName: "", mamlaNo: "", year:"", district: "" });
const [aclandList, setAclandList] = useState([]);

<<<<<<< HEAD
const [adcInput, setAdcInput] = useState({ mamlaName: "", mamlaNo: "", year:"", district: "" });
const [adcList, setAdcList] = useState([]);
const [isAllIAcLandinfoAdded, setIsAllIAcLandinfoAdded] = useState(true);
const [isAllIAdcinfoAdded, setIsAllIAdcinfoAdded] = useState(true);


   const [formState, setFormState] = useState({
    trackingNo: "",
    badi: [],
    bibadi: [],
    aclandMamlaInfo: [],
    adcMamlaInfo: [],
    isApproved: false,
  });
   // Fetch case details if editing
  useEffect(() => {
  if (isEditMode) {
    axiosPublic.get(`/cases/${editId}`).then((res) => {
      const data = res.data;
      setFormState({
        trackingNo: data.trackingNo,
        badi: data.nagorikSubmission?.badi || [],
        bibadi: data.nagorikSubmission?.bibadi || [],
        aclandMamlaInfo: data.nagorikSubmission?.aclandMamlaInfo || [],
        adcMamlaInfo: data.nagorikSubmission?.adcMamlaInfo || [],
        isApproved: data.isApproved || false,
      });

      // ✅ Also populate local lists
      setBadiList(data.nagorikSubmission?.badi || []);
      setBibadiList(data.nagorikSubmission?.bibadi || []);
      setAclandList(data.nagorikSubmission?.aclandMamlaInfo || []);
      setAdcList(data.nagorikSubmission?.adcMamlaInfo || []);
    });
  } else {
    setFormState((prev) => ({
      ...prev,
      trackingNo: `TRACK-${Date.now()}`,
    }));
  }
}, [editId]);

const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
=======
  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((d) => banglaDigits[d] || d)
      .join("");
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993
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
<<<<<<< HEAD
  const addAcland = () => {
  if (aclandInput.mamlaName && aclandInput.mamlaNo&&aclandInput.year&&aclandInput.district) {
    setAclandList([...aclandList, aclandInput]);
    setAclandInput({ mamlaName: "", mamlaNo: "", year: "",district:"" });
  setIsAllIAcLandinfoAdded(true); // Reset error message
} else {
  setIsAllIAcLandinfoAdded(false);
}
};

const removeAcland = (name) => {
  setAclandList(prev => prev.filter((_, i) => i !== index));
};

const addAdc = () => {
  if (adcInput.mamlaName && adcInput.mamlaNo&&adcInput.year&&adcInput.district) {
    console.log(adcInput)
    setAdcList([...adcList, adcInput]);
    setAdcInput({ mamlaName: "", mamlaNo: "", year: "",district:"" });
  setIsAllIAdcinfoAdded(true); // Reset error message
} else {
  setIsAllIAdcinfoAdded(false);
}
};

const removeAdc = (name) => {
  setAdcList(prev => prev.filter((_, i) => i !== index));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  const finalBadiList = badiInput.name && badiInput.phone
    ? [...badiList, badiInput]
    : badiList;

  const finalBibadiList = bibadiInput.name && bibadiInput.phone
    ? [...bibadiList, bibadiInput]
    : bibadiList;

  const finalAclandList = aclandInput.mamlaName && aclandInput.mamlaNo && aclandInput.year && aclandInput.district
    ? [...aclandList, aclandInput]
    : aclandList;

  const finalAdcList = adcInput.mamlaName && adcInput.mamlaNo && adcInput.year && adcInput.district
    ? [...adcList, adcInput]
    : adcList;

  const today = new Date().toISOString();
  const trackNo = finalAclandList[0]?.mamlaNo + finalAclandList[0]?.year;

  const postData = {
    trackingNo: trackNo,
    createdAt: today,
      isApproved: formState.isApproved || false,
    submittedBy: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
    nagorikSubmission: {
      badi: finalBadiList,
      bibadi: finalBibadiList,
      aclandMamlaInfo: finalAclandList,
      adcMamlaInfo: finalAdcList,
    },
  };
  console.log(postData)

  try {
    setLoading(true);
     if (isEditMode) {
        const res = await axiosPublic.patch(`/cases/${editId}`, postData);
        if (res.data.modifiedCount > 0) {
          toast.success("মামলাটি সফলভাবে হালনাগাদ হয়েছে");
          navigate("/dashboard/nagorik/cases");
        }
      } else {
        const res = await axiosPublic.post("/cases", postData);
        if (res.data.insertedId) {
          toast.success("মামলাটি সফলভাবে দাখিল হয়েছে");
          navigate("/dashboard/nagorik/cases");
        }
      }


      // Clear all inputs & lists
      setBadiList([]);
      setBibadiList([]);
      setAclandList([]);
      setAdcList([]);
      setBadiInput({ name: "", phone: "", address: "" });
      setBibadiInput({ name: "", phone: "", address: "" });
      setAclandInput({ mamlaName: "", mamlaNo: "", year: "", district: "" });
      setAdcInput({ mamlaName: "", mamlaNo: "", year: "", district: "" });

      if (!isEditMode) {
  form.reset();
}

    } 
  
    
  catch (err) {
    console.error("Upload failed:", err);
    toast.warning("আপলোড ব্যর্থ হয়েছে");
  } finally {
    setLoading(false);
  }
};
=======
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
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993


  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 shadow-md mx-auto p-6">
      <h2 className="bg-[#004080] mb-4 py-2 font-bold text-white text-xl text-center">
                {isEditMode ? "মামলা হালনাগাদ" : "নতুন মামলা দাখিল"}

      </h2>

<<<<<<< HEAD
     {/* Tracking No */}
      <div>
        <label className="label">ট্র্যাকিং নম্বর</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formState.trackingNo}
          readOnly
        />
      </div>

      <div className="">
          <label className="block mb-1 font-semibold">সহকারী কমিশনার (ভূমি) আদালতের তথ্য:</label>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <label>
          মামলার নাম:
          <select value={aclandInput.mamlaName} onChange={(e) => setAclandInput({ ...aclandInput, mamlaName: e.target.value })}  className="mt-1 select select-bordered w-full">
            <option value="">মামলার নাম নির্বচন করুন</option>
            {mamlaNames.map((name) => (
              <option  key={name} value={name}>{name}</option>
=======
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
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993
            ))}
          </select>
        </label>

        <label>
          মামলা নম্বর:
<<<<<<< HEAD
          <input value={aclandInput.mamlaNo} onChange={(e) => setAclandInput({ ...aclandInput, mamlaNo: e.target.value })} type="number" className="mt-1 input input-bordered w-full" />
=======
          <input
            name="mamlaNo"
            type="number"
            defaultValue={formDefaults.mamlaNo}
            className="mt-1 input-bordered w-full input"
          />
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993
        </label>

        <label>
          বছর:
<<<<<<< HEAD
          <select value={aclandInput.year} onChange={(e) => setAclandInput({ ...aclandInput, year: e.target.value })}  name="year" className="mt-1 select select-bordered w-full" >
=======
          <select
            name="year"
            className="mt-1 w-full select-bordered select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993
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
<<<<<<< HEAD
          <select value={aclandInput.district} onChange={(e) => setAclandInput({ ...aclandInput, district: e.target.value })} name="district" className="mt-1 select select-bordered w-full">
=======
          <select
            name="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="mt-1 w-full select-bordered select"
          >
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993
            <option value="">জেলা নির্বচন করুন</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
            <button type="button" onClick={addAcland} className="btn bg-[#004080] text-white"><Plus /> যুক্ত করুন</button>
{!isAllIAcLandinfoAdded && (
  <p className="text-red-500 text-sm mt-2">সকল তথ্য যুক্ত করুন</p>
)}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
    {aclandList.map((item, index) => (
      <div key={index} className="badge badge-info gap-2 p-3 text-white">
        {item.mamlaName} | {item.mamlaNo} | {item.year} | {item.district}
        <X className="cursor-pointer" size={14} onClick={() => removeAcland(item.mamlaName)} />
      </div>
    ))}
  </div>
      </div>


      {/* এডিসি তথ্য  */}
      <div className="">
          <label className="block mb-1 font-semibold">ADC আদালতের তথ্য:</label>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <label>
          মামলার নাম:
          <select value={adcInput.mamlaName} onChange={(e) => setAdcInput({ ...adcInput, mamlaName: e.target.value })}  className="mt-1 select select-bordered w-full">
            <option value="">মামলার নাম নির্বচন করুন</option>
            {mamlaNames.map((name) => (
              <option  key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>

        <label>
          মামলা নম্বর:
          <input value={adcInput.mamlaNo} onChange={(e) => setAdcInput({ ...adcInput, mamlaNo: e.target.value })} type="number" className="mt-1 input input-bordered w-full" />
        </label>

        <label>
          বছর:
          <select value={adcInput.year} onChange={(e) => setAdcInput({ ...adcInput, year: e.target.value })}  name="year" className="mt-1 select select-bordered w-full" >
            <option value="">সাল নির্বচন করুন</option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = 2000 + i;
              return <option key={year} value={year}>{toBanglaNumber(year)}</option>;
            })}
          </select>
        </label>

        <label>
          জেলা:
          <select value={adcInput.district} onChange={(e) => setAdcInput({ ...adcInput, district: e.target.value })} name="district" className="mt-1 select select-bordered w-full">
            <option value="">জেলা নির্বচন করুন</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
            <button type="button" onClick={addAdc} className="btn bg-[#004080] text-white"><Plus /> যুক্ত করুন</button>
            {!isAllIAdcinfoAdded && (
        <p className="text-red-500 text-sm mt-2">সকল তথ্য যুক্ত করুন</p>)}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
    {adcList.map((item, index) => (
      <div key={index} className="badge badge-info gap-2 p-3 text-white">
        {item.mamlaName} | {item.mamlaNo} | {item.year} | {item.district}
        <X className="cursor-pointer" size={14} onClick={() => removeAdc(item.mamlaName)} />
      </div>
    ))}
  </div>
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
<<<<<<< HEAD
        <button type="submit" className="btn px-6 bg-[#004080] text-white" disabled={loading}>
          
          {isEditMode ? "হালনাগাদ করুন" : "দাখিল করুন"}
=======
        <button
          type="submit"
          className="bg-[#004080] px-6 text-white btn"
          disabled={loading}
        >
          {caseData ? "আপডেট করুন" : "আপলোড করুন"}
>>>>>>> ffac0d54b5a329bde3683b89e2a675f715dcd993
        </button>
      </div>
    </form>
  );
}

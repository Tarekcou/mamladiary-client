import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { CoinsIcon, Plus, X } from "lucide-react";
import axiosPublic from "../../axios/axiosPublic";
import { districts } from "../../data/districts";
import { mamlaNames } from "../../data/mamlaNames";
import { AuthContext } from "../../provider/AuthProvider";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { useNavigate, useParams } from "react-router";
import { aclandOptions } from "../../data/aclandOptions";

export default function NagorikCaseInfoUpload() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditMode = Boolean(editId);

  const [trackingNo, setTrackingNo] = useState("");
  const [loading, setLoading] = useState(false);
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
  const [aclandInput, setAclandInput] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: "",
    district: "",
    officeName: "",
    unionName: "",
  });
  const [aclandList, setAclandList] = useState([]);
  const [adcInput, setAdcInput] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: "",
    district: "",
  });
  const [adcList, setAdcList] = useState([]);
  const [isAllIAcLandinfoAdded, setIsAllIAcLandinfoAdded] = useState(true);
  const [isAllIAdcinfoAdded, setIsAllIAdcinfoAdded] = useState(true);
  const [formState, setFormState] = useState({
    badi: [],
    bibadi: [],
    aclandMamlaInfo: [],
    adcMamlaInfo: [],
    isApproved: false,
  });

  useEffect(() => {
    if (isEditMode) {
      axiosPublic.get(`/cases/${editId}`).then((res) => {
        const data = res.data;
        setFormState({
          badi: data.nagorikSubmission?.badi || [],
          bibadi: data.nagorikSubmission?.bibadi || [],
          aclandMamlaInfo: data.nagorikSubmission?.aclandMamlaInfo || [],
          adcMamlaInfo: data.nagorikSubmission?.adcMamlaInfo || [],
          isApproved: data.isApproved || false,
        });
        setBadiList(data.nagorikSubmission?.badi || []);
        setBibadiList(data.nagorikSubmission?.bibadi || []);
        setAclandList(data.nagorikSubmission?.aclandMamlaInfo || []);
        setAdcList(data.nagorikSubmission?.adcMamlaInfo || []);
        setTrackingNo(data.trackingNo || "");
      });
    } else {
      setFormState((prev) => ({
        ...prev,
        trackingNo: aclandList[0]?.mamlaNo + aclandList[0]?.year,
      }));
    }
  }, [editId]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const addAcland = () => {
    if (
      aclandInput.mamlaName &&
      aclandInput.mamlaNo &&
      aclandInput.year &&
      aclandInput.district
    ) {
      setTrackingNo(`${aclandInput.mamlaNo}${aclandInput.year}`);
      setAclandList([...aclandList, aclandInput]);

      setAclandInput({
        mamlaName: "",
        mamlaNo: "",
        year: "",
        district: "",
        officeName: "",
        unionName: "",
      });
      setIsAllIAcLandinfoAdded(true);
    } else {
      setIsAllIAcLandinfoAdded(false);
    }
  };

  const removeAcland = (index) => {
    setAclandList((prev) => prev.filter((_, i) => i !== index));
  };

  const addAdc = () => {
    if (
      adcInput.mamlaName &&
      adcInput.mamlaNo &&
      adcInput.year &&
      adcInput.district
    ) {
      setAdcList([...adcList, adcInput]);
      setAdcInput({ mamlaName: "", mamlaNo: "", year: "", district: "" });
      setIsAllIAdcinfoAdded(true);
    } else {
      setIsAllIAdcinfoAdded(false);
    }
  };

  const removeAdc = (index) => {
    setAdcList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalBadiList =
      badiInput.name && badiInput.phone ? [...badiList, badiInput] : badiList;
    const finalBibadiList =
      bibadiInput.name && bibadiInput.phone
        ? [...bibadiList, bibadiInput]
        : bibadiList;
    const finalAclandList =
      aclandInput.mamlaName &&
      aclandInput.mamlaNo &&
      aclandInput.year &&
      aclandInput.district
        ? [...aclandList, aclandInput]
        : aclandList;
    const finalAdcList =
      adcInput.mamlaName &&
      adcInput.mamlaNo &&
      adcInput.year &&
      adcInput.district
        ? [...adcList, adcInput]
        : adcList;

    const postData = {
      trackingNo: trackingNo,
      createdAt: new Date().toISOString(),
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
          setBadiList([]);
          setBibadiList([]);
          setAclandList([]);
          setAdcList([]);
          setTrackingNo("");
          navigate("/dashboard/nagorik/cases");
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.warning("আপলোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };
  // console.log(aclandInput);
  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 shadow-md mx-auto p-6">
      <h2 className="bg-[#004080] mb-4 py-2 font-bold text-white text-xl text-center">
        {isEditMode ? "মামলা হালনাগাদ" : "নতুন মামলা দাখিল"}
      </h2>

      {/* Tracking No */}
      <div>
        <label className="label">ট্র্যাকিং নম্বর</label>
        <input
          type="text"
          className="input-bordered w-full input"
          value={trackingNo}
          readOnly
        />
      </div>

      {/* Acland Input */}
      <div className="mt-4">
        <label className="block mb-1 font-semibold">
          সহকারী কমিশনার (ভূমি) আদালতের তথ্য:
        </label>
        <div className="gap-4 grid grid-cols-2 text-sm">
          {/* Mamla Name */}
          <label>
            মামলার নাম:
            <select
              value={aclandInput.mamlaName}
              onChange={(e) =>
                setAclandInput({ ...aclandInput, mamlaName: e.target.value })
              }
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

          {/* Mamla No */}
          <label>
            মামলা নম্বর:
            <input
              type="number"
              className="mt-1 input-bordered w-full input"
              value={aclandInput.mamlaNo}
              onChange={(e) =>
                setAclandInput({ ...aclandInput, mamlaNo: e.target.value })
              }
            />
          </label>

          {/* Year */}
          <label>
            বছর:
            <select
              className="mt-1 w-full select-bordered select"
              value={aclandInput.year}
              onChange={(e) =>
                setAclandInput({ ...aclandInput, year: e.target.value })
              }
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
              className="mt-1 w-full select-bordered select"
              value={aclandInput.district?.en || ""}
              onChange={(e) => {
                const selectedDistrict = aclandOptions.find(
                  (d) => d.district.en === e.target.value
                );
                setAclandInput({
                  ...aclandInput,
                  district: selectedDistrict?.district || null,
                  officeName: null, // Reset office
                });
              }}
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {aclandOptions.map((d, idx) => (
                <option key={idx} value={d.district.en}>
                  {d.district.bn}
                </option>
              ))}
            </select>
          </label>

          {/* Office */}
          <label>
            অফিস
            <select
              className="mt-1 w-full select-bordered select"
              value={aclandInput.officeName?.en || ""}
              disabled={!aclandInput.district}
              onChange={(e) => {
                const selectedOffice = aclandOptions
                  .find((d) => d.district.en === aclandInput.district?.en)
                  ?.offices.find((o) => o.en === e.target.value);
                setAclandInput({
                  ...aclandInput,
                  officeName: selectedOffice || null,
                });
              }}
            >
              <option value="">অফিস নির্বাচন করুন</option>
              {aclandOptions
                .find((d) => d.district.en === aclandInput.district?.en)
                ?.offices.map((office) => (
                  <option key={office.en} value={office.en}>
                    {office.bn}
                  </option>
                )) || []}
            </select>
          </label>

          {/* Union */}
          <label>
            ইউনিয়ন (ঐচ্ছিক):
            <input
              className="input-bordered w-full input"
              placeholder="ইউনিয়নের নাম লিখুন"
              value={aclandInput.unionName || ""}
              onChange={(e) =>
                setAclandInput({ ...aclandInput, unionName: e.target.value })
              }
              disabled={!aclandInput.district}
            />
          </label>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={addAcland}
          className="bg-[#004080] mt-2 text-white btn"
        >
          <Plus /> যুক্ত করুন
        </button>

        {/* Validation Message */}
        {!isAllIAcLandinfoAdded && (
          <p className="mt-2 text-red-500 text-sm">সকল তথ্য যুক্ত করুন</p>
        )}

        {/* List */}
        {aclandList.map((item, index) => (
          <div key={index} className="gap-2 p-4 text-white badge badge-info">
            {item.mamlaName} | {item.mamlaNo} | {item.year} |{" "}
            {item.district?.bn || "নির্বাচিত নয়"} | {item.officeName?.bn || ""}
            <X
              className="cursor-pointer"
              size={14}
              onClick={() => removeAcland(index)}
            />
          </div>
        ))}
      </div>

      {/* ADC Input */}
      <div className="mt-6">
        <label className="block mb-1 font-semibold">ADC আদালতের তথ্য:</label>
        <div className="gap-4 grid grid-cols-2 text-sm">
          <label>
            মামলার নাম:
            <select
              value={adcInput.mamlaName}
              onChange={(e) =>
                setAdcInput({ ...adcInput, mamlaName: e.target.value })
              }
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
              type="number"
              className="mt-1 input-bordered w-full input"
              value={adcInput.mamlaNo}
              onChange={(e) =>
                setAdcInput({ ...adcInput, mamlaNo: e.target.value })
              }
            />
          </label>

          <label>
            বছর:
            <select
              value={adcInput.year}
              onChange={(e) =>
                setAdcInput({ ...adcInput, year: e.target.value })
              }
              className="mt-1 w-full select-bordered select"
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
          <label>
            জেলা
            <select
              className="mt-1 w-full select-bordered select"
              value={adcInput.district?.en || ""}
              onChange={(e) => {
                const selectedDistrict = aclandOptions.find(
                  (d) => d.district.en === e.target.value
                );
                setAdcInput({
                  ...adcInput,
                  district: selectedDistrict?.district || null,
                  officeName: null, // Reset office
                });
              }}
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {aclandOptions.map((d, idx) => (
                <option key={idx} value={d.district.en}>
                  {d.district.bn}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={addAdc}
          className="bg-[#004080] mt-2 text-white btn"
        >
          <Plus /> যুক্ত করুন
        </button>
        {!isAllIAdcinfoAdded && (
          <p className="mt-2 text-red-500 text-sm">সকল তথ্য যুক্ত করুন</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {adcList.map((item, index) => (
            <div key={index} className="gap-2 p-3 text-white badge badge-info">
              {item.mamlaName} | {item.mamlaNo} | {item.year} |{" "}
              {item.district.bn}
              <X
                className="cursor-pointer"
                size={14}
                onClick={() => removeAdc(index)}
              />
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
        <button
          type="submit"
          className="bg-[#004080] px-6 text-white btn"
          disabled={loading}
        >
          {isEditMode ? "আপডেট করুন" : "আপলোড করুন"}
        </button>
      </div>
    </form>
  );
}

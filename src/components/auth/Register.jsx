import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import RegisterLottie from "../lottie/RegisterLottie";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { aclandOptions } from "../../data/aclandOptions";

export default function Register() {
  const { resigter, isLoading, setButtonSpin } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigation = useNavigate();
  const { officeType } = useParams();

  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    district: null,
    password: "",
  });

  // Sync district with formData when selected
  useEffect(() => {
    setFormData((prev) => ({ ...prev, district }));
  }, [district]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setButtonSpin(true);

    const finalData = {
      ...formData,
      role: "nagorik",
    };

    try {
      const result = await resigter(finalData);
      console.log(result)
      if (result.insertedId) {
        toast.success("রেজিস্ট্রেশন সফল হয়েছে,  লগ ইন  করুন");
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          district: null,
          designation: "",
        });
        navigation("/nagorik/login");
      } else if (result.message === "user already exists") {
        toast.warning("এই আইডি আগে থেকেই রেজিস্টার্ড, লগইন করুন");
        navigation("/nagorik/login");
      } else {
        toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে!",result.message);
      }
    } catch (error) {
      toast.error("সার্ভার ত্রুটি! আবার চেষ্টা করুন");
      console.error("Registration error:", error);
    }

    setLoading(false);
    setButtonSpin(false);
  };

  return (
    <div className="flex flex-col justify-between items-center md:p-5">
      <div>
        <RegisterLottie />
      </div>

      <div className="bg-gray-100 shadow-2xl p-5 md:p-30 border-gray-300 rounded-lg w-11/12">
        <h2 className="mb-6 font-bold text-2xl text-center">
          নাগরিক রেজিস্ট্রেশন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex gap-2">
            <input
              type="text"
              name="name"
              placeholder="নাম"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="ইমেইল"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              name="phone"
              placeholder="মোবাইল নম্বর"
              value={formData.phone}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg w-full"
            />
            <input
              type="text"
              name="designation"
              placeholder="পদবী"
              value={formData.designation}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>

          <div className="flex gap-2">
            <select
              name="district"
              className="bg-gray-100 w-full select-bordered select"
              required
              value={district ? JSON.stringify(district) : ""}
              onChange={(e) => {
                const value = e.target.value;
                setDistrict(value === "" ? null : JSON.parse(value));
              }}
            >
              <option value="" disabled>
                জেলা নির্বাচন করুন
              </option>
              {aclandOptions.map((districtObj, index) => (
                <option key={index} value={JSON.stringify(districtObj.district)}>
                  {districtObj.district.bn} ({districtObj.district.en})
                </option>
              ))}
            </select>

            <input
              type="password"
              name="password"
              placeholder="পাসওয়ার্ড"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-[#004080] w-full text-white btn btn-primary"
            disabled={loading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "নতুন একাউন্ট তৈরি করুন"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

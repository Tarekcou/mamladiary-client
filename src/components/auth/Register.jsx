import { useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import RegisterLottie from "../lottie/RegisterLottie";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import axios from "axios"; // Assuming you're using axios
import { toast } from "sonner";
import { districts } from "../../data/districts";
import { mamlaNames } from "../../data/mamlaNames";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { aclandOptions } from "../../data/aclandOptions";

export default function Register() {
  const { resigter, isLoading } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { officeType } = useParams();

  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);

  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(
    localDate.getMonth() + 1
  ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
  const [district, setDistrict] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    district: district,
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Step 2: Upload mamla data
      const finalData = {
        ...formData,
        district,
        role: officeType, // Assuming this is the role for citizen registration
      };
      resigter(finalData); // This is for user registration

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        district: "",
        designation: "",
      });
    } catch (err) {
      console.error("Full submission failed:", err);
      toast.error("রেজিস্ট্রেশন বা মামলা আপলোড ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center p-5">
      <div className="">
        <RegisterLottie />
      </div>

      <div className="bg-gray-100 shadow-2xl p-10 border-gray-300 rounded-lg w-11/12">
        <h2 className="mb-6 font-bold text-2xl text-center">
          নাগরিক রেজিস্ট্রেশন
        </h2>

        {/* User Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Mamla Upload Form */}

          {/* Advocate info */}
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
            {" "}
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
              value={district ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setDistrict(value === "" ? null : value); // Now a string (district.en)
              }}
            >
              <option value="" disabled>
                জেলা নির্বাচন করুন
              </option>
              {aclandOptions.map((districtObj, index) => (
                <option key={index} value={districtObj.district.en}>
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
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "নতুন একাউন্ট তৈরি করুন"
            )}
          </button>

          {/* <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-[#004080] px-6 text-white btn"
              disabled={loading}
            >
              {loading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
}

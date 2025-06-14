// pages/Register.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import RegisterLottie from "../lottie/RegisterLottie";

export default function Register() {
  const { resigter, isLoading } = useContext(AuthContext);
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dnothiId: "",
    password: "",
    section: "",
    designation: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resigter(formData);
  };

  return (
    <div className="flex md:flex-row flex-col justify-between items-center px-4">
      {/* Lottie */}
      <div className="flex-1">
        <RegisterLottie />
      </div>

      <div className="flex-1 bg-gray-100 py-4 rounded-2xl">
        <h2 className="mb-6 font-bold text-2xl text-center">রেজিস্টার </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="নাম "
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
            name="section"
            placeholder="সেকশন"
            value={formData.section}
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

          <input
            type="text"
            name="dnothiId"
            placeholder="ডি নথি আইডি"
            value={formData.dnothiId}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="পাসওয়ার্ড"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg w-full"
          />

          <button
            type="submit"
            className="bg-[#004080] rounded-lg w-full text-white btn btn-primary btn-square"
          >
            {isLoading ? <span className="loading loading-spinner"></span> : ""}
            নতুন একাউন্ট তৈরি করুন
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?
          <Link to="/login" className="ml-2 text-[#004080] hover:underline btn">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

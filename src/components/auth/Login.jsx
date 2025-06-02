import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import LoginLottie from "../lottie/LoginLottie";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const { signIn, isLoading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    dnothiId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(formData);
    navigate(from, { replace: true });
  };

  return (
    <div className="flex md:flex-row flex-col justify-center items-center px-4">
      {/* Lottie */}
      <div className="flex-1">
        <LoginLottie />
      </div>
      <div className="flex-1 bg-gray-100 py-4 rounded-2xl">
        <h2 className="mb-6 font-bold text-2xl text-center">সাইন ইন </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="dnothiId"
            placeholder=" ডি নথি আইডি"
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
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "সাইন ইন করুন"
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-[#004080] hover:underline btn"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

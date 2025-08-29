import { useState, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import LoginLottie from "../lottie/LoginLottie";
import { toast } from "sonner";

export default function Login() {
  const { officeType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  console.log(officeType);
  const { signIn, isLoading } = useContext(AuthContext);

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = (value) => /^01[3-9]\d{8}$/.test(value);

  const [formData, setFormData] = useState({
    emailOrphone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("Submitting login form", formData);
    const { emailOrphone, password } = formData;
    let loginPayload = { password };

    if (isEmail(emailOrphone)) {
      loginPayload.email = emailOrphone;
    } else if (isPhone(emailOrphone)) {
      loginPayload.phone = emailOrphone;
    } else {
      return toast("সঠিক ইমেইল বা মোবাইল নম্বর দিন");
    }

    const res = await signIn(loginPayload, officeType);

    // Example navigation
    // if (res?.data?.status === "success") {
    //   navigate(`/dashboard/${officeType}`);
    // }
  };

  // ✅ Auto-fill based on officeType
  const handleAutoLogin = () => {
    let phone = "";

    if (officeType === "divCom") phone = "01818424256";
    if (officeType === "adc") phone = "01818424257";
    if (officeType === "acLand") phone = "01818424256";

    setFormData({ emailOrphone: phone, password: "12345" });

    // setTimeout(() => {
    //   handleSubmit();
    // }, 0);
  };

  const isOfficeUser =
    officeType === "acLand" || officeType === "adc" || officeType === "divCom";

  return (
    <div className="flex lg:flex-row flex-col justify-center items-center mx-10 my-10 px-4">
      <div className="flex-1">
        <LoginLottie />
      </div>

      <div className="flex-1 bg-gray-100 shadow-2xl p-5 rounded-2xl !w-full">
        <h2 className="mb-6 font-bold text-2xl text-center">
          {officeType === "divCom"
            ? "কমিশনার অফিস লগইন"
            : officeType === "adc"
            ? "ডিসি অফিস লগইন"
            : officeType === "acLand"
            ? "এসিল্যান্ড লগইন"
            : "নাগরিক লগইন "}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input
            type="text"
            name="emailOrphone"
            placeholder="ইমেইল বা ফোন"
            value={formData.emailOrphone}
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

        {/* ✅ Auto Login Button */}
        {isOfficeUser && (
          <button
            type="button"
            onClick={handleAutoLogin}
            className="bg-green-600 mt-3 py-2 rounded-lg w-full text-white btn"
          >
            অফিস টেস্ট লগইন (Auto)
          </button>
        )}

        <div className="mt-4 text-sm text-center">
          Don't have an account?
          <Link to="/register" className="ml-2 text-[#004080] hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

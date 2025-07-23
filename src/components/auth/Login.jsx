import { useState, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import LoginLottie from "../lottie/LoginLottie";

export default function Login() {
   const { officeType } = useParams();


  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const { signIn, isLoading } = useContext(AuthContext);
  const [nagorikForm,setNagorikForm]=useState(false)
  const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isPhone = (value) => {
  const phoneRegex = /^01[3-9]\d{8}$/; // For Bangladeshi mobile numbers
  return phoneRegex.test(value);
};
  const [formData, setFormData] = useState({
    emailOrphone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { emailOrphone, password } = formData;

  let loginPayload = { password };

  if (isEmail(emailOrphone)) {
    loginPayload.email = emailOrphone;
  } else if (isPhone(emailOrphone)) {
    loginPayload.phone = emailOrphone;
  } else {
    return alert("ভুল ইমেইল বা মোবাইল নম্বর দিন");
  }
  
   const res= signIn(loginPayload,officeType); // <- your AuthContext will use axios to call /nagorikLogin
  //  if (res?.data.status === "success") {
  //   navigate(`/dashboard/${officeType}`);
  //  }
};


  return (
    <div className="flex mx-10 md:flex-row flex-col justify-center items-center  px-4 my-10">
      {/* Lottie */}
      <div className="flex-1">
        <LoginLottie />
      </div>
      <div className="flex-1 bg-gray-100 shadow-2xl p-5   rounded-2xl">
        
        <h2 className="mb-6 font-bold text-2xl text-center">{officeType=="DivCom"?"কমিশনার অফিস লগইন" :officeType=="DC"?"ডিসি অফিস লগইন":officeType=="Acland"?"এসিল্যান্ড লগইন":"নাগরিক লগইন " }</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="emailOrphone"
            placeholder=" ইমেইল বা ফোন"
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

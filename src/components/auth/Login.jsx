// pages/Login.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";

export default function Login() {
  const { signIn,isButtonSpin,isLoading } = useContext(AuthContext);
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    dnothiId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(formData);
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="bg-white px-16 py-4 rounded-2xl max-w-xl">
        <h2 className="mb-6 font-bold text-2xl text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="dnothiId"
            placeholder="Email or DNothi ID"
            value={formData.dnothiId}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg w-full"
          />
        <button type="submit" className="btn btn-primary rounded-lg text-white  w-full btn-square">
       {isLoading? <span className="loading loading-spinner"></span>:""}
        Sign In
          </button>
         
        </form>

        <div className="mt-4 text-sm text-center">
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-blue-600 hover:underline btn"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

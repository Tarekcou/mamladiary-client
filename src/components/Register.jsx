// pages/Register.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

export default function Register() {
  const { resigter } = useContext(AuthContext);
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dnothiId: "",
    password: "",
    section: "",
    designation: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resigter(formData);
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="bg-white py-4 rounded-2xl w-10/12 md:w-6/12">
        <h2 className="mb-6 font-bold text-2xl text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg w-full"
          />

          <input
            type="text"
            name="dnothiId"
            placeholder="DNothi ID"
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

          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg w-full"
          />

          <input
            type="text"
            name="designation"
            placeholder="Podobi"
            value={formData.designation}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg w-full"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 py-2 rounded-lg w-full font-semibold text-white transition btn"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?
          <Link to="/login" className="ml-2 text-blue-600 hover:underline btn">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

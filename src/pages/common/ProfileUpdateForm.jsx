import { useState, useContext, useEffect } from "react";
import axiosPublic from "../../axios/axiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { UserIcon, PhoneIcon, BriefcaseIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { MailsIcon } from "lucide-react";

export default function ProfileUpdateForm() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && ["acLand", "adc", "nagorik"].includes(user.role)) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        designation: user.designation || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axiosPublic.patch(`/users/${user._id}`, formData);

    if (res.data.modifiedCount > 0) {
      toast.success("Profile updated successfully!");

      // Merge updated data into user, including password if changed
      const updatedUser = { ...user, ...formData };

      // Update context
      setUser(updatedUser);

      // Update localStorage so changes persist
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      toast.error("No changes were made.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile.");
  } finally {
    setLoading(false);
  }
};


  if (!user || !["acLand", "adc", "nagorik"].includes(user.role)) {
    return <p className="text-red-500 text-center mt-8">Profile update not allowed for this role.</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br to-gray-100 shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">প্রোফাইল আপডেট করুন</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <MailsIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            required
          />
        </div>

        {/* Designation */}
        <div className="relative">
          <BriefcaseIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password (Leave blank to keep current)"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary text-white py-2 rounded-lg font-semibold transition duration-300"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import axiosPublic from "../../axios/axiosPublic";
    import { motion } from "framer-motion"; // For animation

const Opinion = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    mamlaNo: "",
    mamlaName: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  // const [loading, setLoading] = useState(false);
  const { signIn, isButtonSpin, isLoading, setLoading } =
    useContext(AuthContext);
  console.log(isLoading);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace this URL with your actual backend endpoint
      await axiosPublic.post("/feedbacks", formData);
      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      location: "",
      description: "",
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-100 shadow-md mx-auto mt-10 p-6 rounded-lg max-w-xl text-center">
        <h2 className="font-semibold text-green-700 text-xl">
          Your complain has been submitted successfully!
        </h2>
        <p className="mt-2 text-gray-700">Please wait for a response.</p>
        <button
          onClick={handleReset}
          className="mt-4 btn-outline btn btn-primary"
        >
          Add another complain
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6  mx-auto  bg-white shadow-xl rounded-2xl"
    >
    <div className="bg-white shadow-md mx-auto mt-10 p-6 rounded-lg w-11/12 md:w-9/12">
      <h2 className="mb-4 font-bold text-2xl text-center">
        ওয়েবসাইট সম্পর্কে মতামত দিন।
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input-bordered w-full input"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="input-bordered w-full input"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="input-bordered w-full input"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="textarea-bordered w-full textarea"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="rounded-lg w-full text-white btn bg-[#004080] btn-square"
        >
          {isLoading ? <span className="loading loading-spinner"></span> : ""}
          মন্তব্য দাখিল করুন
        </button>
      </form>
    </div>
    </motion.div>
  );
};

export default Opinion;

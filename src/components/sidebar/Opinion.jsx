import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../provider/AuthProvider";
import axiosPublic from "../../axios/axiosPublic";

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
  const { isLoading, setLoading } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosPublic.post("/feedbacks", formData);
      setSubmitted(true);
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
      mamlaNo: "",
      mamlaName: "",
      description: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="mx-auto w-full mt-2 md:w-9/12 min-h-[500px]">
      {" "}
      {/* Stable wrapper */}
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-green-100 shadow-md mx-auto mt-10 p-6 rounded-lg max-w-xl  text-center"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 shadow-sm p-4 rounded-lg "
          >
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
                className="bg-[#004080] rounded-lg w-full text-white btn btn-square"
              >
                {isLoading && <span className="loading loading-spinner"></span>}
                মন্তব্য দাখিল করুন
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Opinion;

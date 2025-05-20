import React, { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';

const Opinion = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    mamlaNo: '',
    mamlaName: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn,isButtonSpin,isLoading } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace this URL with your actual backend endpoint
      await axios.post('https://your-backend-api.com/api/complains', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      location: '',
      description: ''
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="p-6 bg-green-100 rounded-lg text-center shadow-md max-w-xl mx-auto mt-10">
        <h2 className="text-xl font-semibold text-green-700">Your complain has been submitted successfully!</h2>
        <p className="mt-2 text-gray-700">Please wait for a response.</p>
        <button onClick={handleReset} className="mt-4 btn btn-outline btn-primary">
          Add another complain
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit Your Complain</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" className="input input-bordered w-full" value={formData.name} onChange={handleChange} required />

        <input type="tel" name="phone" placeholder="Phone" className="input input-bordered w-full" value={formData.phone} onChange={handleChange} required />

        <input type="text" name="location" placeholder="Location" className="input input-bordered w-full" value={formData.location} onChange={handleChange} required />

       

        <textarea name="description" placeholder="Description" className="textarea textarea-bordered w-full" value={formData.description} onChange={handleChange} required />

         <button type="submit" className="btn btn-primary rounded-lg text-white  w-full btn-square">
       {isLoading? <span className="loading loading-spinner"></span>:""}
        মন্তব্য দাখিল করুন
          </button>
      </form>
    </div>
  );
};

export default Opinion;

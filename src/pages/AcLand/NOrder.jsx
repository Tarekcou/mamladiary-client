import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../../provider/AuthProvider";
import { districts } from "../../data/districts";
import { mamlaNames } from "../../data/mamlaNames";



const NewOrderAcLand = () => {
  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

  const [formData, setFormData] = useState({
    orderDate: today,
    district: "",
    mamlaName: "",
    mamlaNo: "",
    year: 2025,
    orderDetails: "",
    uploadedTo: "adcOffice",
    actionsTaken: [
      { type: "text", value: "" }
    ]// for multiple entries
  });
  const {
  isSignedIn,
  signOut,
  isDivComLogin,
  isAcLandLogin,
  isAdcLogin,
  user,
  isNagorikLogin,
} = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().split("").map((d) => banglaDigits[d] || d).join("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setFormData((prev) => ({ ...prev, year }));
  };

  const handleActionChange = (index, key, value) => {
    const updatedActions = [...formData.actionsTaken];
    updatedActions[index][key] = value;
    setFormData({ ...formData, actionsTaken: updatedActions });
  };

  const addActionField = () => {
    setFormData({
      ...formData,
      actionsTaken: [...formData.actionsTaken, { type: "text", value: "" }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Order:", formData);
    toast.success("নতুন আদেশ সফলভাবে প্রেরণ করা হয়েছে");
    // navigate("/dashboard/acLand/allOrders");
  };

  return (
    <div className="max-w-2xl mx-auto bg-base-200 shadow p-6 rounded">
      <h2 className="text-xl font-semibold mb-4">নতুন আদেশ তৈরি</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* District & Mamla Name */}
        <div className="grid grid-cols-2 gap-4">
          <label>
            {t("district")}:
            <select
              name="district"
              required
              value={formData.district}
              onChange={handleChange}
              className="bg-gray-100 mt-1 w-full select-bordered select"
            >
              <option value="">{t("select district")}</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label>
            {t("mamla name")}:
            <select
              name="mamlaName"
              required
              value={formData.mamlaName}
              onChange={handleChange}
              className="bg-gray-100 mt-1 w-full select-bordered select"
            >
              <option value="">{t("select mamla name")}</option>
              {mamlaNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <label>
            {t("case number")}:
            <input
              name="mamlaNo"
              type="text"
              value={formData.mamlaNo}
              onChange={handleChange}
              className="bg-gray-100 input-bordered w-full input"
            />
          </label>

          <label>
            {t("year")}:
            <select
              name="year"
              value={formData.year}
              onChange={handleYearChange}
              className="bg-gray-100 w-full select-bordered select"
            >
              <option value="">{t("Select Year")}</option>
              {Array.from({ length: 50 }, (_, i) => {
                const year = 2000 + i;
                return (
                  <option key={year} value={year}>
                    {toBanglaNumber(year)}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        {/* Order Date */}
        <div>
          <label className="block font-medium">আদেশের তারিখ</label>
          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Order Content */}
        <div>
          <label className="block font-medium">আদেশ</label>
          <textarea
            name="orderDetails"
            rows="5"
            value={formData.orderDetails}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Dynamic আদেশের উপর গৃহীত ব্যবস্থা */}
        <div>
      <label className="block font-medium mb-2">আদেশের উপর গৃহীত ব্যবস্থা</label>
      {formData.actionsTaken.map((action, index) => (
        <div key={index} className="mb-4 rounded bg-gray-50">
          <div className="mb-2">
            {/* <label className="block text-sm font-semibold mb-1">
              ব্যবস্থা {toBanglaNumber(index + 1)} এর ধরণ
            </label> */}
            <select
              value={action.type}
              onChange={(e) => handleActionChange(index, "type", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="text">বিস্তারিত ব্যবস্থা</option>
              <option value="numberDate">নতুন নম্বর ও তারিখ</option>
            </select>
          </div>

          {/* Render based on type */}
          {action.type === "text" && (
            <textarea
              value={action.value}
              onChange={(e) => handleActionChange(index, "value", e.target.value)}
              placeholder={`ব্যবস্থা `}
              className="textarea textarea-bordered w-full"
              rows="4"
            />
          )}

          {action.type === "numberDate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                className="input input-bordered"
                placeholder="নতুন আদেশ নম্বর"
                value={action.newOrderNumber || ""}
                onChange={(e) => handleActionChange(index, "newOrderNumber", e.target.value)}
              />
              <input
                type="date"
                className="input input-bordered"
                value={action.newOrderDate || ""}
                onChange={(e) => handleActionChange(index, "newOrderDate", e.target.value)}
              />
            </div>
          )}
        </div>
      ))}

      {/* <button
        type="button"
        className="btn btn-sm btn-outline mt-2"
        onClick={addActionField}
      >
        নতুন ব্যবস্থা যুক্ত করুন
      </button> */}
    </div>

        {/* Upload To */}
        <div>
          <label className="block font-medium">প্রেরণ করুন</label>
          <select
            name="uploadedTo"
            value={formData.uploadedTo}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="adcOffice">জেলা প্রশাসকের কার্যালয়, {user.district.bn}</option>
            <option value="divComOffice">বিভাগীয় কমিশনার অফিসে</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          প্রেরণ করুন
        </button>
      </form>
    </div>
  );
};

export default NewOrderAcLand;

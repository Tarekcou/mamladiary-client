import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { AuthContext } from "../../provider/AuthProvider";
import { mamlaNames } from "../../data/mamlaNames";
import axiosPublic from "../../axios/axiosPublic";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { useQueryClient } from "@tanstack/react-query";

const AddAdcOrder = () => {
  const { state } = useLocation();
  const caseData = state?.caseData;
  const mode = state?.mode || "edit";
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const today = new Date().toISOString().split("T")[0];
  const queryClient = useQueryClient();

  const existingData =
    caseData?.caseStages?.[0]?.[user.role] ||
    caseData?.caseStages?.[0]?.[caseData.currentStage.stage] ||
    {};

  const fixedFields = {
    mamlaName: existingData.mamlaName || "",
    mamlaNo: existingData.mamlaNo || "",
    year: existingData.year || new Date().getFullYear(),
    district: existingData.district || user.district,
  };
  // console.log(existingData);

  // ✅ Initialize form data with ALL existing orders (or one blank)
  const [formData, setFormData] = useState({
    userId: user._id,
    role: user.role,
    ...fixedFields,
    officeName: user.officeName,
    orderSheets:
      mode === "edit" && existingData?.orderSheets?.length > 0
        ? [...existingData.orderSheets]
        : [
            {
              date: today,
              order: "",
              actionTaken: "",
              remarks: "",
            },
          ],
    remarks: mode === "edit" ? existingData.remarks || "" : "",
  });

  // ✅ Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.orderSheets];
      updated[index][field] = value;
      return { ...prev, orderSheets: updated };
    });
  };

  const addOrder = () => {
    setFormData((prev) => ({
      ...prev,
      orderSheets: [
        ...prev.orderSheets,
        { date: today, order: "", actionTaken: "", remarks: "" },
      ],
    }));
  };

  const removeOrder = (index) => {
    setFormData((prev) => {
      const updated = [...prev.orderSheets];
      updated.splice(index, 1);
      return { ...prev, orderSheets: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "সব পরিবর্তন ডাটাবেজে সংরক্ষিত হবে।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, আপডেট করুন",
    });

    if (!confirm.isConfirmed) return;

    const caseStageKey = user.role;
    const submittedAt = new Date().toISOString();

    const previousStages = caseData?.caseStages?.[0] || {};
    const previousRoleStage = previousStages[caseStageKey] || {};

    // ✅ Full overwrite of orderSheets with current state
    let newStage;
    if (mode === "add") {
      newStage = {
        ...existingData,
        userId: user._id,
        role: user.role,
        mamlaName: formData.mamlaName,
        mamlaNo: formData.mamlaNo,
        year: formData.year,
        district: formData.district,
        officeName: user.officeName,
        orderSheets: [
          ...(existingData.orderSheets || []),
          ...formData.orderSheets,
        ], // append
        remarks: formData.remarks,
        submittedAt: submittedAt,
      };
    } else {
      // edit mode
      newStage = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };
    }

    const updatedCaseStages = {
      ...previousStages,
      [caseStageKey]: newStage,
    };

    const updatedPayload = {
      caseStages: [updatedCaseStages],
    };

    try {
      const res = await axiosPublic.patch(
        `/cases/${caseData._id}?district=${user.district.en}`,
        updatedPayload
      );

      if (res.data.modifiedCount > 0) {
        toast.success("আপডেট সফল হয়েছে!");
        // ✅ Invalidate cached data
        queryClient.invalidateQueries(["allCases"]);

        queryClient.invalidateQueries(["caseDetails", caseData._id]);
        navigate(`/dashboard/${user.role}/cases/${caseData._id}`, {
          state: user.role,
        });
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("আপডেট ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="bg-base-200 shadow mx-auto p-6 rounded max-w-2xl">
      <h2 className="mb-4 font-semibold text-xl">আদেশপত্র ব্যবস্থাপনা</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* District & Mamla Info */}
        <div className="gap-4 grid grid-cols-2">
          <label>
            জেলা:
            <input
              name="district"
              type="text"
              value={formData.district?.bn || ""}
              readOnly={mode === "add"} // <--
              className="bg-gray-100 input-bordered w-full input"
            />
          </label>

          <label>
            মামলার ধরন:
            <select
              name="mamlaName"
              value={formData.mamlaName}
              onChange={handleChange}
              readOnly={mode === "add"} // <--
              className="bg-gray-100 mt-1 w-full select-bordered select"
              required
            >
              <option value="">নির্বাচন করুন</option>
              {mamlaNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            মামলা নং:
            <input
              name="mamlaNo"
              type="number"
              value={formData.mamlaNo}
              onChange={handleChange}
              readOnly={mode === "add"} // <--
              className="bg-gray-100 input-bordered w-full input"
              required
            />
          </label>

          <label>
            সাল:
            <select
              name="year"
              value={toBanglaNumber(formData.year)}
              onChange={handleChange}
              readOnly={mode === "add"} // <--
              className="bg-gray-100 input-bordered w-full input"
            >
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

        {/* Order Sheets */}
        <div>
          <h3 className="mb-2 font-semibold">আদেশপত্রসমূহ</h3>
          {formData.orderSheets.map((order, idx) => (
            <div key={idx} className="bg-white mb-4 p-3 border rounded-md">
              <input
                type="date"
                value={order.date}
                onChange={(e) => handleOrderChange(idx, "date", e.target.value)}
                className="mb-2 input-bordered w-full input"
              />
              <textarea
                rows="5"
                value={order.order}
                onChange={(e) =>
                  handleOrderChange(idx, "order", e.target.value)
                }
                placeholder="আদেশ"
                className="mb-2 textarea-bordered w-full textarea"
              />
              <textarea
                rows="3"
                value={order.actionTaken}
                onChange={(e) =>
                  handleOrderChange(idx, "actionTaken", e.target.value)
                }
                placeholder="গৃহীত ব্যবস্থা"
                className="mb-2 textarea-bordered w-full textarea"
              />
              <textarea
                rows="2"
                value={order.remarks || ""}
                onChange={(e) =>
                  handleOrderChange(idx, "remarks", e.target.value)
                }
                placeholder="মন্তব্য"
                className="mb-2 textarea-bordered w-full textarea"
              />

              <button
                type="button"
                onClick={() => removeOrder(idx)}
                className="btn btn-error btn-xs"
              >
                মুছে ফেলুন
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOrder}
            className="btn-outline btn btn-sm"
          >
            নতুন আদেশ যোগ করুন
          </button>
        </div>

        {/* Remarks */}
        <div>
          <label className="block font-medium">সামগ্রিক মন্তব্য</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="textarea-bordered w-full textarea"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="mt-4 w-full btn btn-primary">
          {mode == "edit" ? "আপডেট করুন" : "নতুন আদেশ যুক্ত করুন"}
        </button>
      </form>
    </div>
  );
};

export default AddAdcOrder;

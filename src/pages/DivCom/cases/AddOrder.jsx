import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { AuthContext } from "../../../provider/AuthProvider";
import { mamlaNames } from "../../../data/mamlaNames";
import axiosPublic from "../../../axios/axiosPublic";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";

const AddOrder = () => {
  const { state } = useLocation();
  const caseData = state?.caseData;
  console.log(state.caseData);
  const id = state?.id;
  const mode = state?.mode || "edit";
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];
  const queryClient = useQueryClient();

  const [badi, setBadi] = useState(
    caseData?.nagorikSubmission?.badi?.length > 0
      ? caseData.nagorikSubmission.badi.map((b) => ({
          badiName: b.name,
          badiPhone: b.phone,
          badiAddress: b.address,
        }))
      : [{ badiName: "", badiPhone: "", badiAddress: "" }]
  );

  const [bibadi, setBibadi] = useState(
    caseData?.nagorikSubmission?.bibadi?.length > 0
      ? caseData.nagorikSubmission.bibadi.map((b) => ({
          bibadiName: b.name,
          bibadiPhone: b.phone,
          bibadiAddress: b.address,
        }))
      : [{ bibadiName: "", bibadiPhone: "", bibadiAddress: "" }]
  );
  const [formNo, setFormNo] = useState();
  const [formData, setFormData] = useState({
    userId: user._id,
    role: user.role,
    badi: badi,
    bibadi: bibadi,
    mamlaName: caseData?.divComReview?.mamlaName || "",
    mamlaNo: caseData?.divComReview?.mamlaNo || "",
    year: caseData?.divComReview?.year || new Date().getFullYear(),
    district: caseData?.divComReview?.district || user.district,
    officeName: user.officeName,
    formNo: formNo,
    orderSheets: [
      {
        date: today,

        orderNo: "",
        order: "",
        actionTaken: "",
        remarks: "",
      },
    ],
    remarks: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, badi, bibadi }));
  }, [badi, bibadi]);

  const handleBadiChange = (index, field, value) => {
    const updated = [...badi];
    updated[index][field] = value;
    setBadi(updated);
  };

  const handleBibadiChange = (index, field, value) => {
    const updated = [...bibadi];
    updated[index][field] = value;
    setBibadi(updated);
  };

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

    const submittedAt = new Date().toISOString();

    const newOrderSheets = formData.orderSheets.map((order) => ({
      orderNo: order.orderNo,
      order: order.order,
      date: order.date,
      actionTaken: order.actionTaken,
      remarks: order.remarks,
    }));

    let updatedPayload = {};

    if (user.role === "divCom") {
      updatedPayload.divComReview = {
        mamlaName: formData.mamlaName,
        mamlaNo: formData.mamlaNo,
        year: formData.year,
        district: formData.district,
        formNo: formData.formNo,
        submittedAt,
        orderSheets: newOrderSheets,
      };
    } else {
      updatedPayload.responsesFromOffices = [
        {
          role: user.role,
          officeName: user.officeName,
          district: user.district,
          submittedAt,
          mamlaName: formData.mamlaName,
          mamlaNo: formData.mamlaNo,
          year: formData.year,
          formNo: formData.formNo,
          orderSheets: newOrderSheets,
          remarks: formData.remarks || "সম্পূর্ণ তথ্য প্রদান করা হয়েছে",
        },
      ];
    }

    try {
      const res = await axiosPublic.patch(
        `/cases/${caseData._id}`,
        updatedPayload
      );

      if (res.data.modifiedCount > 0) {
        toast.success("আপডেট সফল হয়েছে!");
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

  const removeOrder = (index) => {
    setFormData((prev) => {
      const updatedOrders = [...prev.orderSheets];
      updatedOrders.splice(index, 1);
      return { ...prev, orderSheets: updatedOrders };
    });
  };

  return (
    <div className="bg-base-200 shadow mx-auto p-6 rounded max-w-2xl">
      <h2 className="mb-4 font-semibold text-xl">আদেশপত্র ব্যবস্থাপনা</h2>

      {/* Applicants বাদি */}
      <div>
        <h3 className="mb-2 font-semibold">আবেদনকারীগণ</h3>
        {badi.map((app, idx) => (
          <div key={idx} className="gap-2 grid grid-cols-1 md:grid-cols-3 mb-4">
            <input
              type="text"
              value={app.badiName}
              placeholder="বাদি"
              className="input-bordered input"
              onChange={(e) =>
                handleBadiChange(idx, "badiName", e.target.value)
              }
            />
            <input
              type="text"
              value={app.badiPhone}
              placeholder="ফোন"
              className="input-bordered input"
              onChange={(e) =>
                handleBadiChange(idx, "badiPhone", e.target.value)
              }
            />
            <input
              type="text"
              value={app.badiAddress}
              placeholder="ঠিকানা"
              className="input-bordered input"
              onChange={(e) =>
                handleBadiChange(idx, "badiAddress", e.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="mb-4 btn-outline btn btn-sm"
          onClick={() =>
            setBadi([...badi, { badiName: "", badiPhone: "", badiAddress: "" }])
          }
        >
          <Plus /> বাদি
        </button>
      </div>
      <div>
        {/* <h3 className="mb-2 font-semibold">আবেদনকারীগণ</h3> */}
        {bibadi.map((app, idx) => (
          <div key={idx} className="gap-2 grid grid-cols-1 md:grid-cols-3 mb-4">
            <input
              type="text"
              value={app.bibadiName}
              placeholder="বিবাদি"
              className="input-bordered input"
              onChange={(e) =>
                handleBibadiChange(idx, "bibadiName", e.target.value)
              }
            />
            <input
              type="text"
              value={app.bibadiPhone}
              placeholder="ফোন"
              className="input-bordered input"
              onChange={(e) =>
                handleBibadiChange(idx, "bibadiPhone", e.target.value)
              }
            />
            <input
              type="text"
              value={app.bibadiAddress}
              placeholder="ঠিকানা"
              className="input-bordered input"
              onChange={(e) =>
                handleBibadiChange(idx, "bibadiAddress", e.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="mb-4 btn-outline btn btn-sm"
          onClick={() =>
            setBibadi([
              ...bibadi,
              { bibadiName: "", bibadiPhone: "", bibadiAddress: "" },
            ])
          }
        >
          <Plus /> বিবাদি
        </button>
      </div>
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
              readOnly={mode === "edit"} // <--
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
              readOnly={mode === "edit"} // <--
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
              readOnly={mode === "edit"} // <--
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
          <input
            type="text"
            placeholder="ফর্ম নম্বর"
            value={formData.formNo}
            onChange={(e) => setFormNo(e.target.value)}
            className="mb-2 input-bordered w-full input"
          />
          <h3 className="mb-2 font-semibold">আদেশপত্র</h3>
          {formData.orderSheets.map((order, idx) => (
            <div key={idx} className="bg-white mb-4 p-3 border rounded-md">
              <div>
                <input
                  type="date"
                  value={order.date}
                  onChange={(e) =>
                    handleOrderChange(idx, "date", e.target.value)
                  }
                  className="mb-2 input-bordered w-full input"
                />
                <input
                  type="number"
                  placeholder="আদেশ নম্বর"
                  value={order.orderNo}
                  onChange={(e) =>
                    handleOrderChange(idx, "orderNo", e.target.value)
                  }
                  className="mb-2 input-bordered w-full input"
                />
              </div>

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
          {/* <button
            type="button"
            onClick={addOrder}
            className="btn-outline btn btn-sm"
          >
            নতুন আদেশ যোগ করুন
          </button> */}
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

export default AddOrder;

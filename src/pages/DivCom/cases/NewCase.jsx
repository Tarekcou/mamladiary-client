import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AuthContext } from "../../../provider/AuthProvider";
import axiosPublic from "../../../axios/axiosPublic";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";
import { mamlaNames } from "../../../data/mamlaNames";

const NewCase = () => {
  const { state } = useLocation();
  const caseData = state?.caseData;
  const id = state?.id;
  const { user } = useContext(AuthContext);
  const isEditMode = !!caseData;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialDocuments = [{ label: "", url: "" }];
  const initialOrderSheets = [{ date: "", order: "", actionTaken: "" }];

  const [formData, setFormData] = useState({
    mamlaName: "",
    mamlaNo: "",
    year: "",
    caseHistory: "",
  });

  const [documents, setDocuments] = useState(initialDocuments);
  const [orderSheets, setOrderSheets] = useState(initialOrderSheets);
  const [selectedCaseName, setSelectedCaseName] = useState("");

  useEffect(() => {
    if (isEditMode && caseData) {
      const entry =
        caseData?.responsesFromOffices?.[0]?.mamlaEntries?.[0] || {};
      setFormData({
        mamlaName: entry.mamlaName || "",
        mamlaNo: entry.mamlaNo || "",
        year: entry.year || "",
        caseHistory: entry.caseHistory || "",
      });
      setDocuments(entry.documents || initialDocuments);
      setOrderSheets(entry.orderSheets || initialOrderSheets);
      setSelectedCaseName(entry.mamlaName || "");
    }
  }, [isEditMode, caseData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (index, field, value) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  const handleOrderChange = (index, field, value) => {
    const updated = [...orderSheets];
    updated[index][field] = value;
    setOrderSheets(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const responsePayload = {
      responsesFromOffices: [
        {
          role: user.role,
          officeName: user?.officeName,
          district: user?.district,
          mamlaEntries: [
            {
              mamlaName: formData.mamlaName,
              mamlaNo: formData.mamlaNo,
              year: formData.year,
              caseHistory:
                selectedCaseName === "মিস কেইস"
                  ? undefined
                  : formData.caseHistory,
              remarks: "সম্পূর্ণ তথ্য প্রদান করা হয়েছে",
              documents,
              ...(selectedCaseName === "মিস কেইস" && { orderSheets }),
            },
          ],
        },
      ],
    };
    console.log(
      "🔍 Final response payload:",
      JSON.stringify(responsePayload, null, 2)
    );
    try {
      const res = await axiosPublic.patch(`/cases/${id}`, responsePayload);
      console.log(res.data);
      if (res.status === 200) {
        toast.success("রেসপন্স সফলভাবে সাবমিট হয়েছে!");
        navigate(`/dashboard/acLand/allCases`);
      }
    } catch (err) {
      console.error(err);
      toast.error("রেসপন্স সাবমিট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow mx-auto p-6 rounded-xl max-w-4xl"
    >
      <h2 className="mb-4 font-bold text-xl">
        {isEditMode ? "মামলা সম্পাদনা করুন" : "নতুন মামলা তথ্য যুক্ত করুন"}
      </h2>

      <div className="gap-4 grid grid-cols-2 mb-5">
        <label>
          {t("district")}:
          <input
            readOnly
            value={user?.district?.bn || ""}
            className="bg-gray-100 mt-1 input-bordered w-full input"
          />
        </label>

        <label>
          {t("মামলার নাম")}:
          <select
            value={formData.mamlaName}
            onChange={(e) => {
              handleChange("mamlaName", e.target.value);
              setSelectedCaseName(e.target.value);
            }}
            className="bg-gray-100 mt-1 w-full select-bordered select"
          >
            <option value="">{t("select mamla name")}</option>
            {mamlaNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t("case number")}:
          <input
            type="number"
            value={formData.mamlaNo}
            onChange={(e) => handleChange("mamlaNo", e.target.value)}
            className="bg-gray-100 input-bordered w-full input"
          />
        </label>

        <label>
          {t("year")}:
          <select
            value={formData.year}
            onChange={(e) => handleChange("year", e.target.value)}
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

      {selectedCaseName && selectedCaseName !== "মিস কেইস" && (
        <>
          <label className="block mb-4">
            <textarea
              className="textarea-bordered w-full h-48 resize-none textarea"
              placeholder="মামলার ইতিহাস লিখুন..."
              value={formData.caseHistory}
              onChange={(e) => handleChange("caseHistory", e.target.value)}
            />
          </label>
        </>
      )}

      <div className="mt-6">
        <h3 className="mb-2 font-semibold">ডকুমেন্টস</h3>
        {documents.map((doc, idx) => (
          <div key={idx} className="gap-2 grid grid-cols-2 mb-2">
            <input
              type="text"
              value={doc.label}
              placeholder="লেবেল"
              className="input-bordered input"
              onChange={(e) =>
                handleDocumentChange(idx, "label", e.target.value)
              }
            />
            <input
              type="text"
              value={doc.url}
              placeholder="URL"
              className="input-bordered input"
              onChange={(e) => handleDocumentChange(idx, "url", e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn-outline btn btn-sm"
          onClick={() => setDocuments([...documents, { label: "", url: "" }])}
        >
          নতুন ডকুমেন্ট
        </button>
      </div>

      {selectedCaseName === "মিস কেইস" && (
        <div className="mt-6">
          <h3 className="mb-2 font-semibold">আদেশপত্রসমূহ</h3>
          {orderSheets.map((order, idx) => (
            <div key={idx} className="mb-4 p-3 border rounded-md">
              <input
                type="date"
                className="mb-2 input-bordered w-full input"
                value={order.date}
                onChange={(e) => handleOrderChange(idx, "date", e.target.value)}
              />
              <textarea
                className="mb-2 textarea-bordered w-full textarea"
                placeholder="আদেশের বিবরণ"
                value={order.order}
                onChange={(e) =>
                  handleOrderChange(idx, "order", e.target.value)
                }
              />
              <textarea
                className="textarea-bordered w-full textarea"
                placeholder="গৃহীত কার্যক্রম"
                value={order.actionTaken || ""}
                onChange={(e) =>
                  handleOrderChange(idx, "actionTaken", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="btn-outline btn btn-sm"
            onClick={() =>
              setOrderSheets([
                ...orderSheets,
                { date: "", order: "", actionTaken: "" },
              ])
            }
          >
            নতুন আদেশপত্র
          </button>
        </div>
      )}

      <button type="submit" className="mt-6 w-full btn btn-primary">
        {isEditMode ? "আপডেট করুন" : "মামলা সাবমিট করুন"}
      </button>
    </form>
  );
};

export default NewCase;

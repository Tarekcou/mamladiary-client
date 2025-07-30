import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../provider/AuthProvider";
import { toast } from "sonner";
import axiosPublic from "../../axios/axiosPublic";
import { Plus } from "lucide-react";
import { toBanglaNumber } from "../../utils/toBanglaNumber";
import { mamlaNames } from "../../data/mamlaNames";

const NewCase = () => {
  const { state } = useLocation();
  const caseData = state?.caseData;
  const { user } = useContext(AuthContext);
  const isEditMode = !!caseData;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialBadi = [{ name: "", phone: "", address: "" }];
  const initialBibadi = [{ name: "", phone: "", address: "" }];
  const initialDocuments = [{ label: "", url: "" }];
  const initialOrderSheets = [{ date: "", order: "", actionTaken: "" }];

  const initialFormData = (user) => ({
    trackingNo: Math.floor(10000 + Math.random() * 90000).toString(),

    currentStage: {
      stage: user.role,
      status: `${user.officeName.bn} ভূমি অফিস`,
      officeName: user.officeName,
      district: user.district,
    },
    caseInitiate: [
      {
        officeName: user.officeName,
        district: user.district,
        role: user.role,
        mamlaName: "",
        mamlaNo: "",
        year: "",
        caseHistory: "",
      },
    ],
    caseStages: [
      {
        [user.role]: {
          userId: user._id,
          role: user.role,
          badi: [],
          bibadi: [],
          mamlaName: "",
          mamlaNo: "",
          year: "",
          district: user.district,
          officeName: user.officeName,
          caseHistory: "",
          documents: [],
          orderSheets: [],
          submittedAt: null,
        },
      },
    ],
  });

  const [formData, setFormData] = useState(initialFormData(user));
  const [badi, setBadi] = useState(initialBadi);
  const [bibadi, setBibadi] = useState(initialBibadi);
  const [documents, setDocuments] = useState(initialDocuments);
  const [orderSheets, setOrderSheets] = useState(initialOrderSheets);
  const [selectedCaseName, setSelectedCaseName] = useState("");

  // ✅ Edit Mode Data Load
  useEffect(() => {
    if (isEditMode && caseData) {
      const roleKey = user.role;
      const existingStage = caseData.caseStages?.[0]?.[roleKey] || {};

      setFormData((prev) => {
        const updated = {
          ...prev,
          ...caseData,
        };

        // update caseInitiate first element
        if (updated.caseInitiate?.[0]) {
          updated.caseInitiate[0] = {
            ...updated.caseInitiate[0],
            mamlaName: existingStage.mamlaName || "",
            mamlaNo: existingStage.mamlaNo || "",
            year: existingStage.year || "",
            caseHistory: existingStage.caseHistory || "",
          };
        }

        return updated;
      });

      setBadi(caseData.badi || initialBadi);
      setBibadi(caseData.bibadi || initialBibadi);
      setDocuments(existingStage.documents || initialDocuments);
      setOrderSheets(existingStage.orderSheets || initialOrderSheets);
      setSelectedCaseName(existingStage.mamlaName || "");
    }
  }, [isEditMode, caseData, user.role]);

  // ✅ Helpers
  const handleCaseInitiateChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.caseInitiate[0] = {
        ...updated.caseInitiate[0],
        [field]: value,
      };
      return updated;
    });
  };

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

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roleKey = user.role;
    const timestamp = new Date().toISOString();

    const previousStages =
      formData.caseStages?.[0] || caseData?.caseStages?.[0] || {};
    const previousRoleStage = previousStages[roleKey] || {};

    const newStage = {
      ...previousRoleStage,
      userId: user._id,
      role: user.role,
      badi,
      bibadi,
      mamlaName: formData.caseInitiate[0].mamlaName,
      mamlaNo: formData.caseInitiate[0].mamlaNo,
      year: formData.caseInitiate[0].year,
      district: user.district,
      initialOfficeName: user.officeName,
      documents,
      orderSheets:
        selectedCaseName === "মিস কেইস"
          ? orderSheets
          : previousRoleStage.orderSheets || [],
      submittedAt: timestamp,
      caseHistory: formData.caseInitiate[0].caseHistory,
    };

    const payload = {
      ...formData,

      caseStages: [{ ...previousStages, [roleKey]: newStage }],
    };

    try {
      if (isEditMode) {
        const res = await axiosPublic.patch(
          `/cases/${caseData._id}?district=${user.district.en}`,
          payload
        );
        if (res.status === 200) {
          toast.success("মামলার তথ্য হালনাগাদ হয়েছে!");
          navigate(`/dashboard/acLand/allCases`);
        }
      } else {
        const res = await axiosPublic.post("/cases", payload);
        if (res.data.insertedId) {
          toast.success("মামলা সফলভাবে জমা হয়েছে!");
          setFormData(initialFormData(user));
          setBadi(initialBadi);
          setBibadi(initialBibadi);
          setDocuments(initialDocuments);
          setOrderSheets(initialOrderSheets);
          setSelectedCaseName("");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow mx-auto p-6 rounded-xl max-w-4xl"
    >
      <h2 className="mb-4 font-bold text-xl">
        {isEditMode ? "মামলা সম্পাদনা করুন" : "নতুন মামলা শুরু করুন"}
      </h2>

      {/* Applicants বাদি */}
      <div>
        <h3 className="mb-2 font-semibold">আবেদনকারীগণ</h3>
        {badi.map((app, idx) => (
          <div key={idx} className="gap-2 grid grid-cols-1 md:grid-cols-3 mb-4">
            <input
              type="text"
              value={app.name}
              placeholder="বাদি"
              className="input-bordered input"
              onChange={(e) => handleBadiChange(idx, "name", e.target.value)}
            />
            <input
              type="text"
              value={app.phone}
              placeholder="ফোন"
              className="input-bordered input"
              onChange={(e) => handleBadiChange(idx, "phone", e.target.value)}
            />
            <input
              type="text"
              value={app.adress}
              placeholder="ঠিকানা"
              className="input-bordered input"
              onChange={(e) => handleBadiChange(idx, "address", e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="mb-4 btn-outline btn btn-sm"
          onClick={() =>
            setBadi([...badi, { name: "", phone: "", address: "" }])
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
              value={app.name}
              placeholder="বিবাদি"
              className="input-bordered input"
              onChange={(e) => handleBibadiChange(idx, "name", e.target.value)}
            />
            <input
              type="text"
              value={app.phone}
              placeholder="ফোন"
              className="input-bordered input"
              onChange={(e) => handleBibadiChange(idx, "phone", e.target.value)}
            />
            <input
              type="text"
              value={app.address}
              placeholder="ঠিকানা"
              className="input-bordered input"
              onChange={(e) =>
                handleBibadiChange(idx, "address", e.target.value)
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

      {/* Mamla Info */}
      <div className="gap-4 grid grid-cols-2 mb-5">
        <label>
          {t("district")}:
          <input
            readOnly
            value={formData?.currentStage?.district?.bn || ""}
            className="bg-gray-100 mt-1 input-bordered w-full input"
          />
        </label>

        <label>
          {t("মামলার নাম")}:
          <select
            value={formData.caseInitiate[0].mamlaName}
            onChange={(e) => {
              handleCaseInitiateChange("mamlaName", e.target.value);
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
            value={formData.caseInitiate[0].mamlaNo}
            onChange={(e) =>
              handleCaseInitiateChange("mamlaNo", e.target.value)
            }
            className="bg-gray-100 input-bordered w-full input"
          />
        </label>

        <label>
          {t("year")}:
          <select
            value={formData.caseInitiate[0].year}
            onChange={(e) => handleCaseInitiateChange("year", e.target.value)}
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

      <label className="block mb-4">
        <textarea
          className="textarea-bordered w-full h-48 resize-none textarea"
          placeholder="মামলার ইতিহাস লিখুন..."
          value={formData.caseInitiate[0].caseHistory}
          onChange={(e) =>
            handleCaseInitiateChange("caseHistory", e.target.value)
          }
        />
      </label>

      {/* Documents */}
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

      {/* Order Sheets */}
      {(selectedCaseName === "মিস কেইস" || isEditMode) && (
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

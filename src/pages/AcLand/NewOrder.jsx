import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // or from "react-router"
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../provider/AuthProvider";
import { toast } from "sonner";
import axiosPublic from "../../axios/axiosPublic";

// Make sure to import or define AuthContext
// import { AuthContext } from "path-to-auth-context";

const mamlaNames = [
  "সার্টিফিকেট আপিল",
  "নামজারি আপিল",
  "মিস কেইস"
  // Add other mamla names here
];

const districts = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  // Add other districts here
];



const NewOrder = () => {
  const {
    isSignedIn,
    signOut,
    isDivComLogin,
    isAcLandLogin,
    isAdcLogin,
    user,
    isNagorikLogin,
  } = useContext(AuthContext);
  // console.log(user)
  const navigate = useNavigate();
  const { t } = useTranslation();
const [selectedCaseName,setSelectedCaseName]=useState("")
  // Function to generate a 5-digit numeric case id only once during initial render
  const generateNumericCaseId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

 const [formData, setFormData] = useState({
  rootCaseId: generateNumericCaseId(),
  initiatedBy: {
    userId: user._id,
    role: user.role,
    office: user.officeName,
  },
  applicants: [], // you are keeping this outside, so ignore here
  currentStage: user.role,
  status: "pending",
  caseStages: [
    {
      role: user.role,
      mamlaName: "",
      mamlaNo: "",
      year: "",
      district: "",
      office: user.officeName,
      remarks: "",
      documents: [],
      orderSheets: [],
      submittedAt: null,
    },
  ],
});


  const [applicants, setApplicants] = useState([
    { name: "", phone: "", address: "" },
  ]);
  const [documents, setDocuments] = useState([{ label: "", url: "" }]);
  const [orderSheets, setOrderSheets] = useState([
    { date: "", order: "", activities: [""] },
  ]);

  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((d) => banglaDigits[d] || d)
      .join("");
  };
  // Generic form input change handler for formData
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Specific handler for year because it may need special handling (if any)
  const handleYearChange = (e) => {
    const year = e.target.value;
    setFormData((prev) => ({ ...prev, year }));
  };

  // Handler for actions inside orderSheets (if needed)
  const handleActionChange = (index, key, value) => {
    const updatedActions = [...formData.actionsTaken];
    updatedActions[index][key] = value;
    setFormData({ ...formData, actionsTaken: updatedActions });
  };

  // Handlers for dynamic lists: applicants, documents, orderSheets
  const handleApplicantChange = (index, field, value) => {
    const updated = [...applicants];
    updated[index][field] = value;
    setApplicants(updated);
  };

  const handleDocumentChange = (index, field, value) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  const handleOrderChange = (index, field, value) => {
    const updated = [...orderSheets];
    if (field === "activities") {
      updated[index].activities = value
        .split("\n")
        .filter((item) => item.trim() !== "");
    } else {
      updated[index][field] = value;
    }
    setOrderSheets(updated);
  };

const handleStageChange = (field, value) => {
  setFormData((prev) => {
    const updatedStages = [...prev.caseStages];
    updatedStages[0] = {
      ...updatedStages[0],
      [field]: value,
    };
    return {
      ...prev,
      caseStages: updatedStages,
    };
  });
};

  //submit the form
const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare updated stage with documents and orders and submission time
  const updatedStage = {
    ...formData.caseStages[0],
    documents,
    orderSheets,
    submittedAt: new Date().toISOString(),
  };

  const payload = {
    rootCaseId: formData.rootCaseId,
    initiatedBy: formData.initiatedBy,
    applicants, // from your separate state
    currentStage: formData.currentStage,
    status: formData.status,
    caseStages: [updatedStage],
  };

  try {
    const response = await axiosPublic.post("/cases",payload);
    console.log(response.data)

    if (response.insertedId) {
        toast.success("মামলা সফলভাবে জমা হয়েছে!");
        

    }

   

    // Optionally reset form or navigate
    // navigate("/somewhere");
  } catch (error) {
    console.error(error);
        toast.success("মামলা জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  }
};



  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">নতুন মামলা শুরু করুন</h2>

      {/* Applicants */}
      <div>
        <h3 className="font-semibold mb-2">আবেদনকারীগণ</h3>
        {applicants.map((app, idx) => (
          <div
            key={idx}
            className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2"
          >
            <input
              type="text"
              name="name"
              placeholder="নাম"
              className="input input-bordered"
              value={app.name}
              onChange={(e) =>
                handleApplicantChange(idx, "name", e.target.value)
              }
            />
            <input
              type="text"
              name="phone"
              placeholder="ফোন"
              className="input input-bordered"
              value={app.phone}
              onChange={(e) =>
                handleApplicantChange(idx, "phone", e.target.value)
              }
            />
            <input
              type="text"
              name="address"
              placeholder="ঠিকানা"
              className="input input-bordered"
              value={app.address}
              onChange={(e) =>
                handleApplicantChange(idx, "address", e.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline mb-4"
          onClick={() =>
            setApplicants([...applicants, { name: "", phone: "", address: "" }])
          }
        >
          নতুন আবেদনকারী যুক্ত করুন
        </button>
      </div>

      {/* Mamla Info */}
       {/* District & Mamla Name */}
             <div className="grid grid-cols-2 gap-4 mb-5">
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
     
                   <select
  name="mamlaName"
  required
  value={formData.caseStages[0].mamlaName}
  onChange={(e) => {
    handleStageChange("mamlaName", e.target.value);
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

      <label className="block mb-4">
        <textarea
          name="caseHistory"
          className="textarea textarea-bordered w-full h-48 resize-none"
          placeholder="মামলার ইতিহাস লিখুন..."
          value={formData.caseHistory}
          onChange={handleChange}
          required
        />
      </label>

      {/* Documents */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">ডকুমেন্টস</h3>
        {documents.map((doc, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              name="label"
              placeholder="লেবেল"
              className="input input-bordered"
              value={doc.label}
              onChange={(e) => handleDocumentChange(idx, "label", e.target.value)}
            />
            <input
              type="text"
              name="url"
              placeholder="URL"
              className="input input-bordered"
              value={doc.url}
              onChange={(e) => handleDocumentChange(idx, "url", e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setDocuments([...documents, { label: "", url: "" }])}
        >
          নতুন ডকুমেন্ট
        </button>
      </div>

      {/* Order Sheets (only if selectedCaseName is "মিস কেইস") */}
      {selectedCaseName === "মিস কেইস" && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">আদেশপত্রসমূহ</h3>
          {orderSheets.map((order, idx) => (
            <div key={idx} className="mb-4 border p-3 rounded-md">
              <input
                type="date"
                className="input input-bordered mb-2 w-full"
                value={order.date}
                onChange={(e) => handleOrderChange(idx, "date", e.target.value)}
              />
              <textarea
                className="textarea textarea-bordered w-full mb-2"
                placeholder="আদেশের বিবরণ"
                value={order.order}
                onChange={(e) => handleOrderChange(idx, "order", e.target.value)}
              />
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="কার্যক্রম (একাধিক লাইন)"
                value={order.activities.join("\n")}
                onChange={(e) => handleOrderChange(idx, "activities", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() =>
              setOrderSheets([
                ...orderSheets,
                { date: "", order: "", activities: [""] },
              ])
            }
          >
            নতুন আদেশপত্র
          </button>
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-6 w-full">
        মামলা সাবমিট করুন
      </button>
    </form>
  );
};

export default NewOrder;

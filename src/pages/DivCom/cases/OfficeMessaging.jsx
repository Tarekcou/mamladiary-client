import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Modal from "../../../components/ui/modal";
import Message from "./Message";
import axiosPublic from "../../../axios/axiosPublic";
import { createPlainTextMessage } from "../../../utils/createMessage";
import { Phone, Send } from "lucide-react";

const MySwal = withReactContent(Swal);

const OfficeMessaging = ({ caseData, role }) => {
  console.log(role)
  const [showModal, setShowModal] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [sendingTo, setSendingTo] = useState("");
  console.log(caseData);

  const messages = caseData?.messagesToOffices || [];

  const sentRoles = messages.map((msg) => msg.sentTo?.role?.toLowerCase?.());
  console.log(sentRoles,messages)
  const alreadySentToAcLand = sentRoles.includes("acland");
  const alreadySentToADC = sentRoles.includes("adc");
  
  console.log(alreadySentToADC,alreadySentToAcLand)
  const badi = caseData.nagorikSubmission?.badi?.[0];
  const bibadi = caseData.nagorikSubmission?.bibadi?.[0];

  const plainTextMessage = createPlainTextMessage(
    caseData,
    sendingTo,
    badi,
    bibadi,
    caseData.divComReview?.orderSheets
  );
  const handleOpenModal = (role) => {
    const mamlaInfo =
      role === "acLand"
        ? caseData.nagorikSubmission?.aclandMamlaInfo
        : caseData.nagorikSubmission?.adcMamlaInfo;

    if (!mamlaInfo?.length) {
      Swal.fire("তথ্য নেই", "এই রোলে কোনো মামলা নেই", "warning");
      return;
    }

    setSendingTo(role);
    setMessageData(plainTextMessage); // only for WhatsApp

    setShowModal(true);
  };

  const handleSend = async () => {
    const role = sendingTo;
    const mamla =
      role === "acLand"
        ? caseData.nagorikSubmission?.aclandMamlaInfo
        : caseData.nagorikSubmission?.adcMamlaInfo;
    const payload = {
      date: new Date().toISOString(),

      sentTo: {
        role: role,
        district: mamla?.[0]?.district || {}, // fallback if not found
        officeName: mamla?.[0]?.officeName || {}, // Optional: Use default if not present
      },

      parties: {
        badiList: caseData.nagorikSubmission?.badi || [],
        bibadiList: caseData.nagorikSubmission?.bibadi || [],
      },

      mamlaList: mamla || [],
    };
   

    try {
      // DB Update
      const res = await axiosPublic.patch(`/cases/${caseData._id}`, {
        messagesToOffices: [payload], // Just send the new one, let backend `$push`
      });

      const stageKey= "divComReview"
      await axiosPublic.patch(`/cases/${caseData._id}/status`, {
        stageKey,
        status: 'messaged',
      });

      if (res.data.modifiedCount > 0) {
        MySwal.fire("সফল", "বার্তা সফলভাবে সংরক্ষণ করা হয়েছে", "success");
      }

      //  await axiosPublic.patch(`send-whatsapp`, {
      //   phone: "+88018181424256",
      //    message: payload, // Just send the new one, let backend `$push`
      //  });

      setShowModal(false);
      MySwal.fire("সফল", "বার্তা প্রেরণ করা হয়েছে", "success");
    } catch (err) {
      console.error(err);
      MySwal.fire("ত্রুটি", "বার্তা প্রেরণ ব্যর্থ হয়েছে", "error");
    }
  };

  return (
    <div className="my-10">
      <h1 className="font-bold underline">অন্য অফিসে তথ্য চেয়ে প্রেরণ:</h1>
      <div className="gap-4 flex btn-sm mt-4">
        { !alreadySentToAcLand ? (
          <button
            onClick={() => handleOpenModal("acLand")}
            className="btn btn-primary"
          >
            <Send /> এসিল্যান্ড 
          </button>
        ) : (
          <h1 className="bg-emerald-700 my-5 p-2 text-white ul">
            সহকারী কমিশনার (ভূমি) বরাবর প্রেরণ করা হয়েছে{" "}
          </h1>
        )}

        { !alreadySentToADC ? (
          <button
            onClick={() => handleOpenModal("adc")}
            className="btn btn-success"
          >
            <Send /> এডিসি 
          </button>
        ) : (
          <h1 className="bg-emerald-700 my-5 p-2 text-white ul">
            এডিসি আদালত বরাবর প্রেরণ করা হয়েছে{" "}
          </h1>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-4 p-4">
            <h2 className="font-bold text-lg text-center">
              বার্তা প্রেরণ ({sendingTo === "acLand" ? "AC Land" : "ADC"})
            </h2>

            <div className="bg-gray-50 p-4 border rounded max-h-[400px] overflow-y-auto text-gray-800">
              <Message caseData={caseData} role={sendingTo} />
            </div>

            <div className="flex justify-end gap-2">
              <button className="btn" onClick={() => setShowModal(false)}>
                বাতিল
              </button>
              <button className="btn btn-success" onClick={handleSend}>
                প্রেরণ করুন
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OfficeMessaging;

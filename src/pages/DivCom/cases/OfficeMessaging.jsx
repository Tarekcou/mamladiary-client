import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Modal from "../../../components/ui/modal";
import Message from "./Message";
import axiosPublic from "../../../axios/axiosPublic";
import { createPlainTextMessage } from "../../../utils/createMessage";
import { Check, Phone, Send } from "lucide-react";
import Tippy from "@tippyjs/react";
import { toBanglaNumber } from "../../../utils/toBanglaNumber";

const MySwal = withReactContent(Swal);

const OfficeMessaging = ({ caseData, refetch, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [sendingTo, setSendingTo] = useState("");

  const messages = caseData?.messagesToOffices || [];

  const sentRoles = messages.map((msg) => msg.sentTo?.role?.toLowerCase?.());
  const alreadySentToAcLand = sentRoles.includes("acland");
  const alreadySentToADC = sentRoles.includes("adc");

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
  const handleSMS = (mamla) => {
    const message = `অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব), চট্টগ্রাম আদালতে চলমান ${mamla.mamlaName} (${mamla.mamlaNo} নং) মামলার পরবর্তী কার্যক্রম ${mamla.nextDate} তারিখে অনুষ্ঠিত হবে।`;

    Swal.fire({
      title: "আপনি মেসেজ প্রেরণ করতে চান?",
      html: `
  <div style="text-align: left;">
    <b>প্রেরিত মেসেজঃ</b>
    <textarea id="editable-message"
      style="
        display: block;
        margin-top: 8px;
        padding: 8px;
        width: 100%;
        font-size: 14px;
        line-height: 1.4;
        border: 1px solid #ccc;
        border-radius: 4px;
        min-height: 120px;
        overflow: hidden;
        resize: vertical;
        box-sizing: border-box;
      "
    >${message}</textarea>
  </div>
`,

      showCloseButton: true,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, প্রেরণ করুন!",
      preConfirm: () => {
        const editedMessage = document.getElementById("editable-message").value;
        if (!editedMessage) {
          Swal.showValidationMessage("মেসেজ ফাঁকা রাখা যাবে না!");
          return false;
        }
        return editedMessage;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const editedMessage = result.value;

        axiosPublic
          .post("/message", {
            to: [
              ...(mamla.phoneNumbers?.badi || []),
              ...(mamla.phoneNumbers?.bibadi || []),
            ]
              .map((num) => "88" + num)
              .filter(Boolean)
              .join(","),
            message: editedMessage,
          })
          .then((res) => {
            if (res.data.result?.response_code == 202) {
              Swal.fire({
                title: "সফলতা!",
                text: "আপনার মেসেজ সফলভাবে প্রেরণ করা হয়েছে।",
                icon: "success",
              });
              refetch();
            } else if (res.data.response_code == 107) {
              Swal.fire({
                title: "সতর্কতা!",
                text: "আপনার পর্যাপ্ত ব্যালেন্স নেই।",
                icon: "warning",
              });
            } else {
              Swal.fire({
                title: "ত্রুটি!",
                text: "মেসেজ প্রেরণে সমস্যা হয়েছে।",
                icon: "error",
              });
            }
          });
      }
    });
  };
  const generateDefaultActionText = ({ role, caseList }) => {
    if (!caseList || caseList.length === 0) return "";

    return caseList
      .map((m) => {
        return `মামলা নং ${toBanglaNumber(m.mamlaNo)} (${
          m.mamlaName
        }) সংক্রান্ত ${
          role === "acland" ? "সহকারী কমিশনার (ভূমি)" : "অতিরিক্ত জেলা প্রশাসক"
        } ${m.officeName.bn}, ${m.district.bn} অফিসে ${
          new Date().toISOString().split("T")[0]
        } তারিখে তাগিদ প্রেরণ করা হয়েছে।`;
      })
      .join("\n");
  };

  const handleSend = async () => {
    const role = sendingTo;
    const mamla =
      role === "acLand"
        ? caseData.nagorikSubmission?.aclandMamlaInfo
        : caseData.nagorikSubmission?.adcMamlaInfo;
    if (!mamla || mamla.length === 0) {
      toast.error("মামলার তথ্য পাওয়া যায়নি।");
      return;
    }
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

      caseList: mamla || [],
    };
    console.log(mamla);
    //get users phone no to send whats app message
    try {
      const userRes = await axiosPublic.get("/users/specific-user", {
        params: {
          role,
          district: mamla[0].district?.en,
          officeName: mamla?.[0].officeName?.en,
        },
      });
      console.log(userRes.data[0].phone);
      // DB Up  date message sent to offfices
      const actionTakenText = generateDefaultActionText({
        role,
        caseList: mamla,
      });
      console.log(actionTakenText);
      // Patch the case:
      const res = await axiosPublic.patch(`/cases/${caseData._id}`, {
        messagesToOffices: [payload], // backend will $push
        divComReview: {
          ...caseData.divComReview,
          orderSheets: caseData.divComReview.orderSheets.map((order, idx) => {
            if (idx === index) {
              return {
                ...order,
                actionTaken: order.actionTaken
                  ? order.actionTaken + "\n" + actionTakenText
                  : actionTakenText,
              };
            }
            return order;
          }),
        },
      });
      const messageText = mamla
        .map(
          (m, i) =>
            `${i + 1}. মামলার নাম: ${m.mamlaName}, মামলা নং: ${
              m.mamlaNo
            }, বছর: ${m.year}, জেলা: ${m.district?.bn}, অফিস: ${
              m.officeName?.bn
            }`
        )
        .join("\n");

      const resmsg = await axiosPublic.post("/send-whatsapp", {
        phone: userRes.data[0]?.phone,
        message: messageText,
      });

      console.log(resmsg);

      const stageKey = "divComReview";
      await axiosPublic.patch(`/cases/${caseData._id}/status`, {
        stageKey,
        status: "messaged",
      });

      if (res.data.modifiedCount > 0) {
        MySwal.fire("সফল", "বার্তা সফলভাবে সংরক্ষণ করা হয়েছে", "success");
        refetch();
      }

      setShowModal(false);
      MySwal.fire("সফল", "বার্তা প্রেরণ করা হয়েছে", "success");
    } catch (err) {
      console.error(err);
      MySwal.fire("ত্রুটি", "বার্তা প্রেরণ ব্যর্থ হয়েছে", "error");
    }
  };

  return (
    <div className="">
      {/* <h1 className="font-bold underline">অন্য অফিসে তথ্য চেয়ে প্রেরণ:</h1> */}
      <div className="flex flex-col gap-2 btn-sm">
        {!alreadySentToAcLand ? (
          <Tippy
            content="এসিল্যান্ড আদালতে প্রেরণ করুন "
            animation="scale"
            duration={[150, 100]} // faster show/hide
          >
            <button
              onClick={() => handleOpenModal("acLand")}
              className="btn btn-primary"
            >
              <Send /> এসিল্যান্ড
            </button>
          </Tippy>
        ) : (
          <h1 className="flex bg-emerald-700 p-1 rounded-lg text-white text-xs">
            এসিল্যন্ড বরাবর প্রেরিত
          </h1>
        )}

        {!alreadySentToADC ? (
          <Tippy
            content="এডিসি আদালতে প্রেরণ করুন "
            animation="scale"
            duration={[150, 100]} // faster show/hide
          >
            <button
              onClick={() => handleOpenModal("adc")}
              className="btn btn-success"
            >
              <Send /> এডিসি
            </button>
          </Tippy>
        ) : (
          <h1 className="bg-emerald-700 p-1 rounded-lg text-white ul">
            এডিসি বরাবর প্রেরিত
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

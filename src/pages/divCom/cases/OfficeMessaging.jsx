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
import { toast } from "sonner";

const MySwal = withReactContent(Swal);

const OfficeMessaging = ({ caseData, refetch, index, mamlaNo }) => {
  const [showModal, setShowModal] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [sendingTo, setSendingTo] = useState("");
  const [comments, setComments] = useState("");
  console.log(index);
  const messages = caseData?.messagesToOffices || [];

  const sentRoles = messages.map((msg) => msg.sentTo?.role?.toLowerCase?.());
  const alreadySentToAcLand =
    caseData?.divComReview?.orderSheets?.[index]?.sentToAcland;
  const alreadySentToADC =
    caseData?.divComReview?.orderSheets?.[index]?.sentToAdc;

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
          role === "acLand" ? "সহকারী কমিশনার (ভূমি)" : "অতিরিক্ত জেলা প্রশাসক"
        } ${m.officeName.bn}, ${
          m.district.bn
        } অফিসে ${new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Dhaka",
        })} তারিখে তাগিদ প্রেরণ করা হয়েছে।`;
      })
      .join("\n");
  };
  const staffNote = caseData.divComReview?.orderSheets?.[0]?.staffNote || "N/A";
  const judgeNote = caseData.divComReview?.orderSheets?.[0]?.judgeNote || "N/A";
  // convert local BD number to WhatsApp format
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return "";
    let updated = phone.trim();

    // Remove spaces, dashes
    updated = updated.replace(/[-\s]/g, "");

    // If starts with 0 -> replace with +880
    if (updated.startsWith("0")) {
      updated = "+880" + updated.slice(1);
    }

    // If already starts with +880 -> keep as is
    else if (!updated.startsWith("+880")) {
      updated = "+880" + updated; // fallback
    }

    return updated;
  };
  const handleSend = async () => {
    if (!sendingTo) {
      toast.error("দয়া করে প্রেরণের গন্তব্য নির্বাচন করুন।");
      return;
    }

    const role = sendingTo; // 'acLand' or 'adc'
    const mamla =
      role === "acLand"
        ? caseData.nagorikSubmission?.aclandMamlaInfo.filter(
            (m) => !m?.sentToDivcom
          )
        : caseData.nagorikSubmission?.adcMamlaInfo.filter(
            (m) => !m?.sentToDivcom
          );

    if (!mamla || mamla.length === 0) {
      toast.error("মামলার তথ্য পাওয়া যায়নি।");
      return;
    }
    // const unsentMamla = mamlaInfo.filter((m) => !m?.sentToDivcom);

    const actionTakenText = generateDefaultActionText({
      role,
      caseList: mamla,
    });

    try {
      // 1️⃣ Update orderSheets
      const updatedOrderSheets = caseData?.divComReview?.orderSheets.map(
        (order, idx) => {
          if (idx === index) {
            return {
              ...order,
              actionTaken: order.actionTaken
                ? order.actionTaken + "\n" + actionTakenText
                : actionTakenText,
              ...(role === "acLand"
                ? {
                    sentToAcland: true,
                    sentToAclandDate: new Date().toISOString(),
                  }
                : {}),
              ...(role === "adc"
                ? { sentToAdc: true, sentToAdcDate: new Date().toISOString() }
                : {}),
            };
          }
          return order;
        }
      );

      // 2️⃣ For messagesToOffices
      const asArray = Array.isArray(mamla) ? mamla : [mamla];
      const updatedCaseList = asArray.map((m) => ({
        ...m,
        comments,
        staffNote,
        judgeNote,
      }));

      // 3️⃣ For nagorikSubmission.aclandMamlaInfo (only for AC Land)
      const updatedAclandMamlaInfo =
        role === "acLand"
          ? caseData?.nagorikSubmission.aclandMamlaInfo.map((m, idx) => {
              return {
                ...m,

                sentToAcland: true,
                sentToAclandDate: new Date().toISOString(),
              };
            })
          : caseData?.nagorikSubmission.aclandMamlaInfo;
      const updatedAdcMamlaInfo =
        role === "adc"
          ? caseData?.nagorikSubmission.adcMamlaInfo.map((m, idx) => {
              return {
                ...m,

                sentToAdc: true,
                sentToAdcDate: new Date().toISOString(),
              };
            })
          : caseData?.nagorikSubmission.adcMamlaInfo;

      const payload = {
        nagorikSubmission: {
          ...caseData.nagorikSubmission,
          aclandMamlaInfo: updatedAclandMamlaInfo,
          adcMamlaInfo: updatedAdcMamlaInfo,
        },
        messagesToOffices: [
          {
            date: new Date().toISOString(),
            sentTo: {
              role,
              district: mamla[0]?.district || {},
              officeName: mamla[0]?.officeName || {},
            },
            parties: {
              badiList: caseData.nagorikSubmission?.badi || [],
              bibadiList: caseData.nagorikSubmission?.bibadi || [],
            },
            comments,
            staffNote,
            judgeNote,
            caseList: mamla,
          },
        ],
        divComReview: {
          ...caseData.divComReview,
          orderSheets: updatedOrderSheets,
        },
      };
      // console.log(payload);

      const res = await axiosPublic.patch(
        `/cases/divCom/${caseData._id}`,
        payload
      );

      // Usage
      const phone = formatPhoneForWhatsApp(
        caseData.nagorikSubmission.badi[0].phone
      );

      const res2 = await axiosPublic.post("/send-whatsapp", {
        phone,
        message: actionTakenText,
      });
      console.log(res2.data);

      if (res2.data.success) {
        toast.success("বার্তা সফলভাবে প্রেরণ করা হয়েছে");
        refetch();
      } else {
        toast.error("বার্তা প্রেরণে সমস্যা হয়েছে");
      }

      setShowModal(false);
      MySwal.fire("সফল", "বার্তা প্রেরণ করা হয়েছে", "success");
    } catch (error) {
      console.error(error);
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
              className="btn btn-primary btn-sm"
            >
              <Send /> এসিল্যান্ড
            </button>
          </Tippy>
        ) : (
          ""
        )}

        {!alreadySentToADC ? (
          <Tippy
            content="এডিসি আদালতে প্রেরণ করুন "
            animation="scale"
            duration={[150, 100]} // faster show/hide
          >
            <button
              onClick={() => handleOpenModal("adc")}
              className="btn btn-success btn-sm"
            >
              <Send /> এডিসি
            </button>
          </Tippy>
        ) : (
          ""
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-4 p-4">
            <h2 className="font-bold text-lg text-center">
              বার্তা প্রেরণ ({sendingTo === "acLand" ? "AC Land" : "ADC"})
            </h2>

            <div className="bg-gray-50 p-4 border rounded max-h-[400px] overflow-y-auto text-gray-800">
              <Message caseData={caseData} role={sendingTo} index={index} />
              <div className="my-5 text-xl text-start">
                <label className="w-full text-start">
                  মন্তব্যঃ
                  <textarea
                    type="text"
                    rows={5}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="আপনার মন্তব্য দিন "
                    className="mb-4 input-bordered w-full textarea input"
                  />
                </label>
              </div>
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

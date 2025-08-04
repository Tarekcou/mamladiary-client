// utils/createMessage.js
export const createPlainTextMessage = (
  caseInfo,
  role,
  badi,
  bibadi,
  orderSheets = []
) => {
  if (!caseInfo) return "";

  const order = orderSheets?.[0]?.order || "N/A";

  const pad = (text = "", length = 20) =>
    (text + "").padEnd(length, " ").slice(0, length);

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              মামলার তথ্য (${role === "acLand" ? "এসি ল্যান্ড" : "এডিসি"})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pad("মামলার নাম")}: ${caseInfo.mamlaName}
${pad("মামলা নম্বর")}: ${caseInfo.mamlaNo} (${caseInfo.year})
${pad("জেলা")}: ${caseInfo.district}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               বাদী ও বিবাদীর তথ্য
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pad("বাদী")}: ${badi?.name || "N/A"}
${pad("ফোন")}: ${badi?.phone || "N/A"}
${pad("ঠিকানা")}: ${badi?.address || "N/A"}

${pad("বিবাদী")}: ${bibadi?.name || "N/A"}
${pad("ফোন")}: ${bibadi?.phone || "N/A"}
${pad("ঠিকানা")}: ${bibadi?.address || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 আদেশ ও অনুরোধ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pad("আদেশ বিবরণী")}: 
${order}

এই মামলার নথি যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য অনুরোধ করা হলো।

ধন্যবাদান্তে,
[আপনার নাম বা দপ্তর]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
};

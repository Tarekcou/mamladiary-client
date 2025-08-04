import React from "react";

const Message = ({ caseInfo, role }) => {
  if (!caseInfo) return null;

  const badi = caseInfo.nagorikSubmission?.badi;
  const bibadi = caseInfo.nagorikSubmission?.bibadi;

  const mamlaInfo =
    role === "acLand"
      ? caseInfo.nagorikSubmission?.aclandMamlaInfo?.[0]
      : caseInfo.nagorikSubmission?.adcMamlaInfo?.[0];

  const order = caseInfo.divComReview?.orderSheets?.[0]?.order || "N/A";

  if (!mamlaInfo)
    return <p className="text-red-600">মামলার তথ্য পাওয়া যায়নি।</p>;

  return (
    <div className="space-y-4 text-sm leading-relaxed">
      {/* মামলার তথ্য */}
      <div>
        <h3 className="pb-1 border-b font-bold text-base text-center">
          মামলার তথ্য ({role === "acLand" ? "এসি ল্যান্ড" : "এডিসি"})
        </h3>
        <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 mt-2">
          <div>মামলার নাম: {mamlaInfo.mamlaName}</div>
          <div>মামলা নম্বর: {mamlaInfo.mamlaNo}</div>
          <div>সালঃ ({mamlaInfo.year})</div>
          <div>জেলা: {mamlaInfo.district}</div>
        </div>
      </div>

      {/* বাদী ও বিবাদীর তথ্য */}
      <div>
        <h3 className="pb-1 border-b font-bold text-base text-center">
          বাদী ও বিবাদীর তথ্য
        </h3>
        <table className="gap-2 mt-2 w-full text-center">
          <table></table>
          <tr className="w-full">
            <th className="px-2 py-1 border" colSpan={3}>
              বাদী
            </th>
          </tr>
          <tr>
            <th className="px-2 py-1 border">নাম</th>
            <th className="px-2 py-1 border">ফোন</th>
            <th className="px-2 py-1 border">ঠিকানা</th>
          </tr>
          {badi.map((b, index) => (
            <tr>
              <td className="px-2 py-1 border">{b.name || "N/A"}</td>
              <td className="px-2 py-1 border">{b.phone || "N/A"}</td>
              <td className="px-2 py-1 border">{b.address || "N/A"}</td>
            </tr>
          ))}
        </table>
        <table className="gap-2 mt-2 w-full text-center">
          <tr className="w-full">
            <th className="px-2 py-1 border" colSpan={3}>
              বিবাদী
            </th>
          </tr>
          <tr>
            <th className="px-2 py-1 border">নাম</th>
            <th className="px-2 py-1 border">ফোন</th>
            <th className="px-2 py-1 border">ঠিকানা</th>
          </tr>
          {bibadi.map((b, index) => (
            <tr>
              <td className="px-2 py-1 border">{b.name || "N/A"}</td>
              <td className="px-2 py-1 border">{b.phone || "N/A"}</td>
              <td className="px-2 py-1 border">{b.address || "N/A"}</td>
            </tr>
          ))}
        </table>
      </div>

      {/* আদেশ ও অনুরোধ */}
      <div>
        <h3 className="pb-1 border-b font-bold text-base text-center">
          আদেশ ও অনুরোধ
        </h3>
        <p className="mt-2 whitespace-pre-wrap">আদেশ বিবরণী: {order}</p>
        <p className="mt-2">
          এই মামলার নথি যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য অনুরোধ করা
          হলো।
        </p>
        <p className="mt-4">ধন্যবাদান্তে,</p>
        <p>[আপনার নাম বা দপ্তর]</p>
      </div>
    </div>
  );
};

export default Message;

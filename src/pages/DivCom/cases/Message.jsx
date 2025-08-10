import React from "react";

const Message = ({ caseData, role }) => {
  if (!caseData) return null;

  const badi = caseData.nagorikSubmission?.badi;
  const bibadi = caseData.nagorikSubmission?.bibadi;

  const mamlaInfo =
    role === "acLand"
      ? caseData.nagorikSubmission?.aclandMamlaInfo
      : caseData.nagorikSubmission?.adcMamlaInfo;
  // console.log(mamlaInfo);

  const staffNote = caseData.divComReview?.orderSheets?.[0]?.staffNote || "N/A";
  const judgeNote = caseData.divComReview?.orderSheets?.[0]?.judgeNote || "N/A";

  if (!mamlaInfo)
    return <p className="text-red-600">মামলার তথ্য পাওয়া যায়নি।</p>;

  return (
    <div className="space-y-4 text-sm leading-relaxed">
      {/* মামলার তথ্য */}
      <div>
        <h3 className="pb-1 font-bold text-base text-center">
          মামলার তথ্য ({role === "acLand" ? "এসি ল্যান্ড" : "এডিসি"})
        </h3>

        <div className="border border-gray-300 overflow-x-auto">
          <table className="table table-sm mt-2">
            <thead>
              <tr className="bg-base-300">
                <th>মামলার নাম</th>
                <th>মামলা নম্বর</th>
                <th>সাল</th>
                <th>জেলা</th>
              </tr>
            </thead>
            <tbody>
              {mamlaInfo.map((mamla, i) => (
                <tr key={i}>
                  <td> {mamla.mamlaName}</td>
                  <td> {mamla.mamlaNo}</td>
                  <td> ({mamla.year})</td>
                  <td> {mamla.district.bn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* বাদী ও বিবাদীর তথ্য */}
      <div>
        <h3 className="pb-1 font-bold text-base text-center">
          বাদী ও বিবাদীর তথ্য
        </h3>
        <table className="table table-sm mt-2 border border-gray-300 w-full text-center">
          <thead>
            <tr className="w-full">
              <th className="bg-base-300" colSpan={3}>
                বাদী
              </th>
            </tr>
            <tr>
              <th className="">নাম</th>
              <th className="">ফোন</th>
              <th className="">ঠিকানা</th>
            </tr>
          </thead>
          <tbody>
            {badi.map((b, index) => (
              <tr key={index}>
                <td className="">{b.name || "N/A"}</td>
                <td className="">{b.phone || "N/A"}</td>
                <td className="">{b.address || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table table-sm gap-2 mt-2 border border-gray-200 w-full text-center">
          <thead>
            <tr className="w-full">
              <th className="bg-base-300" colSpan={3}>
                বিবাদী
              </th>
            </tr>
            <tr>
              <th className="">নাম</th>
              <th className="">ফোন</th>
              <th className="">ঠিকানা</th>
            </tr>
          </thead>
          <tbody>
            {bibadi.map((b, index) => (
              <tr key={index}>
                <td className="">{b.name || "N/A"}</td>
                <td className="">{b.phone || "N/A"}</td>
                <td className="">{b.address || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* আদেশ ও অনুরোধ */}
      <div>
        <h3 className="pb-1 border-b font-bold text-base text-center">
          আদেশ ও অনুরোধ
        </h3>
        <p className="mt-2 whitespace-pre-wrap">আদেশ বিবরণী: {staffNote}</p>
        <p className="mt-2 whitespace-pre-wrap"> {judgeNote}</p>
        <p className="mt-2">
          এই মামলার নথি যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করার জন্য অনুরোধ করা
          হলো।
        </p>
        {/* <p className="mt-4">ধন্যবাদান্তে,</p>
        <p>[আপনার নাম বা দপ্তর]</p> */}
      </div>
    </div>
  );
};

export default Message;

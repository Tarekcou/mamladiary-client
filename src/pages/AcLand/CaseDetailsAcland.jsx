const CaseDetailsAcland = ({ rootCaseId, activeStage, applicants }) => {
  return (
    <>
      <div className="gap-4 grid grid-cols-3 mb-4">
        <div className="font-semibold">Tracking ID:</div>
        <div className="col-span-2">{rootCaseId}</div>
      </div>

      {/* Applicants */}
      <div className="mb-6">
        <h1 className="mb-1 font-bold text-xl">আবেদনকারী:</h1>
        <table className="border border-gray-100 w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">নাম</th>
              <th className="p-2 border border-gray-300">মোবাইল</th>
              <th className="p-2 border border-gray-300">ঠিকানা</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app, i) => (
              <tr key={i}>
                <td className="p-2 border border-gray-300">{app.name}</td>
                <td className="p-2 border border-gray-300">{app.phone}</td>
                <td className="p-2 border border-gray-300">{app.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* mamlar tottho */}

      <div className="mb-6">
        <h1 className="mb-1 font-bold text-xl">মামলার তথ্য:</h1>
        <table className="table border border-gray-100 w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold">মামলার নাম:</td>
              <td>{activeStage.mamlaName || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold">নম্বর:</td>
              <td>{activeStage.mamlaNo || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold">বছর:</td>
              <td>{activeStage.year || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-semibold">জেলা:</td>
              <td>{activeStage.district?.bn || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Case History */}
      <div className="gap-4 grid grid-cols-3 mb-4">
        <div className="font-semibold">মামলার ইতিহাস:</div>
        <div className="col-span-2">{activeStage.caseHistory || "N/A"}</div>
      </div>

      {/* Order Sheets */}
      <div>
        <h3 className="mb-3 font-semibold text-lg">
          অর্ডার শীট: {activeStage.orderSheets?.length || 0}
        </h3>

        {/* Ordersheet Table */}
        <table className="table bg-base-100 border border-base-content/5 rounded-box w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-gray-300 border-r w-1/5">
                আদেশের ক্রমিক নং ও তারিখ
              </th>
              <th className="p-2 border-gray-300 border-r w-3/5">
                আদেশ ও অফিসারের সাক্ষর
              </th>
              <th className="p-2 w-1/5">আদেশের উপর গৃহীত ব্যবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {activeStage.orderSheets?.map((sheet, i) => (
              <tr key={i} className="pb-30 align-top">
                <td className="p-2 pb-30 border-gray-300 border-r border-b">
                  {sheet.date || "N/A"}
                </td>
                <td className="p-2 pb-30 border-gray-300 border-r border-b whitespace-pre-wrap">
                  {sheet.order || "N/A"}
                  {/* <div className="mt-4 border-t border-dotted h-10"></div> */}
                </td>
                <td className="p-2 pb-30 border-gray-300 border-b whitespace-pre-wrap">
                  {sheet.actionTaken || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Documents */}
      {activeStage.documents?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">ডকুমেন্টস:</h3>
          <ul className="pl-5 list-disc">
            {activeStage.documents.map((doc, i) => (
              <li key={i}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {doc.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default CaseDetailsAcland;

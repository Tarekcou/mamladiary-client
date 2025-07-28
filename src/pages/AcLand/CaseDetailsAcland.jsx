import React from "react";

const CaseDetailsAcland = ({ rootCaseId, activeStage, applicants }) => {
  const orders = activeStage.orderSheets || [];

  return (
    <>
      <style>{`
        /* Shared screen + print styling */
        #printable-area {
          min-width: 210mm;
          min-height: 285mm;
          padding: 5mm;
          background: white;
          box-sizing: border-box;
          margin: 0 auto;
          font-size: 12px;
        }

        #printable-area table {
          border-collapse: collapse;
          width: 100%;
          font-size: 12px;
          table-layout: fixed;
          border:1px solid #000;
        }

        #printable-area th,
        #printable-area td {
          border: 1px solid #ccc;
          padding: 6px;
          word-break: break-word;
        }

        /* Orders table column widths */
        #printable-area th:nth-child(1),
        #printable-area td:nth-child(1) { width: 20%; }
        #printable-area th:nth-child(2),
        #printable-area td:nth-child(2) { width: 60%; }
        #printable-area th:nth-child(3),
        #printable-area td:nth-child(3) { width: 20%; }

        .section-title {
          font-weight: bold;
          font-size: 16px;
          margin: 10px 0 4px 0;
        }

        /* Print mode */
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: absolute;
            left: 0; top: 0;
          }
          button { display: none; }
        }
      `}</style>

      {/* Print Button */}
      <button className="mb-4 btn btn-primary" onClick={() => window.print()}>
        PDF ডাউনলোড (Print)
      </button>

      <div id="printable-area">
        <div>
          <h1 className="text-xl">{activeStage.officeName.bn}</h1>
        </div>
        {/* Tracking ID */}
        <div className="gap-4 grid grid-cols-3 mb-4">
          <div className="font-semibold">Tracking ID:</div>
          <div className="col-span-2">{rootCaseId}</div>
        </div>

        {/* Applicants */}
        {applicants?.length > 0 && (
          <div className="mb-6">
            <h1 className="section-title">আবেদনকারী:</h1>
            <table>
              <thead>
                <tr>
                  <th>নাম</th>
                  <th>মোবাইল</th>
                  <th>ঠিকানা</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app, i) => (
                  <tr key={i}>
                    <td>{app.name}</td>
                    <td>{app.phone}</td>
                    <td>{app.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Case Info */}
        <div className="mb-6">
          <h1 className="section-title">মামলার তথ্য:</h1>
          <table>
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
        <div className="gap-4 grid grid-cols-3 mb-6">
          <div className="font-semibold">মামলার ইতিহাস:</div>
          <div className="col-span-2">{activeStage.caseHistory || "N/A"}</div>
        </div>

        {/* Orders Table */}
        <div>
          <h3 className="section-title">অর্ডার শীট: {orders.length}</h3>
          <table>
            <thead>
              <tr>
                <th>আদেশের ক্রমিক নং ও তারিখ</th>
                <th>আদেশ ও অফিসারের সাক্ষর</th>
                <th>আদেশের উপর গৃহীত ব্যবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((sheet, i) => (
                <tr key={i}>
                  <td>{sheet.date || "N/A"}</td>
                  <td className="whitespace-pre-wrap">
                    {sheet.order || "N/A"}
                  </td>
                  <td className="whitespace-pre-wrap">
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
            <h3 className="section-title">ডকুমেন্টস:</h3>
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
      </div>
    </>
  );
};

export default CaseDetailsAcland;

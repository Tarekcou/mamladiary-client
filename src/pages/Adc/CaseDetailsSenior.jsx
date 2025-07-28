import React, { useRef } from "react";

const CaseDetailsSenior = ({ rootCaseId, activeStage, headerText }) => {
  const orders = activeStage.orderSheets || [];
  const rowsPerPage = 20;
  const printDateTime = new Date().toLocaleString();

  const componentRef = useRef();

  return (
    <>
      <style>{`
        #printable-area {
          width: 240mm;
          height: 297mm;
          
          background: white;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        /* Header */
        .print-header {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        /* Case info table */
        .case-info {
          border: 1px solid #000;
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 8px;
        }
        .case-info td {
          border: 1px solid #000;
          padding: 4px;
          font-size: 12px;
        }

        /* Orders table */
       .orders-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Needed for colgroup widths to apply */
  border: 1px solid #000;
  height: 100%; /* Fill page height */
}

.orders-table th,
.orders-table td {
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  padding: 6px;
  font-size: 12px;
  word-break: break-word;
}

.orders-table th:first-child,
.orders-table td:first-child {
  border-left: none;
}

.orders-table th:last-child,
.orders-table td:last-child {
  border-right: none;
}

.orders-table thead th {
  background: #f3f4f6;
  border-bottom: 1px solid #000;
}

.orders-table tbody tr:last-child td {
  border-bottom: 1px solid #000; /* Bottom border */
}
  .orders-table th:nth-child(1),
.orders-table td:nth-child(1) {
  width: 20%;
}
.orders-table th:nth-child(2),
.orders-table td:nth-child(2) {
  width: 60%;
}
.orders-table th:nth-child(3),
.orders-table td:nth-child(3) {
  width: 20%;
}



        /* Fill empty space */
        .empty-row td {
          border: none;
          padding: 0;
          height: auto;
        }

        @media print {
          body * {
            visibility: hidden;
          }
            .orders-table thead {
    display: table-row-group; /* not table-header-group */
  }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none;
          }
        }
      `}</style>

      <button className="mb-4 btn btn-primary" onClick={() => window.print()}>
        PDF ডাউনলোড (Print)
      </button>

      <div id="printable-area" ref={componentRef}>
        {/* Header */}
        <div className="print-header">
          <span>{headerText || activeStage.officeName?.bn}</span>
          <span>প্রিন্টের সময়: {printDateTime}</span>
        </div>

        {/* Case Info */}
        <table className="case-info">
          <tbody>
            <tr>
              <td>Tracking ID</td>
              <td colSpan={3}>{rootCaseId}</td>
            </tr>
            <tr>
              <td>মামলার নাম</td>
              <td>{activeStage.mamlaName || "N/A"}</td>
              <td>মামলার নং</td>
              <td>{activeStage.mamlaNo || "N/A"}</td>
            </tr>
            <tr>
              <td>বছর</td>
              <td>{activeStage.year || "N/A"}</td>
              <td>জেলা</td>
              <td>{activeStage.district?.bn || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* Orders Table */}
        <table className="orders-table">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

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
                <td>{sheet.date || ""}</td>
                <td>{sheet.order || ""}</td>
                <td>{sheet.actionTaken || ""}</td>
              </tr>
            ))}

            {/* Fill empty rows */}
            {Array.from({ length: rowsPerPage - orders.length }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CaseDetailsSenior;

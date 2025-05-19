import React from "react";

const dummyData = [
  {
    id: 1,
    courtName: "অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব), চট্টগ্রাম আদালত",
    totalCases: "২৯",
    resultGiven: "৪",
    judges: ["জনাব মোহাম্মদ নূরুল্লাহ নূরী (অতিরিক্ত বিভাগীয় কমিশনার)"],
    jurisdictions: `
      একত্রে ডিভিশন বেঞ্চে বসিবেন এবং শুনানীর জন্য:
      - দেওয়ানী মোশন
      - প্রথম আপীল, প্রবেট সংক্রান্ত আপীল
      - ৬ কোটি টাকার ঊর্ধ্বের বিবিধ আপীল
      - দেওয়ানী রুল ও রিভিশন
      - হাইকোর্ট রুলস-এর ৯ অধ্যায়ের ৩৪ রুল অনুযায়ী শুনানী
      - শালিশী আইন ২০০১ এর ৪৮(ক)(খ)(গ) ধারা
      - দেউলিয়া বিষয়ক আপীল
      - ইউনিয়ন পরিষদ ও পৌরসভা আইন অনুযায়ী আপীল
    `,
  },
  // Add more entries here if needed
];

const CauseList = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 font-bold text-2xl">মামলা কার্যতালিকা </h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>SL</th>
              <th>Court Name</th>
              <th>Total Cases</th>
              <th>Result Given</th>
              <th>Honorable Judges</th>
              <th>Jurisdictions</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.courtName}</td>
                <td>{item.totalCases}</td>
                <td>{item.resultGiven}</td>
                <td>
                  {item.judges.map((judge, i) => (
                    <div key={i}>{judge}</div>
                  ))}
                </td>
                <td>
                  <details className="collapse collapse-arrow bg-base-100">
                    <summary className="collapse-title font-medium text-sm">
                      View Details
                    </summary>
                    <div className="collapse-content text-sm whitespace-pre-wrap">
                      {item.jurisdictions}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CauseList;

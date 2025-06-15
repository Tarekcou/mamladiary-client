import React from "react";
import { motion } from "framer-motion";

const charters = [
  {
    title: "অতিরিক্ত জেলা প্রশাসক (রাজস্ব) এর মামলার রায়ের বিরুদ্ধে আপিল",
    papers: [
      "০১। আরজি",
      "০২। ADC (R) এর সর্বশেষ আদেশ।",
      "০৩। নিম্ন আদালতের নথি",
    ],
  },
  {
    title: "বালুমহালের তালিকা অনুমোদন",
    duration: "০৭ কার্যদিবস",
    papers: [
      "বালুমহালের তালিকা দুই প্রস্থ",
      "জেলা বালুমহাল কমিটির কার্যবিবরণী",
    ],
    feeNote: "প্রযোজ্য নয়",
  },
  {
    title:
      "২০ একর পর্যন্ত জলমহাল ব্যবস্থাপনা কমিটির রায়ের বিরুদ্ধে আপিল নিষ্পত্তি",
    duration: "১৫ কার্যদিবস",
    papers: [
      "০১। আরজি",
      "০২। ADC (R) এর সর্বশেষ আদেশ।",
      "০৩। নিম্ন আদালতের নথি",
    ],
  },
];

const courtFees = [
  { description: "আরজিতে", fee: "১০০/- টাকা" },
  { description: "ওকালতনামায়", fee: "৩০/- টাকা" },
  { description: "আবেদনে", fee: "২০/- টাকা" },
  { description: "জাবেদা নকলে", fee: "২৩/- টাকা" },
  { description: "সংবাদ জানবার আবেদনে", fee: "৬০/- টাকা" },
];

const contacts = [
  {
    title: "সিনিয়র সহকারী কমিশনার, রাজস্ব শাখা",
    room: "১০৯",
    email: "divcomrevenue@gmail.com",
    phone: "০২-৪১৩৬০৭৯৮",
  },
  {
    title: "অতিরিক্ত বিভাগীয় কমিশনার (রাজস্ব)",
    office: "চট্টগ্রাম",
    room: "১০৭",
    phone: "০২-৪১৩৬০৮০৬",
    email: "adldivcomrchattogram@mopa.gov.bd",
  },
];

const CitizenCharter = () => {
  return (
    <motion.div
      className="hover:bg-[#004080]/10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gray-100 shadow-lg mx-auto p-6 rounded-xl">
        <h2 className="mb-6 font-bold text-[#004080] text-3xl text-center">
          সিটিজেন চার্টার
        </h2>

        {/* Charter Sections */}
        {charters.map((charter, index) => (
          <div
            key={index}
            className="bg-gray-100 shadow mt-5 p-6 border border-gray-200 rounded-xl"
          >
            <h3 className="mb-2 font-bold text-blue-700 text-xl">
              {charter.title}
            </h3>
            {charter.duration && (
              <p className="mb-2 text-gray-700">
                <strong>সময়সীমা:</strong> {charter.duration}
              </p>
            )}
            <div className="mb-4">
              <h4 className="mb-1 font-semibold text-gray-800">
                আবশ্যক কাগজপত্র:
              </h4>
              <ul className="space-y-1 text-gray-700 list-disc list-inside">
                {charter.papers.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            {charter.feeNote && (
              <p className="mb-4 text-gray-700">
                <strong>কোর্ট ফি:</strong> {charter.feeNote}
              </p>
            )}
          </div>
        ))}

        {/* Court Fee Table */}
        <div className="my-6">
          <h3 className="mb-2 font-semibold text-gray-800 text-xl">
            আবশ্যক কোর্ট ফি:
          </h3>
          <table className="table border border-gray-300 w-full">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border text-left">বিবরণ</th>
                <th className="px-4 py-2 border text-left">ফি</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {courtFees.map((fee, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">{fee.description}</td>
                  <td className="px-4 py-2 border">{fee.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contact Info */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {contacts.map((person, i) => (
            <div
              key={i}
              className="bg-gray-50 p-4 border rounded-md text-gray-800"
            >
              <p>{person.title}</p>
              {person.office && <p>{person.office}</p>}
              <p>রুম নম্বর: {person.room}</p>
              <p>ফোন: {person.phone}</p>
              <p>
                ইমেইল:{" "}
                <a href={`mailto:${person.email}`} className="text-blue-600">
                  {person.email}
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CitizenCharter;

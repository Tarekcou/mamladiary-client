import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Complain from "./Complain";
import Opinion from "./Opinion";
import ArrowLottie from "../lottie/ArrowLottie";
export const faqData = [
  {
    id: "complain", // 💡 anchor link target
    question: "অভিযোগ জানান",
    answer: <Complain />,
  },
  {
    id: "opinion",
    question: "আপনার মতামত জানান",
    answer: <Opinion />,
  },
];

const ComplainOrOpinion = () => {
  const location = useLocation();
  const [openId, setOpenId] = useState("");

  // When URL changes, update the open section
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setOpenId(id);
      // Optional: scroll into view smoothly
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // delay ensures DOM is ready
      }
    }
  }, [location]);

  return (
    <div className="space-y-3 p-6 md:p-10">
      <h2 className="my-10 mb-4 font-bold text-blue-900 text-xl md:text-3xl text-center">
        মতামত ও অভিযোগ জানান <ArrowLottie />
      </h2>
      {faqData.map((faq, index) => (
        <div
          key={index}
          id={faq.id}
          className="collapse collapse-arrow bg-gray-100 border border-blue-300 w-full"
        >
          <input
            type="checkbox"
            checked={openId === faq.id}
            onChange={
              () => setOpenId(openId === faq.id ? "" : faq.id) // toggle logic
            }
          />
          <div className="collapse-title font-semibold text-blue-900">
            <div className="text-xl">{faq.question}</div>
          </div>
          <div className="collapse-content text-sm">{faq.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default ComplainOrOpinion;

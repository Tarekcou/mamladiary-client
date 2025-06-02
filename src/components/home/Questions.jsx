import React from "react";

// data/faqData.js or directly in your component
export const faqData = [
  {
    question: "রাজস্ব মামলা ব্যবস্থাপনা অ্যাপ্লিকেশন কী?",
    answer:
      "এটি একটি অনলাইন প্ল্যাটফর্ম যার মাধ্যমে বিভাগীয় কমিশনারের কার্যালয়ে জমা হওয়া রাজস্ব সংক্রান্ত মামলাগুলো পরিচালনা ও অনুসরণ করা যায়।",
  },
  // {
  //   question: "আমি কীভাবে একটি নতুন মামলা দাখিল করব?",
  //   answer:
  //     "অ্যাকাউন্টে লগইন করার পর, 'নতুন মামলা দাখিল' মেনুতে যান, প্রয়োজনীয় তথ্য পূরণ করুন এবং প্রাসঙ্গিক কাগজপত্র আপলোড করুন।",
  // },
  {
    question: "আমি কি আমার দাখিলকৃত মামলার অবস্থা জানতে পারব?",
    answer:
      "হ্যাঁ, 'আমার মামলা' মেনু থেকে আপনি মামলার বর্তমান অবস্থা, শুনানির তারিখ এবং চূড়ান্ত সিদ্ধান্ত দেখতে পারবেন।",
  },
  {
    question: "কী কী ধরণের মামলার তথ্য এই অ্যাপে থেকে জানা যায়?",
    answer:
      "ভূমি বিরোধ, জমির খাজনা, নামজারি ও অন্যান্য রাজস্ব সংক্রান্ত মামলাগুলো তথ্য এই অ্যাপ্লিকেশনের মাধ্যমে জানা যায়।",
  },
  // {
  //   question: "অ্যাকাউন্ট তৈরি করতে হলে কী করতে হবে?",
  //   answer:
  //     "হোমপেজের উপরের দিকে থাকা 'সাইন আপ' বাটনে ক্লিক করে আপনার তথ্য দিয়ে নিবন্ধন করুন।",
  // },
  {
    question: "আমি আমার মামলা সংশোধন করতে পারব কি?",
    answer:
      "যদি মামলা এখনও পর্যালোচনার পর্যায়ে থাকে, তাহলে আপনি নির্দিষ্ট সময়ের মধ্যে সংশোধনের আবেদন করতে পারবেন।",
  },
];

const Questions = () => {
  return (
    <div className="space-y-1">
      {faqData.map((faq, index) => (
        <div
          key={index}
          tabIndex={0}
          className="collapse collapse-arrow bg-gray-100 border border-gray-300"
        >
          <input type="checkbox" />

          <div className="collapse-title font-semibold">{faq.question}</div>
          <div className="collapse-content text-sm">{faq.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default Questions;

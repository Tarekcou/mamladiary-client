import { motion } from "framer-motion"; // For animation

const Contact = () => {
  const contacts = [
    {
      name: "সাখাওয়াত হোসেন",
      title: "অফিস সহকারী কাম-কম্পিউটার মুদ্রাক্ষরিক (বেঞ্চ সহকারী)",
      phone: "০১৭১৪৮৫৪৬৩৪",
    },
    {
      name: "মোঃ সাঈদুল হক নোমান",
      title: "অফিস সহকারী কাম-কম্পিউটার মুদ্রাক্ষরিক (বেঞ্চ সহকারী)",
      phone: "০১৮৬০৭৩১৫৩",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-100 shadow-sm mx-auto p-4 rounded-md w-11/12"
    >
      <div className="bg-gray-100">
        {/* <h2 className="mb-4 font-semibold text-gray-800 text-xl">যোগাযোগ</h2> */}
        <div className="flex md:flex-row flex-col gap-6  justify-around   items-center ">
          {contacts.map((person, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-md border-r-2 border-l-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="font-medium text-gray-800 text-lg">{person.name}</p>
              <p className="text-gray-600 text-sm">{person.title}</p>
              <p className="mt-1 text-gray-700 text-sm">
                মোবাইল নম্বরঃ {person.phone}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;

const Contact = () => {
  const contacts = [
    {
      name: "সাখাওয়াত হোসেন",
      title: "অফিস সহকারী কাম-কম্পিউটার মুদ্রাক্ষরিক",
      phone: "০১৭১৪৮৫৪৬৩৪",
    },
    {
      name: "মোঃ সাঈদুল হক নোমান",
      title: "অফিস সহকারী কাম-কম্পিউটার মুদ্রাক্ষরিক",
      phone: "০১৮৬০৭৩১৫৩",
    },
  ];

  return (
    <div className="bg-white shadow-md p-6 rounded-lg min-h-screen">
      <h2 className="mb-4 font-semibold text-gray-800 text-xl">যোগাযোগ</h2>
      <div className="space-y-4">
        {contacts.map((person, index) => (
          <div
            key={index}
            className="hover:shadow p-4 border border-gray-200 rounded-md"
          >
            <p className="font-medium text-gray-800 text-lg">{person.name}</p>
            <p className="text-gray-600 text-sm">{person.title}</p>
            <p className="mt-1 text-gray-700 text-sm">
              মোবাইল নম্বরঃ {person.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;

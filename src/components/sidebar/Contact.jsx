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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">যোগাযোগ</h2>
      <div className="space-y-4">
        {contacts.map((person, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-4 hover:shadow"
          >
            <p className="text-lg font-medium text-gray-800">{person.name}</p>
            <p className="text-sm text-gray-600">{person.title}</p>
            <p className="text-sm text-gray-700 mt-1">
              মোবাইল নম্বরঃ {person.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;

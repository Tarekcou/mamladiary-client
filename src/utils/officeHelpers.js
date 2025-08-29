export const handleOfficeName = (officeNameBN, name, role) => {
  if (role === "acLand") {
    return `${officeNameBN} ভূমি অফিস  `;
  } else if (role === "adc") {
    return `অতিরিক্ত জেলা প্রশাসক, ${officeNameBN} (রাজস্ব) আদালত`;
  } else if (role == "divCom") {
    return `অতিরিক্ত কমিশনার(রাজস্ব) আদালত`;
  } else {
    return `${name} (নাগরিক)`;
  }
};

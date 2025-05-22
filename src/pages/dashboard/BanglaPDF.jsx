// components/BanglaPDF.jsx
import NikoshFont from "../../fonts/Nikosh.ttf"; // ✅ path must be correct

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ✅ Register Unicode Bangla Font
Font.register({
  family: "Nikosh",
  src: NikoshFont,
  format: "truetype", // ✅ Add format to avoid "Unknown font format" error
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Nikosh", // or "NotoSerifBengali"
    fontSize: 11,
    padding: 20,
  },
  heading: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
  },
  tableRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    borderColor: "#444",
    borderStyle: "solid", // optional, 'solid' is default
    textAlign: "center",
  },
});

function toBanglaNumber(num) {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => banglaDigits[parseInt(digit)] || digit)
    .join("");
}

const BanglaPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>মাসিক মামলার প্রতিবেদন</Text>

      {/* Table Header */}
      <View style={styles.tableRow}>
        <Text style={styles.cell}>ক্রম</Text>
        <Text style={styles.cell}>মামলার নাম</Text>
        <Text style={styles.cell}>মামলা নম্বর</Text>
        <Text style={styles.cell}>সাল</Text>
        <Text style={styles.cell}>জেলা</Text>
        <Text style={styles.cell}>পূর্বের তারিখ</Text>
        <Text style={styles.cell}>পরবর্তী তারিখ</Text>
        <Text style={styles.cell}>সর্বশেষ অবস্থা</Text>
        <Text style={[styles.cell, styles.lastCell]}>সম্পন্নের তারিখ</Text>
      </View>

      {/* Table Rows */}
      {data.map((item, index) => (
        <View style={styles.tableRow} key={index}>
          <Text style={styles.cell}>{toBanglaNumber(index + 1)}</Text>
          <Text style={styles.cell}>{item.mamlaName}</Text>
          <Text style={styles.cell}>{item.mamlaNo}</Text>
          <Text style={styles.cell}>{item.year}</Text>
          <Text style={styles.cell}>{item.district}</Text>
          <Text style={styles.cell}>{item.previousDate || "-"}</Text>
          <Text style={styles.cell}>{item.nextDate || "-"}</Text>
          <Text style={styles.cell}>{item.completedMamla || "-"}</Text>
          <Text style={styles.cell}>{item.completionDate || "-"}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default BanglaPDF;

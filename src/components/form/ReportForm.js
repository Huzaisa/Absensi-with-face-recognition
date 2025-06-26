import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import SearchDropdown from "../../components/dropdown/SearchDropdown";
import SemiBoldText from "../../components/text/SemiBoldText";
import Dropdown from "../../components/dropdown/Dropdown";
import DocumentPreview from "../preview/DocumentPreview";
import { Icon } from "react-native-paper";
import ExportButton from "../button/ExportButton";

const ReportForm = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const employees = [
    { id: 1, name: "Andi Saputra" },
    { id: 2, name: "Budi Santoso" },
    { id: 3, name: "Citra Dewi" },
    { id: 4, name: "Dewi Lestari" },
    { id: 5, name: "Eka Prasetya" },
    { id: 6, name: "Fajar Nugroho" },
    { id: 7, name: "Fajar Nugroho" },
    { id: 8, name: "Fajar Nugroho" },
    { id: 9, name: "Fajar Nugroho" },
    { id: 10, name: "Fajar Nugroho" },
  ];

  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const start = 2000;
    const end = currentYear + 5;
    const arr = [];
    for (let y = start; y <= end; y++) {
      arr.push({ id: y, name: `${y}` });
    }
    return arr;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SemiBoldText text="Choose Employee" size={15} />
        <SearchDropdown
          placeholder="Choose"
          items={employees.map((e) => ({
            id: String(e.id),
            label: e.name,
            value: e.name,
          }))}
          selectedValue={selectedEmployee}
          onValueChange={setSelectedEmployee}
          maxDropdownHeight={vs(180)}
        />
      </View>

      <View style={styles.rowSelector}>
        <View style={styles.selectorWrapper}>
          <SemiBoldText text="Choose Month" size={15} />
          <Dropdown
            current={selectedMonth}
            onSelect={(_, item) => setSelectedMonth(item)}
            data={months}
          />
        </View>

        <View style={styles.selectorWrapper}>
          <SemiBoldText text="Choose Year" size={15} />
          <Dropdown
            current={selectedYear}
            onSelect={(_, item) => setSelectedYear(item)}
            data={years}
          />
        </View>
      </View>

      <DocumentPreview
        type="pdf"
        uri="https://ejournal.gunadarma.ac.id/index.php/kommit/article/viewFile/1010/874"
      />

      <View style={styles.exportWrapper}>
        <View style={styles.exportHeader}>
          <Icon source="download" size={19} />
          <SemiBoldText text="Export File" size={16} />
        </View>

        <View style={styles.exportButtonsRow}>
          <ExportButton
            text="PDF"
            onPress={() => console.log("PDF")}
            type="pdf"
          />
          <ExportButton
            text="CSV"
            onPress={() => console.log("CSV")}
            type="csv"
          />
        </View>
      </View>
    </View>
  );
};

export default ReportForm;

const styles = StyleSheet.create({
  container: {
    gap: vs(20),
    marginTop: vs(20),
  },
  content: {
    marginHorizontal: sc(22),
    gap: vs(14),
  },
  rowSelector: {
    marginHorizontal: sc(22),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectorWrapper: {
    gap: vs(14),
  },
  exportWrapper: {
    marginHorizontal: sc(22),
    marginTop: vs(20),
    gap: vs(14),
  },
  exportHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: sc(2),
  },
  exportButtonsRow: {
    flexDirection: "row",
    gap: sc(40),
  },
});

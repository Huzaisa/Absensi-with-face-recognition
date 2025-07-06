import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import SearchDropdown from "../../components/dropdown/SearchDropdown";
import SemiBoldText from "../../components/text/SemiBoldText";
import Dropdown from "../../components/dropdown/Dropdown";
import DocumentPreview from "../preview/DocumentPreview";
import { Icon } from "react-native-paper";
import ExportButton from "../button/ExportButton";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";

const ReportForm = () => {
  const { token } = useAuthStore();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [documentUri, setDocumentUri] = useState(null); // State baru untuk menyimpan URI dokumen
  const [isLoadingDocument, setIsLoadingDocument] = useState(false); // State untuk indikator loading
  const [errorDocument, setErrorDocument] = useState(null); // State untuk penanganan error

  console.log(selectedEmployee);
  console.log(selectedMonth);
  console.log(selectedYear);

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

  useEffect(() => {
    const fetchDocument = async () => {
      if (selectedEmployee && selectedMonth && selectedYear) {
        setIsLoadingDocument(true);
        setErrorDocument(null);
        setDocumentUri(null);

        try {
          const response = await axios.get(
            `http://192.168.1.7:3000/api/report/pdf?month=${selectedMonth.id}&year=${selectedYear.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          console.log(response.data);
        } catch (error) {
          console.error("Error fetching document:", error);
          setErrorDocument(error.message);
        } finally {
          setIsLoadingDocument(false);
        }
      } else {
        setDocumentUri(null);
      }
    };

    fetchDocument();
  }, [selectedEmployee, selectedMonth, selectedYear]);

  const getExportUrl = (type) => {
    if (!selectedEmployee || !selectedMonth || !selectedYear) {
      return null;
    }

    return `http://192.168.1.7:3000/api/report/${type}?employeeId=${selectedEmployee.id}&month=${selectedMonth.id}&year=${selectedYear.id}`;
  };

  const handleExport = (type) => {
    const url = getExportUrl(type);
    if (url) {
      console.log(`Export ${type} clicked. URL: ${url}`);

      Alert.alert("Export", `Mencoba mengunduh file ${type} dari: ${url}`);
    } else {
      Alert.alert(
        "Informasi",
        "Harap pilih karyawan, bulan, dan tahun terlebih dahulu.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SemiBoldText text="Pilih Karyawan" size={15} />
        <SearchDropdown
          selectedValue={selectedEmployee}
          onValueChange={setSelectedEmployee}
          maxHeight={vs(180)}
        />
      </View>

      <View style={styles.rowSelector}>
        <View style={styles.selectorWrapper}>
          <SemiBoldText text="Pilih Bulan" size={15} />
          <Dropdown
            current={selectedMonth}
            onSelect={(_, item) => setSelectedMonth(item)}
            data={months}
          />
        </View>

        <View style={styles.selectorWrapper}>
          <SemiBoldText text="Pilih Tahun" size={15} />
          <Dropdown
            current={selectedYear}
            onSelect={(_, item) => setSelectedYear(item)}
            data={years}
          />
        </View>
      </View>

      {isLoadingDocument && (
        <ActivityIndicator style={styles.loadingIndicator} size="large" />
      )}
      {errorDocument && (
        <SemiBoldText
          text={`Error: ${errorDocument}`}
          style={styles.errorText}
        />
      )}
      {documentUri ? (
        <DocumentPreview type="pdf" uri={documentUri} />
      ) : (
        !isLoadingDocument &&
        !errorDocument && (
          <View style={styles.placeholderContainer}>
            <SemiBoldText
              text="Pilih karyawan, bulan, dan tahun untuk melihat preview dokumen."
              style={styles.placeholderText}
            />
          </View>
        )
      )}

      <View style={styles.exportWrapper}>
        <View style={styles.exportHeader}>
          <Icon source="download" size={19} />
          <SemiBoldText text="Ekspor File" size={16} />
        </View>

        <View style={styles.exportButtonsRow}>
          <ExportButton
            text="PDF"
            onPress={() => handleExport("pdf")}
            type="pdf"
          />
          <ExportButton
            text="EXCEL"
            onPress={() => handleExport("excel")}
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
    flex: 1,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(20),
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: vs(20),
    marginHorizontal: sc(22),
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: sc(22),
    marginTop: vs(20),
    padding: sc(20),
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
  },
});

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import RNFetchBlob from "react-native-blob-util";
import { ms, sc, vs } from "../../constant/Dimension";
import SemiBoldText from "../../components/text/SemiBoldText";
import Dropdown from "../../components/dropdown/Dropdown";
import DocumentPreview from "../preview/DocumentPreview";
import { Icon } from "react-native-paper";
import ExportButton from "../button/ExportButton";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import MediumText from "../text/MediumText";

const ReportForm = () => {
  const { token } = useAuthStore();

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [documentUri, setDocumentUri] = useState(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isExporting, setIsExporting] = useState(null);

  const months = useMemo(
    () => [
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
    ],
    [],
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr = [];
    for (let y = 2000; y <= currentYear + 5; y++) {
      arr.push({ id: y, name: `${y}` });
    }
    return arr;
  }, []);

  // Fetch preview PDF
  const fetchDocument = useCallback(async () => {
    if (!selectedMonth || !selectedYear) {
      setDocumentUri(null);
      return;
    }
    setIsLoadingDocument(true);
    try {
      const res = await axios.get(
        `http://192.168.100.108:3000/api/report/pdf?month=${selectedMonth.id}&year=${selectedYear.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDocumentUri(res.data.data);
    } catch (error) {
      console.log(
        "Error fetching report data:",
        error.response ? error.response.data : error.message,
      );
    } finally {
      setIsLoadingDocument(false);
    }
  }, [selectedMonth, selectedYear, token]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // Minta izin legacy di Android <= 10
  const ensureLegacyPermission = async () => {
    if (Platform.OS !== "android") return true;

    // Android <= 10 (API 29) masih butuh WRITE_EXTERNAL_STORAGE
    if (Platform.Version <= 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message: "The application requires permission to save files.",
          buttonPositive: "Allow",
          buttonNegative: "Cancel",
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // Android 11+ tidak butuh izin ini karena pakai DownloadManager
    return true;
  };

  // Handle Export PDF / Excel
  const handleExport = async (type) => {
    if (!selectedMonth || !selectedYear) {
      return Alert.alert(
        "Warning!",
        "Please select both month and year first to export file",
      );
    }

    // legacy permission untuk Android <= 10
    const granted = await ensureLegacyPermission();
    if (!granted) {
      setIsExporting(null);
      return Alert.alert(
        "Permission Denied!",
        "Cannot download file without storage permission",
      );
    }

    setIsExporting(type);

    const ext = type === "pdf" ? "pdf" : "xlsx";
    const mime =
      type === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const ts = Date.now(); // agar unik
    const fileName = `laporan-${selectedMonth.name.toLowerCase()}-${selectedYear.id}-${ts}.${ext}`;

    try {
      // ambil URL download
      const downloadUrl =
        type === "pdf"
          ? await (async () => {
              const { data } = await axios.get(
                `http://192.168.100.108:3000/api/report/pdftofile?month=${selectedMonth.id}&year=${selectedYear.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              if (!data.path) throw new Error("Invalid PDF path");
              return `http://192.168.100.108:3000${data.path}`;
            })()
          : `http://192.168.100.108:3000/api/report/excel?month=${selectedMonth.id}&year=${selectedYear.id}`;

      const PUBLIC_DOWNLOAD = "/storage/emulated/0/Download";
      // konfig RNFetchBlob agar pakai DownloadManager dan simpan di public Download
      const res = await RNFetchBlob.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true, // biar langsung ter‐index
          title: fileName,
          description: `Downloading ${fileName}`,
          mime: mime,
          path: `${PUBLIC_DOWNLOAD}/${fileName}`, // tulis ke /storage/emulated/0/Download/
        },
      }).fetch("GET", downloadUrl, {
        Authorization: `Bearer ${token}`,
      });

      ToastAndroid.show("Download successful", ToastAndroid.SHORT);
    } catch (error) {
      console.log(
        "Error download document:",
        error.response ? error.response.data : error.message,
      );
      Alert.alert(
        "Warning!",
        error.response.data.message || "There is an error",
      );
    } finally {
      setIsExporting(null);
    }
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
    setSelectedMonth(null);
    setSelectedYear(null);
    setDocumentUri(null);
    setRefresh(false);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.rowSelector}>
          <View style={styles.selectorWrapper}>
            <SemiBoldText text="Select Month" size={15} />
            <Dropdown
              current={selectedMonth}
              onSelect={(_, item) => setSelectedMonth(item)}
              data={months}
            />
          </View>
          <View style={styles.selectorWrapper}>
            <SemiBoldText text="Select Year" size={15} />
            <Dropdown
              current={selectedYear}
              onSelect={(_, item) => setSelectedYear(item)}
              data={years}
            />
          </View>
        </View>

        {isLoadingDocument ? (
          <ActivityIndicator size="large" />
        ) : documentUri ? (
          <View style={styles.documentContainer}>
            <DocumentPreview uri={documentUri} />
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <MediumText
              text="Select month and year first to see document preview"
              size={15}
            />
          </View>
        )}

        <View style={styles.exportWrapper}>
          <View style={styles.exportHeader}>
            <Icon source="download" size={19} color="#000" />
            <SemiBoldText text="Export File" size={16} />
          </View>
          <View style={styles.exportButtonsRow}>
            {isExporting === "pdf" ? (
              <ActivityIndicator size="large" />
            ) : (
              <ExportButton
                text="PDF"
                onPress={() => handleExport("pdf")}
                type="pdf"
                disabled={isExporting}
              />
            )}
            {isExporting === "excel" ? (
              <ActivityIndicator size="large" />
            ) : (
              <ExportButton
                text="EXCEL"
                onPress={() => handleExport("excel")}
                type="csv"
                disabled={isExporting}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: vs(20),
  },
  container: {
    gap: vs(20),
    marginTop: vs(20),
    marginBottom: vs(10),
  },
  rowSelector: {
    marginHorizontal: sc(22),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectorWrapper: { gap: vs(14) },
  documentContainer: {
    height: "90%",
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
    borderRadius: ms(8),
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

export default ReportForm;

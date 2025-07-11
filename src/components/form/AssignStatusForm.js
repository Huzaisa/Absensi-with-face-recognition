import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import { sc, vs } from "../../constant/Dimension";
import BoldText from "../text/BoldText";
import SemiBoldText from "../text/SemiBoldText";
import CancelButton from "../button/CancelButton";
import SaveButton from "../button/SaveButton";
import useAuthStore from "../../stores/AuthStore";
import axios from "axios";
import { Icon } from "react-native-paper";
import MediumText from "../text/MediumText";
import RNFetchBlob from "react-native-blob-util";
import Dropdown from "../dropdown/Dropdown";

const AssignStatusForm = ({
  onDismiss,
  requestId,
  fileUpload,
  type,
  onRefresh,
}) => {
  const { token } = useAuthStore();
  const [statusAssign, setStatusAssign] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const status = useMemo(
    () => [
      { id: 1, name: "Approve", color: "#4CAF50" },
      { id: 2, name: "Reject", color: "#F44336" },
    ],
    [],
  );

  const handleSubmitForm = async () => {
    try {
      if (!statusAssign) {
        return Alert.alert("Warning!", "Please select status");
      }

      let data;
      let response;

      if (type === "overtime") {
        if (statusAssign.name === "Approve") {
          data = {
            overtimeId: requestId,
          };

          response = await axios.post(
            `http://192.168.1.7:3000/api/overtime/approve`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } else {
          data = {
            overtimeId: requestId,
          };

          response = await axios.post(
            `http://192.168.1.7:3000/api/overtime/reject`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
      }
      if (type === "leave") {
        if (statusAssign.name === "Approve") {
          data = {
            leaveId: requestId,
          };

          response = await axios.post(
            `http://192.168.1.7:3000/api/leave/approve`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } else {
          data = {
            leaveId: requestId,
          };

          response = await axios.post(
            `http://192.168.1.7:3000/api/leave/reject`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
      }

      ToastAndroid.show("Assign status successful", ToastAndroid.SHORT);
      setTimeout(onDismiss, 1000);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.log(
        "Error assign status:",
        error.response ? error.response.data : error.message,
      );
      Alert.alert("Warning!", error.response.data.message);
    }
  };

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

  const handleDownloadFile = async () => {
    setIsExporting(true);

    // legacy permission untuk Android <= 10
    const granted = await ensureLegacyPermission();
    if (!granted) {
      setIsExporting(false);
      return Alert.alert(
        "Permission Denied!",
        "Cannot download file without storage permission",
      );
    }

    const ext = "pdf";
    const mime = "application/pdf";

    const ts = Date.now(); // agar unik
    const fileName = `document-request-${requestId}-${ts}.${ext}`;

    try {
      // ambil URL download
      const downloadUrl = `http://192.168.1.7:3000/documents/${fileUpload}`;

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
      }).fetch("GET", downloadUrl);

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
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.titleWrapper}>
        <BoldText text="FILL OUT THIS FORM" size={15} />
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.fieldGroup}>
          <SemiBoldText text="Select Status" size={15} />
          <Dropdown
            current={statusAssign}
            onSelect={(_, item) => setStatusAssign(item)}
            data={status}
            extend
          />
        </View>

        <View style={styles.fileRow}>
          <SemiBoldText text="File: " size={15} />

          {fileUpload ? (
            isExporting ? (
              <ActivityIndicator size="small" />
            ) : (
              <TouchableOpacity
                onPress={handleDownloadFile}
                disabled={isExporting}
              >
                <Icon source={"download"} color="#000" size={20} />
              </TouchableOpacity>
            )
          ) : (
            <MediumText text="No file uploaded" size={15} />
          )}
        </View>
      </View>

      <View style={styles.actionsRow}>
        <CancelButton text="Cancel" onPress={onDismiss} />
        <SaveButton text="Save" onPress={handleSubmitForm} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    gap: vs(20),
  },
  titleWrapper: {
    alignItems: "center",
  },
  inputGroup: {
    gap: vs(30),
  },
  fieldGroup: {
    gap: vs(10),
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sc(10),
  },
  actionsRow: {
    flexDirection: "row",
    gap: sc(30),
    alignSelf: "center",
    marginTop: vs(5),
  },
});
export default AssignStatusForm;

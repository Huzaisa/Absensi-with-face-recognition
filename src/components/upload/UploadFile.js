import React from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import BoldText from "../text/BoldText";
import Upload from "../../../assets/images/upload.svg";
import Cross from "../../../assets/images/cross.svg";
import * as DocumentPicker from "expo-document-picker";
import { sc, vs } from "../../constant/Dimension";

const UploadFile = ({ uploadFile, setUploadedFile }) => {
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setUploadedFile(file);
        ToastAndroid.show("Upload file successful", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Upload file failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(
        "Error pick file: ",
        error.response ? error.response.data : error.message,
      );
      Alert.alert("Error!", "Please pick a pdf file");
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropZone}>
        {!uploadFile ? (
          <TouchableOpacity
            style={styles.centered}
            onPress={handlePickDocument}
          >
            <Upload />
            <BoldText text="Upload" size={13} />
          </TouchableOpacity>
        ) : (
          <View style={styles.fileRow}>
            <BoldText text={uploadFile.name} size={13} />
            <TouchableOpacity onPress={handleRemoveFile}>
              <Cross />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  dropZone: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: sc(154),
    height: vs(105),
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "dashed",
  },
  centered: {
    alignItems: "center",
  },
  fileRow: {
    flexDirection: "row",
    gap: sc(4),
  },
});

export default UploadFile;

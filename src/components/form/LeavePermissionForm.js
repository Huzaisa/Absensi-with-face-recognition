import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, Alert } from "react-native";
import DateInput from "../input/DateInput";
import ReasonInput from "../input/ReasonInput";
import SemiBoldText from "../text/SemiBoldText";
import UploadFile from "../upload/UploadFile";
import CommonButton from "../button/CommonButton";
import { sc, vs } from "../../constant/Dimension";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { useNavigation } from "@react-navigation/native";

const LeavePermissionForm = () => {
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [startDateSelected, setStartDateSelected] = useState(false);
  const [endDateSelected, setEndDateSelected] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmitForm = async () => {
    if (!startDateSelected || !endDateSelected) {
      return Alert.alert("Warning!", "Please fill out the form");
    }

    try {
      const data = {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        reason: reason,
      };

      const response = await axios.post(
        `http://192.168.1.8:3000/api/leave/request`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (uploadedFile) {
        const formData = new FormData();

        formData.append("document", {
          uri: uploadedFile.uri,
          name: uploadedFile.name,
          type: uploadedFile.mimeType,
        });
        formData.append("type", "leave");

        const responseUploadFile = await axios.post(
          `http://192.168.1.8:3000/api/upload?type=document`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      ToastAndroid.show("Add Leave Successful", ToastAndroid.SHORT);

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.log(
        "Error send leave request:",
        error.response ? error.response.data : error.message,
      );
      Alert.alert("Warning!", error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formSection}>
        <View style={styles.dateRow}>
          <DateInput
            text="Start Date"
            date={startDate}
            setDate={setStartDate}
            setHasSelectedDateProp={setStartDateSelected}
          />
          <DateInput
            text="End Date"
            date={endDate}
            setDate={setEndDate}
            setHasSelectedDateProp={setEndDateSelected}
          />
        </View>

        <ReasonInput setReason={setReason} />

        <View style={styles.orWrapper}>
          <SemiBoldText text="Or" size={15} />
        </View>

        <SemiBoldText text="Upload Your Document (PDF)" size={15} />

        <UploadFile
          uploadFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      </View>

      <CommonButton text="Submit" onPress={handleSubmitForm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: vs(20),
  },
  formSection: {
    marginHorizontal: sc(6),
    marginTop: vs(20),
    gap: vs(20),
  },
  dateRow: {
    flexDirection: "row",
    gap: sc(30),
  },
  orWrapper: {
    alignItems: "center",
  },
});

export default LeavePermissionForm;

import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, Alert } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import DateInput from "../input/DateInput";
import TimeInput from "../input/TimeInput";
import ReasonInput from "../input/ReasonInput";
import SemiBoldText from "../text/SemiBoldText";
import UploadFile from "../upload/UploadFile";
import CommonButton from "../button/CommonButton";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { useNavigation } from "@react-navigation/native";

const OvertimePermissionForm = () => {
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [reason, setReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [startTimeSelected, setStartTimeSelected] = useState(false);
  const [endTimeSelected, setEndTimeSelected] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSubmitForm = async () => {
    if (!dateSelected || !startTimeSelected || !endTimeSelected) {
      return Alert.alert("Warning!", "Please fill out the form");
    }

    try {
      const data = {
        date: formatDate(date),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        reason: reason,
      };

      const response = await axios.post(
        `http://192.168.1.8:3000/api/overtime/request`,
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
        formData.append("type", "overtime");

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

      ToastAndroid.show("Add Overtime Successful", ToastAndroid.SHORT);

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.log(
        "Error send overtime request:",
        error.response ? error.response.data : error.message,
      );
      Alert.alert("Warning!", error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formSection}>
        <DateInput
          text="Overtime Date"
          date={date}
          setDate={setDate}
          extend
          setHasSelectedDateProp={setDateSelected}
        />

        <View style={styles.timeRow}>
          <TimeInput
            text="Start Time"
            time={startTime}
            setTime={setStartTime}
            setHasSelectedTimeProp={setStartTimeSelected}
          />

          <TimeInput
            text="End Time"
            time={endTime}
            setTime={setEndTime}
            setHasSelectedTimeProp={setEndTimeSelected}
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
  timeRow: {
    flexDirection: "row",
    gap: sc(100),
  },
  orWrapper: {
    alignItems: "center",
  },
});

export default OvertimePermissionForm;

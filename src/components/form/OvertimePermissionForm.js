import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import DateInput from "../input/DateInput";
import TimeInput from "../input/TimeInput";
import ReasonInput from "../input/ReasonInput";
import SemiBoldText from "../text/SemiBoldText";
import UploadFile from "../upload/UploadFile";
import CommonButton from "../button/CommonButton";

const OvertimePermissionForm = () => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [reason, setReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleSubmitForm = () => {
    // TODO: handle submission
  };

  return (
    <View style={styles.container}>
      <View style={styles.formSection}>
        <DateInput text="Overtime Date" date={date} setDate={setDate} extend />

        <View style={styles.timeRow}>
          <TimeInput
            text="Start Time"
            time={startTime}
            setTime={setStartTime}
          />

          <TimeInput text="End Time" time={endTime} setTime={setEndTime} />
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

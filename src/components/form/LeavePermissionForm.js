import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DateInput from "../input/DateInput";
import ReasonInput from "../input/ReasonInput";
import SemiBoldText from "../text/SemiBoldText";
import UploadFile from "../upload/UploadFile";
import CommonButton from "../button/CommonButton";
import { sc, vs } from "../../constant/Dimension";

const LeavePermissionForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleSubmitForm = () => {
    // TODO: handle submission
  };

  return (
    <View style={styles.container}>
      <View style={styles.formSection}>
        <View style={styles.dateRow}>
          <DateInput
            text="Start Date"
            date={startDate}
            setDate={setStartDate}
          />
          <DateInput text="End Date" date={endDate} setDate={setEndDate} />
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

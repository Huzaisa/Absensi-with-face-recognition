import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { ms, sc, vs } from "../../constant/Dimension";
import BoldText from "../text/BoldText";
import TimeInput from "../input/TimeInput";
import CummonInput from "../input/CummonInput";
import SaveButton from "../button/SaveButton";
import CancelButton from "../button/CancelButton";

const ShiftForm = ({ onPress }) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleSubmitForm = () => {
    // TODO: handle submission
    ToastAndroid.show("Add shift successful", ToastAndroid.SHORT);
    setTimeout(onPress, 1000);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.titleWrapper}>
          <BoldText text="FILL OUT THIS FORM" size={15} />
        </View>

        <CummonInput text="Name" setInput={setTitle} />

        <View style={styles.timeRow}>
          <TimeInput
            text="Start Time"
            time={startTime}
            setTime={setStartTime}
          />
          <TimeInput text="End Time" time={endTime} setTime={setEndTime} />
        </View>

        <View style={styles.actionsRow}>
          <CancelButton text="Cancel" onPress={onPress} />
          <SaveButton text="Save" onPress={handleSubmitForm} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: sc(10),
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: ms(8),
    padding: ms(20),
    gap: vs(20),
  },
  titleWrapper: {
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    gap: sc(100),
  },
  actionsRow: {
    flexDirection: "row",
    gap: sc(30),
    alignSelf: "center",
    marginTop: vs(5),
  },
});

export default ShiftForm;

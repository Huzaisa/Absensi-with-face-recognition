import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { ms, sc, vs } from "../../constant/Dimension";
import BoldText from "../text/BoldText";
import TimeInput from "../input/TimeInput";
import CummonInput from "../input/CummonInput";
import SaveButton from "../button/SaveButton";
import CancelButton from "../button/CancelButton";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";

const ShiftForm = ({ onDismiss, onRefresh }) => {
  const { token } = useAuthStore();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSubmitForm = async () => {
    try {
      const data = {
        name: title,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      };

      const response = await axios.post(
        "http://192.168.1.7:3000/api/shift/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      ToastAndroid.show("Add shift successful", ToastAndroid.SHORT);
      setTimeout(onDismiss, 1000);

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.log(
        "Error add shift:",
        error.response ? error.response.data : error.message,
      );
    }
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
          <CancelButton text="Cancel" onPress={onDismiss} />
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

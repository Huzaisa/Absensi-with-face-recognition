import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SemiBoldText from "../text/SemiBoldText";
import MediumText from "../text/MediumText";
import LightText from "../text/LightText";
import DateTimePicker from "@react-native-community/datetimepicker";
import { vs, ms, sc } from "../../constant/Dimension";
import Clock from "../../../assets/images/clock.svg";

const TimeInput = ({ text, time, setTime, setHasSelectedTimeProp }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hasSelectedTime, setHasSelectedTime] = useState(false);

  useEffect(() => {
    if (setHasSelectedTimeProp) {
      setHasSelectedTimeProp(hasSelectedTime);
    }
  }, [hasSelectedTime, setHasSelectedTimeProp]);

  const showDatePicker = () => setShowPicker(true);

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    if (selectedTime) {
      setTime(currentTime);
      setHasSelectedTime(true);
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <SemiBoldText text={text} size={15} />

      <TouchableOpacity style={styles.inputButton} onPress={showDatePicker}>
        <Clock />
        {hasSelectedTime ? (
          <MediumText text={formatTime(time)} size={12} />
        ) : (
          <LightText text="14:00" size={12} />
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: vs(10),
  },
  inputButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#999999",
    borderWidth: 1,
    borderRadius: ms(20),
    height: vs(62),
    gap: sc(7),
    width: sc(94),
    justifyContent: "center",
  },
});
export default TimeInput;

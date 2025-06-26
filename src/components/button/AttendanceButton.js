import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BoldText from "../text/BoldText";
import ClockIn from "../../../assets/images/clock-in.svg";
import ClockOut from "../../../assets/images/clock-out.svg";
import { ms, sc, vs } from "../../constant/Dimension";

const AttendanceButton = ({ text, onPress }) => {
  const Icon = text === "Clock - In" ? ClockIn : ClockOut;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon />
      <BoldText text={text} size={13} color="#F4F7FB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3A86FF",
    flexDirection: "row",
    width: sc(110),
    height: vs(40),
    borderRadius: ms(20),
    alignItems: "center",
    justifyContent: "center",
    gap: sc(2),
  },
});

export default AttendanceButton;

import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { sc, ms, vs } from "../../constant/Dimension";
import BoldText from "../text/BoldText";

const CancelButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <BoldText text={text} size={15} color="#F44336" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: sc(100),
    backgroundColor: "transparent",
    paddingVertical: vs(10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ms(20),
  },
});

export default CancelButton;

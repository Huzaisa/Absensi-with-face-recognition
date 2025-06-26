import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BoldText from "../text/BoldText";
import { ms, sc, vs } from "../../constant/Dimension";

const SaveButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <BoldText text={text} size={16} color="#F4F7FB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: sc(110),
    backgroundColor: "#3A86FF",
    paddingVertical: vs(12),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ms(20),
  },
});

export default SaveButton;

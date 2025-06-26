import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BoldText from "../text/BoldText";
import { ms, sc, vs } from "../../constant/Dimension";

const CommonButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <BoldText text={text} size={20} color="#F4F7FB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: sc(307),
    height: vs(55),
    borderRadius: ms(20),
    backgroundColor: "#3A86FF",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CommonButton;

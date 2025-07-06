import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BoldText from "../text/BoldText";
import { ms, sc, vs } from "../../constant/Dimension";

const DeleteButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <BoldText text={text} size={15} color="#F4F7FB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: sc(100),
    backgroundColor: "#F44336",
    paddingVertical: vs(9),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ms(20),
    flexDirection: "row",
  },
});

export default DeleteButton;

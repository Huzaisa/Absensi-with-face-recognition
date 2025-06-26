import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BoldText from "../text/BoldText";
import Plus from "../../../assets/images/plus.svg";
import { ms, sc, vs } from "../../constant/Dimension";

const PermissionButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Plus />
      <BoldText text={text} size={15} color="#F4F7FB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#3A86FF",
    paddingVertical: vs(10),
    width: sc(152),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ms(20),
  },
});

export default PermissionButton;

import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import BoldText from "../text/BoldText";
import { ms, sc, vs } from "../../constant/Dimension";
import PDF from "../../../assets/images/pdf.svg";
import Excel from "../../../assets/images/excel.svg";

const ExportButton = ({ text, onPress, type }) => {
  const backgroundColor = type === "pdf" ? "#DA2C1F" : "#129A12";
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: backgroundColor }]}
      onPress={onPress}
    >
      {type === "pdf" ? <PDF /> : <Excel />}

      <BoldText text={text} size={16} color="#F4F7FB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: sc(106),
    paddingVertical: vs(7),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ms(20),
    flexDirection: "row",
    gap: sc(4),
  },
});

export default ExportButton;

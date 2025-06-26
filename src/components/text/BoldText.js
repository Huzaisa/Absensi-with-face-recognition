import React from "react";
import { StyleSheet, Text } from "react-native";
import { ms } from "../../constant/Dimension";

const BoldText = ({ text, size, color = "#000000" }) => {
  return (
    <Text style={[styles.text, { color, fontSize: ms(size, 0.3) }]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "QuicksandBold",
  },
});

export default BoldText;

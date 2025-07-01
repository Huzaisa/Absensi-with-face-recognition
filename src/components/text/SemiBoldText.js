import React from "react";
import { StyleSheet, Text } from "react-native";
import { ms } from "../../constant/Dimension";

const SemiBoldText = ({ text, size, color = "#000000", capitalize }) => {
  return (
    <Text
      style={[
        styles.text,
        { color, fontSize: ms(size, 0.3) },
        capitalize && { textTransform: "capitalize" },
      ]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "QuicksandSemiBold",
  },
});

export default SemiBoldText;

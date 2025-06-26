import React from "react";
import { StyleSheet, Text } from "react-native";
import { ms } from "../../constant/Dimension";

const MediumText = ({ text, size, color = "#000000", textAlign }) => {
  return (
    <Text
      style={[
        styles.text,
        { color, fontSize: ms(size, 0.3) },
        textAlign && { textAlign: "center" },
      ]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "QuicksandMedium",
  },
});

export default MediumText;

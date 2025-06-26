import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import SemiBoldText from "../text/SemiBoldText";
import { ms, sc, vs } from "../../constant/Dimension";

const CummonInput = ({ text, setInput }) => {
  return (
    <View style={styles.container}>
      <SemiBoldText text={text} size={15} />

      <TextInput style={styles.input} onChangeText={setInput} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: vs(10),
  },
  input: {
    width: sc(290),
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: ms(10),
    fontFamily: "QuicksandMedium",
    fontSize: ms(14, 0.3),
    color: "#000",
    paddingLeft: sc(10),
  },
});

export default CummonInput;

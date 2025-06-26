import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import SemiBoldText from "../text/SemiBoldText";
import LightText from "../text/LightText";
import { ms, sc, vs } from "../../constant/Dimension";

const ReasonInput = ({ setReason }) => {
  const [isFocused, setIsFocused] = useState(false);
  const placeholder = "You can give your reasons here";

  return (
    <View style={styles.container}>
      <SemiBoldText text="Reason (Optional)" size={15} />

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={setReason}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline
        />

        {!isFocused && (
          <View style={styles.placeholderWrapper}>
            <LightText text={placeholder} size={13} color="#999999" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: vs(15),
  },
  inputWrapper: {
    position: "relative",
  },
  textInput: {
    width: sc(290),
    height: vs(145),
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: ms(20),
    fontFamily: "QuicksandMedium",
    fontSize: ms(14, 0.3),
    color: "#000",
    textAlignVertical: "top",
    paddingLeft: sc(15),
  },
  placeholderWrapper: {
    position: "absolute",
    top: "42%",
    left: "5%",
  },
});

export default ReasonInput;

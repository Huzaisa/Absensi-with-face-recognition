import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Arrow from "../../../assets/images/arrow-left.svg";
import BoldText from "../text/BoldText";
import MediumText from "../text/MediumText";
import { sc, vs } from "../../constant/Dimension";
import { useNavigation } from "@react-navigation/native";

const PermissionHeader = ({ headerText, descText }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Arrow />
      </TouchableOpacity>

      <View style={styles.textWrapper}>
        <BoldText text={headerText} size={23} />
        <View style={styles.descContainer}>
          <MediumText text={descText} size={13} textAlign />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: sc(20),
    marginLeft: sc(22),
  },
  backButton: {
    marginTop: vs(4),
  },
  textWrapper: {
    gap: vs(5),
    alignItems: "center",
  },
  descContainer: {
    width: sc(210),
  },
});

export default PermissionHeader;

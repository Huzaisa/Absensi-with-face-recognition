import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Menu from "../../../assets/images/menu.svg";
import MediumText from "../text/MediumText";

const MenuDrawerButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.openDrawer()}
    >
      <View style={styles.inner}>
        <Menu />
        <MediumText text="Menu" size={12} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  inner: {
    alignItems: "center",
  },
});

export default MenuDrawerButton;

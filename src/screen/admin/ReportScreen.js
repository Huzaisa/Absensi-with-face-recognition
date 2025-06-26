import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sc } from "../../constant/Dimension";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import ReportForm from "../../components/form/ReportForm";

const ReportScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <ReportForm />
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  menuWrapper: {
    paddingHorizontal: sc(22),
  },
});

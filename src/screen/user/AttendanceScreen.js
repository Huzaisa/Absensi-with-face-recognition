import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { sc, vs } from "../../constant/Dimension";
import CommonContentTable from "../../components/table/CommonContentTable";

const AttendanceScreen = () => {
  const headerData = [
    { key: "no", label: "No." },
    { key: "date", label: "Date" },
    { key: "clockIn", label: "Clock In" },
    { key: "clockOut", label: "Clock Out" },
  ];

  const bodyData = [
    { id: 1, no: "1", date: "16-06-2025", clockIn: "08:00", clockOut: "17:00" },
    { id: 2, no: "2", date: "15-06-2025", clockIn: "08:00", clockOut: "17:00" },
    { id: 3, no: "3", date: "14-06-2025", clockIn: "08:00", clockOut: "17:00" },
    { id: 4, no: "4", date: "13-06-2025", clockIn: "08:00", clockOut: "17:00" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.tableWrapper}>
        <CommonContentTable headerData={headerData} bodyData={bodyData} />
      </View>
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  menuWrapper: {
    paddingHorizontal: sc(22),
  },
  tableWrapper: {
    marginTop: vs(20),
    flex: 1,
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import PermissionButton from "../../components/button/PermissionButton";
import { sc, vs } from "../../constant/Dimension";
import CommonContentTable from "../../components/table/CommonContentTable";

const OvertimeScreen = () => {
  const navigation = useNavigation();

  const addOvertimePermission = () => {
    navigation.navigate("UserAddPermission", {
      headerText: "Overtime Permission",
      descText: "Fill out this form to apply for overtime permission",
      typeForm: "overtime",
    });
  };

  const headerData = [
    { key: "no", label: "No." },
    { key: "date", label: "Date" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "status", label: "Status" },
  ];

  const bodyData = [
    {
      id: 1,
      no: 1,
      date: "16-06-2025",
      startTime: "08:00",
      endTime: "16:00",
      status: "Approve",
    },
    {
      id: 2,
      no: 2,
      date: "2023-01-01",
      startTime: "18:00",
      endTime: "22:00",
      status: "Waiting",
    },
    {
      id: 3,
      no: 3,
      date: "2023-01-01",
      startTime: "18:00",
      endTime: "02:00",
      status: "Reject",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />

      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.buttonWrapper}>
        <PermissionButton
          text="Add Permission"
          onPress={addOvertimePermission}
        />
      </View>

      <View style={styles.tableWrapper}>
        <CommonContentTable headerData={headerData} bodyData={bodyData} />
      </View>
    </SafeAreaView>
  );
};

export default OvertimeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  menuWrapper: {
    paddingHorizontal: sc(22),
  },
  buttonWrapper: {
    paddingHorizontal: sc(22),
    marginTop: vs(20),
  },
  tableWrapper: {
    marginTop: vs(20),
    flex: 1,
  },
});

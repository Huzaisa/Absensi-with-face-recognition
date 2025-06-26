import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { StyleSheet, View } from "react-native";
import { sc, vs, ms } from "../../constant/Dimension";
import DropdownStatusContentTable from "../../components/table/DropdownStatusContentTable";

const OvertimeScreen = () => {
  const headerData = [
    {
      key: "no",
      label: "No.",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "startTime",
      label: "Start Time",
    },
    {
      key: "endTime",
      label: "End Time",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "fileUpload",
      label: "File",
    },
  ];

  const bodyData = [
    {
      id: 1,
      no: "1",
      date: "19-06-2025",
      startTime: "18:00",
      endTime: "22:00",
      name: "Arda",
      reason: "Work overtime",
      status: null,
      fileUpload: true,
    },
    {
      id: 2,
      no: "2",
      date: "20-06-2025",
      startTime: "08:00",
      endTime: "22:00",
      name: "Damar",
      reason: null,
      status: null,
      fileUpload: null,
    },
    {
      id: 3,
      no: "3",
      date: "21-06-2025",
      startTime: "07:00",
      endTime: "17:00",
      name: "Hajik",
      reason: "Work overtime",
      status: null,
      fileUpload: null,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.tableWrapper}>
        <DropdownStatusContentTable
          headerData={headerData}
          bodyData={bodyData}
        />
      </View>
    </SafeAreaView>
  );
};

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
  },
});

export default OvertimeScreen;

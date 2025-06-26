import React from "react";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import DropdownStatusContentTable from "../../components/table/DropdownStatusContentTable";

const LeaveScreen = () => {
  const headerData = [
    {
      key: "no",
      label: "No.",
    },
    {
      key: "startDate",
      label: "Start Date",
    },
    {
      key: "endDate",
      label: "End Date",
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
      startDate: "19-06-2025",
      endDate: "20-06-2025",
      name: "Arda",
      reason: "Holiday",
      status: null,
      fileUpload: true,
    },
    {
      id: 2,
      no: "2",
      startDate: "20-06-2025",
      endDate: "21-06-2025",
      name: "Damar",
      reason: null,
      status: null,
      fileUpload: null,
    },
    {
      id: 3,
      no: "3",
      startDate: "21-06-2025",
      endDate: "22-06-2025",
      name: "Hajik",
      reason: "Sick",
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

export default LeaveScreen;

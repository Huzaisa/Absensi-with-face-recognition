import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Modal, StyleSheet } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import PermissionButton from "../../components/button/PermissionButton";
import DropdownAssignContentTable from "../../components/table/DropdownAssignContentTable";
import CommonContentTable from "../../components/table/CommonContentTable";
import ShiftForm from "../../components/form/ShiftForm";

const ShiftScreen = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const headerData = [
    { key: "no", label: "No." },
    { key: "name", label: "Name" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "assign", label: "Assign" },
  ];
  const bodyData = [
    { id: 1, no: "1", name: "Shift 1", startTime: "08:00", endTime: "12:00" },
    { id: 2, no: "2", name: "Shift 2", startTime: "13:00", endTime: "17:00" },
    { id: 3, no: "3", name: "Shift 3", startTime: "18:00", endTime: "22:00" },
  ];

  const headerDataShift = [
    { key: "no", label: "No." },
    { key: "date", label: "Date" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "assigned", label: "Assigned" },
  ];
  const bodyDataShift = [
    {
      id: 1,
      no: 1,
      date: "19-06-2025",
      startTime: "08:00",
      endTime: "12:00",
      assigned: "Arda",
    },
    {
      id: 2,
      no: 2,
      date: "19-06-2025",
      startTime: "13:00",
      endTime: "17:00",
      assigned: "Hajik",
    },
    {
      id: 3,
      no: 4,
      date: "19-06-2025",
      startTime: "18:00",
      endTime: "22:00",
      assigned: "Damar",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.addPermissionWrapper}>
        <PermissionButton text="Add Shift" onPress={handleShowModal} />
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <ShiftForm onPress={handleCloseModal} />
      </Modal>

      <View style={styles.tableWrapper}>
        <DropdownAssignContentTable
          headerData={headerData}
          bodyData={bodyData}
        />
      </View>

      <View style={styles.tableWrapper}>
        <CommonContentTable
          headerData={headerDataShift}
          bodyData={bodyDataShift}
        />
      </View>
    </SafeAreaView>
  );
};

export default ShiftScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  menuWrapper: {
    paddingHorizontal: sc(22),
  },
  addPermissionWrapper: {
    paddingHorizontal: sc(22),
    marginTop: vs(20),
  },
  tableWrapper: {
    marginTop: vs(20),
  },
});

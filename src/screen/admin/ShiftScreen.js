import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Modal,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { sc, vs } from "../../constant/Dimension";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import PermissionButton from "../../components/button/PermissionButton";
import DropdownAssignContentTable from "../../components/table/DropdownAssignContentTable";
import CommonContentTable from "../../components/table/CommonContentTable";
import ShiftForm from "../../components/form/ShiftForm";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import useAuthStore from "../../stores/AuthStore";
import { StatusBar } from "expo-status-bar";

const ShiftScreen = () => {
  const { token, shiftData, setShiftData, assignedShift, setAssignedShift } =
    useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      console.log("Invalid date string provided to formatDate:", dateString);
      return "";
    }
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) {
      console.log("Invalid ISO string provided to formatTime:", isoString);
      return "";
    }
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onRefreshContent = useCallback(async () => {
    setRefreshing(true);

    try {
      const shiftDataResponse = await axios.get(
        `http://192.168.1.7:3000/api/shift/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedShiftData = shiftDataResponse.data.map((item, index) => ({
        id: item.id,
        no: (index + 1).toString(),
        name: item.name,
        startTime: item.startTime,
        endTime: item.endTime,
      }));

      setShiftData(formattedShiftData);

      const assignedShiftDataResponse = await axios.get(
        `http://192.168.1.7:3000/api/shift/mappings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const rawAssignedShifts = [...assignedShiftDataResponse.data];

      rawAssignedShifts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      const formattedAssignedShifts = rawAssignedShifts.map((item, index) => ({
        id: item.id,
        no: (index + 1).toString(),
        date: formatDate(item.date),
        startTime: formatTime(item.shift.startTime),
        endTime: formatTime(item.shift.endTime),
        assigned: item.user.name,
        userId: item.user.id,
      }));

      setAssignedShift(formattedAssignedShifts);
    } catch (error) {
      console.log(
        "Error fetching shift data:",
        error.response ? error.response.data : error.message,
      );
    } finally {
      setRefreshing(false);
    }
  }, [token, setShiftData, setAssignedShift]);

  useFocusEffect(
    useCallback(() => {
      onRefreshContent();
      return () => {
        console.log("ShiftScreen is blurring...");
      };
    }, [onRefreshContent]),
  );

  const headerShiftData = [
    { key: "no", label: "No." },
    { key: "name", label: "Name" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "assign", label: "Assign" },
  ];

  const headerAssignedShiftData = [
    { key: "no", label: "No." },
    { key: "date", label: "Date" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "assigned", label: "Assigned" },
    { key: "action", label: "Action" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <ShiftForm onDismiss={handleCloseModal} onRefresh={onRefreshContent} />
      </Modal>

      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.addPermissionWrapper}>
        <PermissionButton text="Add Shift" onPress={handleShowModal} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshContent}
          />
        }
      >
        <View style={styles.tableWrapper}>
          <DropdownAssignContentTable
            headerData={headerShiftData}
            bodyData={shiftData}
            onRefresh={onRefreshContent}
          />
        </View>

        <View style={styles.tableWrapper}>
          <CommonContentTable
            headerData={headerAssignedShiftData}
            bodyData={assignedShift}
            onRefresh={onRefreshContent}
          />
        </View>
      </ScrollView>
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
  addPermissionWrapper: {
    paddingHorizontal: sc(22),
    marginTop: vs(20),
    marginBottom: vs(5),
  },
  scrollViewContent: {
    paddingBottom: vs(20),
  },
  tableWrapper: {
    marginTop: vs(20),
  },
});

export default ShiftScreen;

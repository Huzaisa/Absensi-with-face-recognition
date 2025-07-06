import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { sc, vs } from "../../constant/Dimension";
import CommonContentTable from "../../components/table/CommonContentTable";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { useFocusEffect } from "@react-navigation/native";

const AttendanceScreen = () => {
  const { token, attendanceHistoryData, setAttendanceHistoryData } =
    useAuthStore();

  const formatDate = (dateString) => {
    const parts = dateString.split("-");

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");

    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  useFocusEffect(
    useCallback(() => {
      fetchAttendanceData();

      return () => {
        console.log("AttendanceScreen is blurring...");
      };
    }, [fetchAttendanceData]),
  );

  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.7:3000/api/attendance/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data && Array.isArray(response.data.history)) {
        const formattedData = response.data.history.map((item, index) => ({
          id: index + 1,
          no: (index + 1).toString(),
          date: formatDate(item.date),
          clockIn: item.clockIn || "-",
          clockOut: item.clockOut || "-",
        }));
        setAttendanceHistoryData(formattedData);
      } else {
        console.log("API response.data.history is not an array or is missing.");
        setAttendanceHistoryData([]);
      }
    } catch (error) {
      console.log(
        "Error fetching attendance data:",
        error.response ? error.response.data : error.message,
      );
      setAttendanceHistoryData([]);
    }
  }, [token]);

  const headerData = [
    { key: "no", label: "No." },
    { key: "date", label: "Date" },
    { key: "clockIn", label: "Clock In" },
    { key: "clockOut", label: "Clock Out" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.tableWrapper}>
        <CommonContentTable
          headerData={headerData}
          bodyData={attendanceHistoryData}
        />
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

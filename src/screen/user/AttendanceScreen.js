import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { sc, vs } from "../../constant/Dimension";
import CommonContentTable from "../../components/table/CommonContentTable";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";

const AttendanceScreen = () => {
  const { token } = useAuthStore();
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API}/api/attendance/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.history)) {
        const formattedData = response.data.history.map((item, index) => ({
          id: index + 1,
          no: (index + 1).toString(),
          date: item.date
            ? new Date(item.date)
                .toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "-")
            : "",
          clockIn: item.clockIn || "",
          clockOut: item.clockOut || "",
        }));
        setAttendanceData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

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
        <CommonContentTable headerData={headerData} bodyData={attendanceData} />
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

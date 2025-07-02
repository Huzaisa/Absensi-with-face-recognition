import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import PermissionButton from "../../components/button/PermissionButton";
import { sc, vs } from "../../constant/Dimension";
import CommonContentTable from "../../components/table/CommonContentTable";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";

const OvertimeScreen = () => {
  const navigation = useNavigation();
  const { token, overtimeData, setOvertimeData } = useAuthStore();

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const fetchOvertimeData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API}/api/overtime/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedData = response.data.map((item, index) => {
        const startTime = new Date(item.startTime).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const endTime = new Date(item.endTime).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        let statusText = "";
        if (item.approved === false) {
          statusText = "Waiting";
        } else if (item.approved === true) {
          statusText = "Approve";
        } else {
          statusText = "Reject";
        }

        return {
          id: item.id,
          no: (index + 1).toString(),
          date: formatDate(item.date),
          startTime: startTime,
          endTime: endTime,
          status: statusText,
        };
      });
      setOvertimeData(formattedData);
    } catch (error) {
      console.log(
        "Error fetching overtime permission data:",
        error.response ? error.response.data : error.message,
      );
    }
  }, [token, setOvertimeData]);

  useFocusEffect(
    useCallback(() => {
      fetchOvertimeData();

      return () => {
        console.log("OvertimeScreen is blurring...");
      };
    }, [fetchOvertimeData]),
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

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
        <CommonContentTable headerData={headerData} bodyData={overtimeData} />
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

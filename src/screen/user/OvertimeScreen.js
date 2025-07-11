import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
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

  const status = (type) => {
    if (type.approved && type.approverId !== null) {
      return "APPROVED";
    }
    if (type.approved === false && type.approverId !== null) {
      return "REJECTED";
    } else {
      return "PENDING";
    }
  };

  const onRefreshContent = useCallback(async () => {
    setRefreshing(true);

    try {
      const response = await axios.get(
        `http://192.168.1.7:3000/api/overtime/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        no: (index + 1).toString(),
        date: formatDate(item.date),
        startTime: formatTime(item.startTime),
        endTime: formatTime(item.endTime),
        status: status(item),
      }));

      setOvertimeData(formattedData);
    } catch (error) {
      console.log(
        "Error fetching overtime permission data:",
        error.response ? error.response.data : error.message,
      );
    } finally {
      setRefreshing(false);
    }
  }, [token, setOvertimeData]);

  useFocusEffect(
    useCallback(() => {
      onRefreshContent();

      return () => {
        console.log("OvertimeScreen is blurring...");
      };
    }, [onRefreshContent]),
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
          <CommonContentTable headerData={headerData} bodyData={overtimeData} />
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
  buttonWrapper: {
    paddingHorizontal: sc(22),
    marginTop: vs(25),
    marginBottom: vs(10),
  },
  scrollViewContent: {
    paddingBottom: vs(20),
  },
  tableWrapper: {
    marginTop: vs(20),
    flex: 1,
  },
});

export default OvertimeScreen;

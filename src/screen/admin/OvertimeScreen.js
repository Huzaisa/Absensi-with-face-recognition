import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import DropdownStatusContentTable from "../../components/table/DropdownStatusContentTable";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const OvertimeScreen = () => {
  const { token, overtimeAllData, setOvertimeAllData } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

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
      const overtimeDataResponse = await axios.get(
        `http://192.168.100.108:3000/api/overtime/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedOvertimeData = overtimeDataResponse.data.map(
        (item, index) => ({
          no: (index + 1).toString(),
          id: item.id,
          date: formatDate(item.date),
          startTime: formatTime(item.startTime),
          endTime: formatTime(item.endTime),
          name: item.user.name,
          reason: item.reason,
          status: status(item),
          fileUpload: item.document ? item.document.fileName : false,
        }),
      );

      setOvertimeAllData(formattedOvertimeData);
    } catch (error) {
      console.log("Error fetching overtime data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [token, setOvertimeAllData]);

  useFocusEffect(
    useCallback(() => {
      onRefreshContent();
      return () => {
        console.log("OvertimeScreen is blurring");
      };
    }, [onRefreshContent]),
  );

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
      key: "action",
      label: "Action",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshContent}
          />
        }
      >
        <View style={styles.menuWrapper}>
          <MenuDrawerButton />
        </View>

        <View style={styles.tableWrapper}>
          <DropdownStatusContentTable
            headerData={headerData}
            bodyData={overtimeAllData}
            type={"overtime"}
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
  scrollViewContent: {
    paddingBottom: vs(20),
  },
  menuWrapper: {
    paddingHorizontal: sc(22),
  },
  tableWrapper: {
    marginTop: vs(20),
  },
});

export default OvertimeScreen;

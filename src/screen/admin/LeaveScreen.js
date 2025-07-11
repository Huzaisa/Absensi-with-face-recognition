import React, { useCallback, useState } from "react";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { sc, vs } from "../../constant/Dimension";
import DropdownStatusContentTable from "../../components/table/DropdownStatusContentTable";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { StatusBar } from "expo-status-bar";

const LeaveScreen = () => {
  const { token, leaveAllData, setLeaveAllData } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const onRefreshContent = useCallback(async () => {
    setRefreshing(true);

    try {
      const leaveDataResponse = await axios.get(
        `http://192.168.1.7:3000/api/leave/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedLeaveData = leaveDataResponse.data.map((item, index) => ({
        id: item.id,
        no: (index + 1).toString(),
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        name: item.user.name,
        reason: item.reason,
        status: item.status,
        fileUpload: item.document ? item.document.fileName : false,
      }));

      setLeaveAllData(formattedLeaveData);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [token, setLeaveAllData]);

  useFocusEffect(
    useCallback(() => {
      onRefreshContent();
      return () => {
        console.log("LeaveScreen is blurring");
      };
    }, [onRefreshContent]),
  );

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
            bodyData={leaveAllData}
            type={"leave"}
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

export default LeaveScreen;

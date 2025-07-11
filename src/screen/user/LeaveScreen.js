import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { sc, vs } from "../../constant/Dimension";

import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import PermissionButton from "../../components/button/PermissionButton";
import LeaveStatusCard from "../../components/card/LeaveStatusCard";

const LeaveScreen = () => {
  const navigation = useNavigation();
  const { token, leaveData, setLeaveData } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefreshContent = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`http://192.168.1.7:3000/api/leave/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaveData(response.data);
    } catch (error) {
      console.log(
        "Error fetching leave permission data:",
        error.response ? error.response.data : error.message,
      );
    } finally {
      setRefreshing(false);
    }
  }, [token, setLeaveData]);

  useFocusEffect(
    useCallback(() => {
      onRefreshContent();

      return () => {
        console.log("LeaveScreen is blurring...");
      };
    }, [onRefreshContent]),
  );

  const formatDate = (date) => {
    const parts = date.split("-");

    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${day} ${months[monthIndex]} ${year}`;
  };

  const addLeavePermission = () => {
    navigation.navigate("UserAddPermission", {
      headerText: "Leave Permission",
      descText: "Fill out this form to apply for leave permission",
      typeForm: "leave",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <View style={styles.menuWrapper}>
        <MenuDrawerButton />
      </View>

      <View style={styles.addPermissionWrapper}>
        <PermissionButton text="Add Permission" onPress={addLeavePermission} />
      </View>

      <ScrollView
        contentContainerStyle={styles.cardsScrollViewContent}
        style={styles.cardsScrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshContent}
          />
        }
      >
        <View style={styles.cardsWrapper}>
          {leaveData && leaveData.length > 0 ? (
            leaveData.map((leave, index) => (
              <LeaveStatusCard
                key={leave.id || index}
                status={leave.status}
                startDate={formatDate(leave.startDate)}
                endDate={formatDate(leave.endDate)}
              />
            ))
          ) : (
            <LeaveStatusCard status={null} />
          )}
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
    marginTop: vs(25),
    marginBottom: vs(10),
  },
  cardsScrollViewContent: {
    paddingBottom: vs(20),
  },
  cardsScrollView: {
    maxHeight: vs(576),
  },
  cardsWrapper: {
    marginTop: vs(20),
    alignItems: "center",
    gap: vs(20),
  },
});

export default LeaveScreen;

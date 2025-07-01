import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import { ms, sc, vs } from "../../constant/Dimension";
import { StatusBar } from "expo-status-bar";
import PermissionButton from "../../components/button/PermissionButton";
import LeaveStatusCard from "../../components/card/LeaveStatusCard";
import { useNavigation } from "@react-navigation/native";

const LeaveScreen = () => {
  const navigation = useNavigation();
  const [leaveStatus, setLeaveStatus] = useState("Waiting");

  useEffect(() => {
    getLeavePermission();
  }, []);

  const getLeavePermission = async () => {
    // TODO: fetch leave status
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

      <View style={styles.cardsWrapper}>
        <LeaveStatusCard
          status="Waiting"
          startDate={"Fri, 4 July 2025"}
          endDate={"Fri, 11 July 2025"}
        />
        <LeaveStatusCard
          status="Approve"
          startDate={"Fri, 4 July 2025"}
          endDate={"Fri, 11 July 2025"}
        />
        <LeaveStatusCard
          status="Reject"
          startDate={"Fri, 4 July 2025"}
          endDate={"Fri, 11 July 2025"}
        />
        <LeaveStatusCard status={null} />
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
  addPermissionWrapper: {
    paddingHorizontal: sc(22),
    marginTop: vs(20),
  },
  cardsWrapper: {
    marginTop: vs(20),
    alignItems: "center",
    gap: vs(20),
  },
});

export default LeaveScreen;

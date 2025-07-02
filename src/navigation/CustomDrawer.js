import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ToastAndroid,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { vs, sc, ms } from "../constant/Dimension";
import SemiBoldText from "../components/text/SemiBoldText";
import RegularText from "../components/text/RegularText";
import MediumText from "../components/text/MediumText";
import BoldText from "../components/text/BoldText";
import Arrow from "../../assets/images/arrow-right.svg";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import useAuthStore from "../stores/AuthStore";
// Off Icons
import HomeOff from "../../assets/images/home-off.svg";
import AttendanceOff from "../../assets/images/attendance-off.svg";
import OvertimeOff from "../../assets/images/overtime-off.svg";
import LeaveOff from "../../assets/images/leave-off.svg";
import ReportOff from "../../assets/images/report-off.svg";
import ShiftOff from "../../assets/images/shift-off.svg";
// On Icons
import HomeOn from "../../assets/images/home-on.svg";
import AttendanceOn from "../../assets/images/attendance-on.svg";
import OvertimeOn from "../../assets/images/overtime-on.svg";
import LeaveOn from "../../assets/images/leave-on.svg";
import ReportOn from "../../assets/images/report-on.svg";
import ShiftOn from "../../assets/images/shift-on.svg";
import axios from "axios";

const CustomDrawer = (props) => {
  const {
    isAdmin,
    logout,
    setEmployeeData,
    token,
    profilePhotoUrl,
    name,
    role,
  } = useAuthStore();

  useEffect(() => {
    if (isAdmin) {
      fetchEmployeesData();
    }
  });

  const fetchEmployeesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API}/api/users/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DATA EMPLOYEE", response.data);
    } catch (error) {}
  };

  const adminMenuItems = [
    { name: "Home", label: "Home", iconOn: HomeOn, iconOff: HomeOff },
    { name: "AdminShift", label: "Shift", iconOn: ShiftOn, iconOff: ShiftOff },
    {
      name: "AdminOvertime",
      label: "Overtime",
      iconOn: OvertimeOn,
      iconOff: OvertimeOff,
    },
    { name: "AdminLeave", label: "Leave", iconOn: LeaveOn, iconOff: LeaveOff },
    {
      name: "AdminReport",
      label: "Report",
      iconOn: ReportOn,
      iconOff: ReportOff,
    },
  ];

  const userMenuItems = [
    { name: "Home", label: "Home", iconOn: HomeOn, iconOff: HomeOff },
    {
      name: "UserAttendance",
      label: "Attendance",
      iconOn: AttendanceOn,
      iconOff: AttendanceOff,
    },
    {
      name: "UserOvertime",
      label: "Overtime Permission",
      iconOn: OvertimeOn,
      iconOff: OvertimeOff,
    },
    {
      name: "UserLeave",
      label: "Leave Permission",
      iconOn: LeaveOn,
      iconOff: LeaveOff,
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const getCurrentRoute = () => props.state.routeNames[props.state.index];

  const handleLogout = () => {
    Alert.alert(
      "Warning!",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Log out",
          onPress: () => {
            ToastAndroid.show("Log out successful", ToastAndroid.SHORT);
            setTimeout(() => {
              logout();
              props.navigation.navigate("Login");
            }, 2000);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const defaultProfile = require("../../assets/images/user.png");

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawer}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.profileWrapper}>
        <View style={styles.profileRow}>
          <Image
            source={profilePhotoUrl ? { uri: profilePhotoUrl } : defaultProfile}
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <SemiBoldText text={name} size={15} color="#F4F7FB" capitalize />
            <RegularText text={role} size={12} color="#F4F7FB" />
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => props.navigation.closeDrawer()}
          >
            <Arrow />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        {menuItems.map((item, idx) => {
          const isActive = getCurrentRoute() === item.name;
          const IconComponent = isActive ? item.iconOn : item.iconOff;
          return (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              onPress={() => props.navigation.navigate(item.name)}
            >
              <View
                style={[
                  styles.menuRow,
                  isAdmin
                    ? styles.menuRowAdminMargin
                    : styles.menuRowUserMargin,
                ]}
              >
                <IconComponent width={sc(25)} height={vs(25)} />
                {isActive ? (
                  <BoldText text={item.label} size={14} color="#F4F7FB" />
                ) : (
                  <MediumText text={item.label} size={14} color="#F4F7FB" />
                )}
              </View>
              <View style={styles.menuDivider} />
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <BoldText text="Log Out" size={20} color="#F4F7FB" />
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "#3A86FF",
  },
  drawerContent: {
    flex: 1,
    gap: vs(20),
  },
  profileWrapper: {
    alignSelf: "flex-start",
    paddingLeft: sc(15),
  },
  profileRow: {
    alignSelf: "center",
    flexDirection: "row",
    gap: sc(19),
  },
  profileImage: {
    width: sc(52),
    height: vs(52),
    borderRadius: ms(52),
  },
  profileText: {
    gap: vs(2),
    alignItems: "center",
    flex: 1,
  },
  closeButton: {
    alignSelf: "center",
  },
  menuWrapper: {
    flex: 1,
  },
  menuItem: {
    alignItems: "flex-start",
    gap: vs(20),
  },
  menuRow: {
    flexDirection: "row",
    gap: sc(20),
  },
  menuRowAdminMargin: {
    marginHorizontal: sc(70),
  },
  menuRowUserMargin: {
    marginHorizontal: sc(55),
  },
  menuDivider: {
    width: "100%",
    borderBottomWidth: 1,
    marginBottom: vs(20),
    borderColor: "rgba(244,247,251,0.2)",
  },
  logoutButton: {
    alignItems: "center",
    borderColor: "#F4F7FB",
    borderWidth: 2,
    borderRadius: ms(20),
    marginHorizontal: sc(20),
    paddingVertical: vs(15),
  },
});

export default CustomDrawer;

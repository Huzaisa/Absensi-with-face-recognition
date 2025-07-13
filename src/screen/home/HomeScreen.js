import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  StyleSheet,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ms, sc, vs } from "../../constant/Dimension";
import SemiBoldText from "../../components/text/SemiBoldText";
import RegularText from "../../components/text/RegularText";
import MenuDrawerButton from "../../components/button/MenuDrawerButton";
import HomeScreenTime from "../../components/time/HomeScreenTime";
import Alarm from "../../../assets/images/alarm.svg";
import BoldText from "../../components/text/BoldText";
import useAuthStore from "../../stores/AuthStore";
import MediumText from "../../components/text/MediumText";
import AttendanceButton from "../../components/button/AttendanceButton";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import CameraView from "../../components/camera/CameraView";

const HomeScreen = () => {
  const {
    isAdmin,
    name,
    token,
    photo,
    role,
    clockIn,
    setClockOut,
    clockOut,
    userId,
    startTimeShift,
    endTimeShift,
    setStartTimeShift,
    setEndTimeShift,
    profilePhotoUrl,
    setProfilePhotoUrl,
    setEmployeeData,
    attendanceStatus,
    setClockIn,
    setAttendanceStatus,
  } = useAuthStore();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);
  const [isAttendance, setAttendance] = useState(false);

  const closeCamera = () => {
    setShowCamera(false);
    setCameraKey(0);
  };

  const retryCameraProcess = () => {
    setCameraKey((prevKey) => prevKey + 1);
    setShowCamera(true);
  };

  const handleCameraError = (error) => {
    console.log("Error from CameraView:", error);
    Alert.alert(
      "Error!",
      error,
      [
        {
          text: "Cancel",
          onPress: closeCamera,
          style: "cancel",
        },
        {
          text: "Try Again",
          onPress: retryCameraProcess,
        },
      ],
      { cancelable: false },
    );
  };

  const handleClockIn = () => {
    setShowCamera(true);
  };

  const handleClockOut = async () => {
    setAttendance(true);

    try {
      const response = await axios.post(
        `http://192.168.1.8:3000/api/attendance/clock-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const clockOutTime = new Date(
        response.data.attendance.clockOut,
      ).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      setClockOut(clockOutTime);

      ToastAndroid.show(`Clock-Out Successful`, ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Warning!", error.response.data.message);
    } finally {
      setAttendance(false);
    }
  };

  const fetchProfileImage = async () => {
    if (photo) {
      const imageUrl = `http://192.168.1.8:3000/employee_faces/${photo}`;
      setProfilePhotoUrl(imageUrl);
    } else {
      setProfilePhotoUrl(null);
    }
  };

  const formatDate = () => {
    const dateNow = new Date();
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchTodayShift = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.8:3000/api/shift/user/${userId}/date/${formatDate()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const startTime = response.data.shift.startTime;
      const endTime = response.data.shift.endTime;
      setStartTimeShift(startTime);
      setEndTimeShift(endTime);
    } catch (error) {
      console.log(
        "Error fetching shift today data:",
        error.response ? error.response.data : error.message,
      );
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.8:3000/api/attendance/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
      const todayDate = formatDate();

      // Mencari data kehadiran untuk tanggal hari ini
      const todayAttendance = response.data.history.find(
        (record) => record.date === todayDate,
      );

      if (todayAttendance) {
        setClockIn(todayAttendance.clockIn || null);
        setClockOut(todayAttendance.clockOut || null);
        setAttendanceStatus(todayAttendance.status || null);
      } else {
        setClockIn(null);
        setClockOut(null);
        setAttendanceStatus(null);
      }
    } catch (error) {
      console.log(
        "Error fetching attendance data:",
        error.response ? error.response.data : error.message,
      );

      setClockIn(null);
      setClockOut(null);
      setAttendanceStatus(null);
    }
  };

  useEffect(() => {
    fetchProfileImage();
    fetchTodayShift();
    fetchAttendance();

    if (isAdmin) {
      fetchEmployeesData();
    }
  }, [photo, isAdmin, userId, token]);

  const fetchEmployeesData = async () => {
    try {
      const response = await axios.get(`http://192.168.1.8:3000/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const employeeList = response.data
        .filter((user) => user.role === "EMPLOYEE")
        .map((user) => ({
          id: user.id,
          name: user.name,
        }));

      setEmployeeData(employeeList);
    } catch (error) {
      console.log(
        "Error fetching employee data:",
        error.response ? error.response.data : error.message,
      );
    }
  };

  const attendanceStatusColor = () => {
    if (attendanceStatus === "ONTIME") {
      return "#4CAF50";
    } else if (attendanceStatus === "LATE") {
      return "#F44336";
    } else {
      return null;
    }
  };

  const defaultProfile = require("../../../assets/images/user.png");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {showCamera ? (
        <CameraView
          key={cameraKey}
          CloseCamera={closeCamera}
          onCameraError={handleCameraError}
        />
      ) : (
        <>
          <View style={styles.menuWrapper}>
            <MenuDrawerButton />
          </View>

          <View style={styles.greetingContainer}>
            <SemiBoldText text="Hello, Welcome Back!" size={15} />
          </View>

          <View style={styles.profileContainer}>
            <Image
              source={
                profilePhotoUrl ? { uri: profilePhotoUrl } : defaultProfile
              }
              style={styles.avatar}
            />

            <View style={styles.profileText}>
              <SemiBoldText text={name} size={13} capitalize={true} />
              <RegularText text={role} size={10} />
            </View>

            <View style={styles.timeWrapper}>
              <HomeScreenTime />
            </View>
          </View>

          {!isAdmin && (
            <>
              <View style={styles.shiftHeader}>
                <Alarm width={sc(22)} height={vs(22)} />
                <SemiBoldText text="Today Shift" />
              </View>

              <View style={styles.shiftTimes}>
                <View style={styles.shiftPair}>
                  <SemiBoldText text="Start:" size={15} />
                  <RegularText text={startTimeShift} size={18} />
                </View>

                <View style={styles.shiftPair}>
                  <SemiBoldText text="End:" size={15} />
                  <RegularText text={endTimeShift} size={18} />
                </View>
              </View>
            </>
          )}

          <View
            style={[
              styles.banner,
              isAdmin ? styles.bannerAdmin : styles.bannerUser,
            ]}
          >
            <BoldText
              text={
                isAdmin
                  ? "DON’T MISS CHECKING REQUEST TODAY!"
                  : "DON’T MISS ATTENDANCE TODAY!"
              }
              size={isAdmin ? 17 : 18}
            />
          </View>

          {!isAdmin && (
            <View style={styles.attendanceSection}>
              <View style={styles.shiftPair}>
                <SemiBoldText text={"Status: "} size={15} />

                <MediumText
                  text={attendanceStatus || "-"}
                  color={attendanceStatusColor()}
                  size={15}
                />
              </View>

              <View style={styles.attendanceContainer}>
                <View style={styles.attendanceHeader}>
                  <SemiBoldText text="CLOCK IN" size={15} />
                  <SemiBoldText text="CLOCK OUT" size={15} />
                </View>
                <View style={styles.lineSeparator} />

                <View
                  style={[
                    styles.attendanceTimes,
                    clockIn || clockOut
                      ? {
                          paddingLeft: sc(36),
                          paddingRight: 38,
                          justifyContent: "space-between",
                        }
                      : { justifyContent: "space-around" },
                  ]}
                >
                  <MediumText text={clockIn || "-"} size={clockIn ? 20 : 30} />
                  {isAttendance ? (
                    <ActivityIndicator size={"large"} />
                  ) : (
                    <MediumText
                      text={clockOut || "-"}
                      size={clockOut ? 20 : 30}
                    />
                  )}
                </View>

                <View style={styles.attendanceButtons}>
                  <AttendanceButton text="Clock - In" onPress={handleClockIn} />

                  <AttendanceButton
                    text="Clock - Out"
                    onPress={handleClockOut}
                  />
                </View>
              </View>
            </View>
          )}
        </>
      )}
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
  greetingContainer: {
    marginTop: vs(20),
    alignItems: "flex-start",
    paddingHorizontal: sc(22),
  },
  profileContainer: {
    flexDirection: "row",
    marginTop: vs(10),
    paddingHorizontal: sc(22),
  },
  avatar: {
    width: sc(48),
    height: sc(48),
    borderRadius: ms(48),
  },
  profileText: {
    marginLeft: sc(10),
    alignItems: "center",
    gap: vs(2),
  },
  timeWrapper: {
    flex: 1,
    alignItems: "flex-end",
  },
  shiftHeader: {
    flexDirection: "row",
    marginTop: vs(15),
    gap: sc(5),
    paddingHorizontal: sc(22),
  },
  shiftTimes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vs(20),
    paddingHorizontal: sc(5),
  },
  shiftPair: {
    flexDirection: "row",
    alignItems: "center",
    gap: sc(5),
  },
  banner: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: sc(1),
    marginBottom: vs(30),
  },
  bannerUser: {
    marginTop: vs(70),
  },
  bannerAdmin: {
    marginTop: vs(100),
  },
  attendanceSection: {
    marginTop: vs(10),
    marginHorizontal: sc(22),
    gap: vs(14),
  },
  attendanceContainer: {
    borderColor: "#999999",
    borderWidth: 1,
    borderRadius: ms(20),
    paddingTop: vs(10),
  },
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: sc(36),
    paddingRight: sc(27),
  },
  lineSeparator: {
    width: "95%",
    borderBottomWidth: 1,
    borderColor: "#999999",
    alignSelf: "center",
    marginTop: vs(5),
  },
  attendanceTimes: {
    flexDirection: "row",
    paddingTop: vs(30),
  },
  attendanceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: sc(15),
    marginTop: vs(40),
    marginBottom: vs(20),
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});

export default HomeScreen;

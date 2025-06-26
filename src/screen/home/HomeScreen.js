import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Button,
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
import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";

const HomeScreen = () => {
  const { isAdmin, token } = useAuthStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);

  // Handle camera permission
  if (!permission) {
    return <View />;
  }

  if (!permission.granted && !showCamera) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", paddingBottom: vs(10) }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleClockIn = () => {
    setShowCamera(true);
  };

  const hitAPI = async () => {
    // if (permission.granted) {
    //   await axios.post(
    //     `${process.env.EXPO_PUBLIC_API}/api/attendance/clock-in`,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     },
    //   );
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />

      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="front">
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 0,

                alignSelf: "center",
                paddingHorizontal: sc(50),
                paddingVertical: vs(20),

                borderRadius: ms(20),
                backgroundColor: "#3A86FF",
              }}
              onPress={hitAPI}
            >
              <BoldText text={"Capture"} size={20} color="#fff" />
            </TouchableOpacity>
          </CameraView>
        </View>
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
              source={require("../../../assets/images/user.png")}
              style={styles.avatar}
            />

            <View style={styles.profileText}>
              <SemiBoldText text="Holand Bakery" size={13} />
              <RegularText text="Mobile Developer" size={10} />
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
                  <SemiBoldText text="Start: " size={15} />
                  <RegularText text="08:00" size={18} />
                </View>
                <View style={styles.shiftPair}>
                  <SemiBoldText text="End: " size={15} />
                  <RegularText text="17:00" size={18} />
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
            <View style={styles.attendanceContainer}>
              <View style={styles.attendanceHeader}>
                <SemiBoldText text="CLOCK IN" size={15} />
                <SemiBoldText text="CLOCK OUT" size={15} />
              </View>

              <View style={styles.lineSeparator} />

              <View style={styles.attendanceTimes}>
                <MediumText text="08:00:00" size={20} />
                <MediumText text="17:00:00" size={20} />
              </View>

              <View style={styles.attendanceButtons}>
                <AttendanceButton text="Clock - In" onPress={handleClockIn} />
                <AttendanceButton text="Clock - Out" />
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
  attendanceContainer: {
    marginTop: vs(30),
    borderColor: "#999999",
    borderWidth: 1,
    marginHorizontal: sc(22),
    borderRadius: ms(20),
    paddingTop: vs(10),
  },
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: sc(22),
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
    justifyContent: "space-between",
    paddingHorizontal: sc(22),
    paddingTop: vs(30),
  },
  attendanceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: sc(10),
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

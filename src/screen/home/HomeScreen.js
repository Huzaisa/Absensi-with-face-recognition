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
  ToastAndroid,
  Alert,
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
  const { isAdmin, name, token, photo, role } = useAuthStore();
  const [showCamera, setShowCamera] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  const handleShowCamera = () => {
    setShowCamera(!showCamera);
  };

  const handleClockIn = () => {
    handleShowCamera();
  };

  const handleClockOut = async () => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API}/api/attendance/clock-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Response: ", response.data);

      ToastAndroid.show(`Clock-Out Successful`, ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Warning!", error.response.data.message);
    }
  };

  const fetchProfileImage = async () => {
    if (photo) {
      const imageUrl = `http://192.168.1.7:8000/employee_faces/${photo}`;
      setProfilePhotoUrl(imageUrl);
      console.log(imageUrl);
    } else {
      setProfilePhotoUrl(null);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, [photo]);

  const defaultProfile = require("../../../assets/images/user.png");
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {showCamera ? (
        <CameraView CloseCamera={handleShowCamera} />
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
                <AttendanceButton text="Clock - Out" onPress={handleClockOut} />
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

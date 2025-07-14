import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import LoginScreen from "../screen/auth/LoginScreen";
import RegisterScreen from "../screen/auth/RegisterScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./CustomDrawer";
import HomeScreen from "../screen/home/HomeScreen";
//User Screen
import UserAttendanceScreen from "../screen/user/AttendanceScreen";
import UserLeaveScreen from "../screen/user/LeaveScreen";
import UserOvertimeScreen from "../screen/user/OvertimeScreen";
//Admin Screen
import AdminOvertimeScreen from "../screen/admin/OvertimeScreen";
import AdminReportScreen from "../screen/admin/ReportScreen";
import AdminShiftScreen from "../screen/admin/ShiftScreen";
import AdminLeaveScreen from "../screen/admin/LeaveScreen";
import AddPermissionScreen from "../screen/user/AddPermissionScreen";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, drawerType: "slide" }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />

      {/* User Screens */}
      <Drawer.Screen name="UserAttendance" component={UserAttendanceScreen} />
      <Drawer.Screen name="UserOvertime" component={UserOvertimeScreen} />
      <Drawer.Screen name="UserLeave" component={UserLeaveScreen} />

      {/* Admin Screens */}
      <Drawer.Screen name="AdminShift" component={AdminShiftScreen} />
      <Drawer.Screen name="AdminOvertime" component={AdminOvertimeScreen} />
      <Drawer.Screen name="AdminLeave" component={AdminLeaveScreen} />
      <Drawer.Screen name="AdminReport" component={AdminReportScreen} />
    </Drawer.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      //initialRouteName="Drawer"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="UserAddPermission" component={AddPermissionScreen} />
    </Stack.Navigator>
  );
};

const Main = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  const [fontLoaded] = useFonts({
    QuicksandLight: require("../../assets/font/Quicksand/Quicksand-Light.ttf"),
    QuicksandRegular: require("../../assets/font/Quicksand/Quicksand-Regular.ttf"),
    QuicksandMedium: require("../../assets/font/Quicksand/Quicksand-Medium.ttf"),
    QuicksandSemiBold: require("../../assets/font/Quicksand/Quicksand-SemiBold.ttf"),
    QuicksandBold: require("../../assets/font/Quicksand/Quicksand-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontLoaded) {
    return null;
  }

  return <Main />;
}

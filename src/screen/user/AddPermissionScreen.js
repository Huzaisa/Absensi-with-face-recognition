import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sc, vs } from "../../constant/Dimension";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import PermissionHeader from "../../components/header/PermissionHeader";
import LeavePermissionForm from "../../components/form/LeavePermissionForm";
import OvertimePermissionForm from "../../components/form/OvertimePermissionForm";

const AddPermissionScreen = () => {
  const route = useRoute();
  const { headerText, descText, typeForm } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PermissionHeader headerText={headerText} descText={descText} />

        <View style={styles.formWrapper}>
          {typeForm === "leave" ? (
            <LeavePermissionForm />
          ) : (
            <OvertimePermissionForm />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  scrollContent: {
    paddingBottom: vs(10),
  },
  formWrapper: {
    marginHorizontal: sc(25),
    marginTop: sc(20),
  },
});

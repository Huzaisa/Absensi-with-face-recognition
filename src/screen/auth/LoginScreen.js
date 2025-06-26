import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, View, StyleSheet } from "react-native";
import Icon from "../../../assets/images/icon2.svg";
import BoldText from "../../components/text/BoldText";
import { sc, vs } from "../../constant/Dimension";
import LoginForm from "../../components/form/LoginForm";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView behavior="position">
        <View style={styles.titleWrapper}>
          <BoldText text="Log In" size={40} />
        </View>

        <Icon height={vs(340)} width={sc(330)} />

        <LoginForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F7FB",
    flex: 1,
  },
  titleWrapper: {
    marginLeft: sc(25),
  },
});

export default LoginScreen;

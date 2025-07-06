import React, { useState } from "react";
import {
  Keyboard,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";
import SemiBoldText from "../text/SemiBoldText";
import { ms, sc, vs } from "../../constant/Dimension";
import Email from "../../../assets/images/mail.svg";
import EyeOn from "../../../assets/images/eye.svg";
import EyeOff from "../../../assets/images/eye-off.svg";
import useAuthStore from "../../stores/AuthStore";
import CommonButton from "../button/CommonButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const LoginForm = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, setIsAdmin, setRole, setPhoto, setName, setUserId } =
    useAuthStore();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      //TODO Hapus
      // const data = {
      //   email: "ardazan1603@gmail.com",
      //   password: "arda123",
      // };

      const data = {
        email: "admin@admin.com",
        password: "admin123",
      };

      const res = await axios.post(
        `http://192.168.1.7:3000/api/auth/login`,
        data,
      );
      console.log(res.data);

      const role = res.data.user.role;
      if (role === "ADMIN") {
        setIsAdmin(true);
        setRole("ADMIN");
      } else {
        setIsAdmin(false);
        setRole("EMPLOYEE");
      }

      const token = res.data.token;
      setToken(token);

      const photoUrl = res.data.user.photo;
      setPhoto(photoUrl);

      const name = res.data.user.name;
      setName(name);

      const userId = res.data.user.id;
      setUserId(userId);

      Keyboard.dismiss();
      ToastAndroid.show("Log in successful", ToastAndroid.SHORT);
      setTimeout(() => {
        navigation.navigate("Drawer");
      }, 2000);
    } catch (e) {
      Alert.alert(
        "Warning!",
        "Log in failed, please enter the correct email and password ",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldWrapper}>
        <SemiBoldText text="Email" size={20} />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="user@gmail.com"
            placeholderTextColor={"#999999"}
            inputMode="email"
            onChangeText={(data) => setEmail(data)}
            autoCapitalize="none"
          />

          <View style={styles.icon}>
            <Email />
          </View>
        </View>
      </View>

      <View style={styles.fieldWrapper}>
        <SemiBoldText text="Password" size={20} />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="user123"
            placeholderTextColor={"#999999"}
            onChangeText={(data) => setPassword(data)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.icon} onPress={handleShowPassword}>
            {showPassword ? <EyeOff /> : <EyeOn />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <CommonButton text="Log In" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: vs(15),
    alignItems: "center",
  },
  fieldWrapper: {
    gap: vs(10),
  },
  inputWrapper: {
    position: "relative",
  },
  textInput: {
    width: sc(307),
    height: vs(55),
    borderRadius: ms(20),
    borderColor: "#999999",
    borderWidth: 1,
    paddingLeft: sc(20),
    fontFamily: "QuicksandMedium",
    fontSize: ms(14, 0.3),
    color: "#000",
  },
  icon: {
    position: "absolute",
    right: sc(20),
    top: vs(15),
  },
  buttonWrapper: {
    marginTop: vs(10),
  },
});

export default LoginForm;

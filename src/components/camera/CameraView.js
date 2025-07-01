import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import { useNavigation } from "@react-navigation/native";
import MediumText from "../text/MediumText";
import SemiBoldText from "../text/SemiBoldText";
import { ms, vs } from "../../constant/Dimension";

const CameraView = ({ CloseCamera }) => {
  const { token } = useAuthStore();
  const navigation = useNavigation();

  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAttemptingCapture, setIsAttemptingCapture] = useState(false);
  const [hasAttemptedCapture, setHasAttemptedCapture] = useState(false);

  const frontCamera = devices
    ? Object.values(devices).find((device) => device?.position === "front")
    : null;
  const device = frontCamera;

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const cameraPermissionStatus = await Camera.requestCameraPermission();
        setHasPermission(cameraPermissionStatus === "granted");

        if (cameraPermissionStatus !== "granted") {
          Alert.alert(
            "Camera Permission Required",
            "The application requires camera access to function. Please grant access in the app settings.",
            [{ text: "OK", onPress: () => CloseCamera() }]
          );
        }
      } catch (error) {
        console.error("Error requesting camera permission:", error);
        Alert.alert("Error", "Failed to request camera permission", [
          { text: "OK", onPress: () => CloseCamera() },
        ]);
      }
    };

    requestPermission();
  }, []);

  const captureAndSendPhoto = useCallback(async () => {
    setIsAttemptingCapture(true);

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: "quality",
        flash: "off",
        enableShutterSound: false,
        skipMetadata: true,
      });

      setIsProcessing(true);

      const photoPath = photo.path;

      const photoFile = {
        uri: `file://${photoPath}`,
        name: "attendance_photo.jpg",
        type: "image/jpeg",
      };

      const formData = new FormData();
      formData.append("file", photoFile);

      const API_URL = `${process.env.EXPO_PUBLIC_API}/api/attendance/clock-in?type=faceImage`;

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      console.log("RES: ", response);

      ToastAndroid.show(`Clock-In Successful`, ToastAndroid.SHORT);

      setTimeout(() => {
        CloseCamera();
      }, 2000);
    } catch (error) {
      console.log("Failed to process photo or send:", error);

      Alert.alert("Warning!", error.response.data.message, [
        { text: "OK", onPress: () => CloseCamera() },
      ]);
    } finally {
      setIsProcessing(false);
      setIsAttemptingCapture(false);
      setHasAttemptedCapture(true);
    }
  }, [
    isCameraInitialized,
    token,
    navigation,
    isProcessing,
    isAttemptingCapture,
    hasAttemptedCapture,
  ]);

  useEffect(() => {
    if (
      isCameraInitialized &&
      hasPermission &&
      !isProcessing &&
      !isAttemptingCapture &&
      !hasAttemptedCapture
    ) {
      const timer = setTimeout(() => {
        captureAndSendPhoto();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [
    isCameraInitialized,
    hasPermission,
    isProcessing,
    isAttemptingCapture,
    hasAttemptedCapture,
    captureAndSendPhoto,
  ]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <MediumText
          text={"Requesting camera permission..."}
          size={16}
          color="#fff"
          textAlign
        />
      </View>
    );
  }

  if (devices == null) {
    return (
      <View style={styles.container}>
        <MediumText
          text={"Loading camera devices..."}
          size={16}
          color="#fff"
          textAlign
        />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <MediumText
          text={"Cannot find camera on this device."}
          size={16}
          color="#fff"
          textAlign
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isProcessing && !hasAttemptedCapture}
        photo={true}
        onInitialized={() => {
          setIsCameraInitialized(true);
        }}
        onError={(error) => {
          Alert.alert("Camera Error", "Failed to activate camera", [
            { text: "OK", onPress: () => CloseCamera() },
          ]);
          setHasAttemptedCapture(true);
          setIsProcessing(false);
          setIsAttemptingCapture(false);
        }}
      />

      <View style={styles.overlay}>
        {isProcessing ? (
          <View>
            <ActivityIndicator size="large" color="#00ff00" />
            <MediumText
              text={"Processing attendance.."}
              size={16}
              color="#fff"
              textAlign
            />
          </View>
        ) : null}

        {hasAttemptedCapture && !isProcessing && (
          <MediumText
            text={"Capture process finished."}
            size={16}
            color="#fff"
            textAlign
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    bottom: vs(50),
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: ms(20),
  },
});

export default CameraView;

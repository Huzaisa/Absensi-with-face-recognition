import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";
import MediumText from "../text/MediumText";
import { ms, vs } from "../../constant/Dimension";

const CameraView = ({ CloseCamera, onCameraError }) => {
  const { token, setClockIn, setAttendanceStatus } = useAuthStore();

  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isWaitingForCapture, setIsWaitingForCapture] = useState(true);

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
          onCameraError(
            "Camera permission is not granted. Please grant access in settings",
          );
          setIsWaitingForCapture(false);
        }
      } catch (error) {
        console.log("Error requesting camera permission:", error);
        onCameraError(error.message || "Failed to request camera permission");
        setIsWaitingForCapture(false);
      }
    };

    requestPermission();
  }, []);

  const captureAndSendPhoto = useCallback(async () => {
    if (!cameraRef.current) {
      console.log("Camera ref is null, cannot capture photo.");
      onCameraError("Camera is not ready or not found");
      setIsWaitingForCapture(false);
      return;
    }

    if (isCapturing) {
      return;
    }

    setIsCapturing(true);
    setIsWaitingForCapture(false);

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: "quality",
        flash: "off",
        enableShutterSound: false,
        skipMetadata: true,
      });

      const photoPath = photo.path;

      const photoFile = {
        uri: `file://${photoPath}`,
        name: "attendance_photo.jpg",
        type: "image/jpeg",
      };

      const formData = new FormData();
      formData.append("file", photoFile);

      const API_URL = `http://192.168.1.8:3000/api/attendance/clock-in?type=faceImage`;

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      const clockInTime = new Date(
        response.data.attendance.clockIn,
      ).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      setClockIn(clockInTime);
      setAttendanceStatus(response.data.attendance.status);
      ToastAndroid.show(`Clock-In Successful`, ToastAndroid.SHORT);

      setTimeout(() => {
        CloseCamera();
      }, 2000);
    } catch (error) {
      console.log(
        "Failed to process photo or send: ",
        error.response ? error.response.data : error.message,
      );
      onCameraError(
        error.response ? error.response.data.message : error.message,
      );
    } finally {
      setIsCapturing(false);
    }
  }, [token, CloseCamera, onCameraError, isCapturing]);

  useEffect(() => {
    let timer;
    if (
      isCameraInitialized &&
      hasPermission &&
      !isCapturing &&
      isWaitingForCapture
    ) {
      timer = setTimeout(() => {
        captureAndSendPhoto();
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    isCameraInitialized,
    hasPermission,
    isCapturing,
    isWaitingForCapture,
    captureAndSendPhoto,
  ]);

  const handleCameraInitialized = useCallback(() => {
    setIsCameraInitialized(true);
    setIsWaitingForCapture(true);
  }, []);

  const handleCameraComponentError = useCallback(
    (error) => {
      console.log("Camera component error:", error);
      onCameraError(error.message || "Failed to activate camera");
      setIsCapturing(false);
      setIsWaitingForCapture(false);
    },
    [onCameraError],
  );

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
          text={"Loading camera device..."}
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
          text={"Cannot find camera on this device"}
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
        isActive={hasPermission && isCameraInitialized}
        photo={true}
        onInitialized={handleCameraInitialized}
        onError={handleCameraComponentError}
      />

      <View style={styles.overlay}>
        {isCapturing ? (
          <View>
            <ActivityIndicator size="large" color="#00ff00" />
            <MediumText
              text={"Processing attendance.."}
              size={16}
              color="#fff"
              textAlign
            />
          </View>
        ) : (
          isCameraInitialized &&
          isWaitingForCapture && (
            <MediumText
              text={"Camera ready. Please wait for the attendance process..."}
              size={16}
              color="#fff"
              textAlign
            />
          )
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

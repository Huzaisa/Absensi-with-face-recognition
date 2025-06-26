import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, Alert, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import axios from "axios";
import useAuthStore from "../../stores/AuthStore";

const HomeScreen2 = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const cameraRef = useRef(null);
  const intervalRef = useRef(null);
  const wsRef = useRef(null);
  const { token } = useAuthStore();

  useEffect(() => {
    // Koneksi WebSocket untuk menerima notifikasi real-time
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`ws://192.168.1.5:8000/ws`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
          setWsConnected(true);

          // Send ping to keep connection alive
          const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, 30000);

          ws.pingInterval = pingInterval;
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "attendance_recorded") {
            // Tampilkan notifikasi ketika ada yang absen
            Alert.alert(
              "Absensi Tercatat!",
              `${data.data.userName} - ${data.data.status}`,
            );
          } else if (data.type === "pong") {
            // Handle pong response
            console.log("Pong received");
          }
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setWsConnected(false);
          if (ws.pingInterval) {
            clearInterval(ws.pingInterval);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setWsConnected(false);
        };
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        if (wsRef.current.pingInterval) {
          clearInterval(wsRef.current.pingInterval);
        }
        wsRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Capture dan proses via HTTP API
  const startRealTimeRecognition = () => {
    intervalRef.current = setInterval(async () => {
      if (cameraRef.current && !isProcessing) {
        setIsProcessing(true);

        try {
          // Ambil foto dari kamera
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.5,
            base64: false, // Gunakan URI untuk upload
          });

          // Kirim ke Express.js API (bukan langsung ke Python)
          const formData = new FormData();
          formData.append("file", {
            uri: photo.uri,
            type: "image/jpeg",
            name: "face_capture.jpg",
          });

          const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API}/api/attendance/auto-clock-in`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            },
          );

          // Tampilkan hasil
          setRecognitionResult({
            recognized: true,
            message: response.data.message,
          });

          Alert.alert("Berhasil", response.data.message);
          stopRealTimeRecognition();
        } catch (error) {
          console.error("Face recognition error:", error);

          const errorMessage =
            error.response?.data?.message || "Wajah tidak dikenali";
          setRecognitionResult({
            recognized: false,
            message: errorMessage,
          });

          // Jangan stop jika wajah tidak dikenali, coba lagi
          if (!error.response?.data?.message?.includes("tidak dikenali")) {
            Alert.alert("Error", errorMessage);
          }
        }

        setIsProcessing(false);
      }
    }, 3000); // Setiap 3 detik untuk memberikan waktu processing
  };

  const stopRealTimeRecognition = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsProcessing(false);
  };

  // Manual capture untuk testing
  const handleManualCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      const formData = new FormData();
      formData.append("file", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "face_capture.jpg",
      });

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API}/api/attendance/auto-clock-in`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Alert.alert("Berhasil", response.data.message);
      setRecognitionResult({
        recognized: true,
        message: response.data.message,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal memproses wajah";
      Alert.alert("Error", errorMessage);
      setRecognitionResult({
        recognized: false,
        message: errorMessage,
      });
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    // Auto start recognition ketika component mount
    const timer = setTimeout(() => {
      startRealTimeRecognition();
    }, 1000);

    return () => {
      clearTimeout(timer);
      stopRealTimeRecognition();
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Izin kamera diperlukan untuk face recognition</Text>
        <Button title="Berikan Izin" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front" ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isProcessing ? "Memproses..." : "Siap untuk deteksi"}
            </Text>

            <Text style={[styles.statusText, { fontSize: 12 }]}>
              WebSocket: {wsConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </Text>

            {recognitionResult && (
              <View
                style={[
                  styles.resultContainer,
                  {
                    backgroundColor: recognitionResult.recognized
                      ? "rgba(0,128,0,0.8)"
                      : "rgba(255,0,0,0.8)",
                  },
                ]}
              >
                <Text style={styles.resultText}>
                  {recognitionResult.message}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.frameGuide}>
            <Text style={styles.guideText}>Posisikan wajah dalam frame</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Capture Manual"
              onPress={handleManualCapture}
              disabled={isProcessing}
            />
            <Button
              title={intervalRef.current ? "Stop Auto" : "Start Auto"}
              onPress={
                intervalRef.current
                  ? stopRealTimeRecognition
                  : startRealTimeRecognition
              }
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  statusContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    textAlign: "center",
  },
  resultContainer: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  resultText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  frameGuide: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  guideText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 50,
  },
});

export default HomeScreen2;

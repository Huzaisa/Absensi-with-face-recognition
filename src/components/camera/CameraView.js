import { Camera } from "expo-camera";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CameraView = ({ ref }) => {
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.front}
        //ref={ref}
        ratio="16:9"
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Remote Attendance Punch</Text>
          </View>

          {/* Face Guide Circle */}
          <View style={styles.faceGuideContainer}>
            <View style={styles.faceGuide}>
              <Text style={styles.guideText}>
                Make sure your face is in the centre of the frame
              </Text>
            </View>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.flipButton} //onPress={flipCamera}
            >
              <Text style={styles.flipButtonText}>Flip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.captureButton,
                //isCapturing && styles.captureButtonDisabled,
              ]}
              // onPress={takePicture}
              //disabled={isCapturing}
            >
              <Text style={styles.captureButtonText}>
                {/* {isCapturing ? "Capturing..." : "Capture"} */}
              </Text>
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  faceGuideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  faceGuide: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  guideText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 20,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  flipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 15,
    borderRadius: 25,
    minWidth: 70,
    alignItems: "center",
  },
  flipButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  captureButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  captureButtonDisabled: {
    backgroundColor: "rgba(0, 122, 255, 0.5)",
  },
  captureButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  placeholder: {
    width: 70,
  },
});

export default CameraView;

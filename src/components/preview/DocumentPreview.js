import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Pdf from "react-native-pdf";

const DocumentPreview = ({ uri }) => {
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: uri, cache: true }}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`PDF loaded: ${numberOfPages} pages`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}/${numberOfPages}`);
        }}
        onError={(error) => {
          console.error("PDF Error:", error);
        }}
        onLoadProgress={(percent) => {
          console.log(`PDF Loading: ${percent}%`);
        }}
        enablePaging={true}
        enableRTL={false}
        enableAnnotationRendering={true}
        enableAntialiasing={true}
        enableDoubleTapZoom={true}
        minScale={1.0}
        maxScale={3.0}
        scale={1.0}
        spacing={10}
        fitPolicy={0}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        activityIndicator={<ActivityIndicator size="large" color="#0000ff" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  pdf: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default DocumentPreview;

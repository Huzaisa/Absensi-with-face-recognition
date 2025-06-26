import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const DocumentPreview = ({ uri, type }) => {
  // Untuk PDF kita bisa gunakan Google Docs Viewer,
  // Untuk Excel gunakan Office Online Viewer.
  const embedUrl =
    type === "pdf"
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}`
      : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(uri)}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: embedUrl }}
        style={styles.webview}
        // mengijinkan pinch-to-zoom
        scalesPageToFit={true}
        // di Android kadang perlu ini supaya zoom berfungsi:
        useWebKit={true}
        // tampilkan loading spinner
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator style={styles.loader} size="large" />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default DocumentPreview;

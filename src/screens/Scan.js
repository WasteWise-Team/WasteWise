import React from "react";
import { View, Button, StyleSheet } from "react-native";
import CameraScreen from "./cameraScreen";

const Scan = ({ navigation }) => {
  return (
    <CameraScreen navigation={navigation}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Scan;
import React, { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet
} from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  CameraCaptureError,
  Camera,
  type VideoFile,
  type CameraPosition,
  useFrameProcessor,
} from 'react-native-vision-camera';

export default function HomeScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return <ActivityIndicator/>;
  }

  if (!device) {
    return <Text>Camera </Text>
  }

  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // optional, set the background color to match the camera preview
  },
});

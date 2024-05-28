import React from "react";
import { View, Button, StyleSheet } from "react-native";

const Scan = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Scan Item"
        onPress={() => navigation.navigate("ScanItem")}
      />
      <Button
        title="Upload Image"
        onPress={() => navigation.navigate("UploadImage")}
      />
    </View>
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

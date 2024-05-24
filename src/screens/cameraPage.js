import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanAgainButton, setShowScanAgainButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setLoading(true);
      fetchProductData(data);
    }
  };

  const fetchProductData = async (barcode) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
      const productData = await response.json();
      if (productData.status === 1) {
        const materials = extractMaterials(productData.product.packaging, productData.product.packaging_recycling);
        const isRecyclable = determineRecyclability(materials);
        const productInfo = productData.product.product_name;
        Alert.alert(
          "Product Information",
          `Product: ${productInfo}\nRecyclable: ${isRecyclable ? 'Yes' : 'No'}`,
          [
            { text: "OK", onPress: () => {
              setShowScanAgainButton(true);
              setLoading(false);
            }}
          ]
        );
      } else {
        Alert.alert("Error", "Product data not found.", [
          { text: "OK", onPress: () => {
              setScanned(false);
              setLoading(false);
          }},
        ]);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      Alert.alert("Error", "Failed to handle barcode scan.", [
        { text: "OK", onPress: () => {
            setScanned(false);
            setLoading(false);
        }},
      ]);
    }
  };

  const extractMaterials = (packaging, packagingRecycling) => {
    if (packagingRecycling && packagingRecycling.length > 0) {
      return packagingRecycling.map((item) => item.lc_name);
    }
    return [];
  };

  const determineRecyclability = (materials) => {
    const recyclabilityRules = {
      PET: true,
      HDPE: true,
      Glass: true,
      Aluminum: true,
      Steel: true,
      PS: false,
      PVC: false,
      recyclable: true,
      "not recyclable": false,
    };

    for (const material of materials) {
      if (recyclabilityRules[material.toLowerCase()] === false) {
        return false;
      }
    }
    return true;
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && !showScanAgainButton && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "upc_e", "upc_a"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {showScanAgainButton && (
        <Button
          title={"Tap to Scan Again"}
          onPress={() => {
            setScanned(false);
            setShowScanAgainButton(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

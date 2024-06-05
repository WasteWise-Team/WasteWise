import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, ActivityIndicator } from "react-native";
import { CameraView, Camera } from "expo-camera";
import ScanModal from "../components/ScanModal";

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanAgainButton, setShowScanAgainButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [productInfo, setProductInfo] = useState('');
  const [isRecyclable, setIsRecyclable] = useState(false);

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
        console.log('Recyclability Section:', JSON.stringify(productData.product.packagings, null, 2)); // Print the recyclability section

        const materials = extractMaterials(productData.product.packagings);
        const recyclable = determineRecyclability(materials);
        setProductInfo(productData.product.product_name);
        setIsRecyclable(recyclable);
        setModalVisible(true);
      } else {
        Alert.alert("Error", "Product data not found.", [
          {
            text: "OK", onPress: () => {
              setScanned(false);
              setLoading(false);
            }
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      Alert.alert("Error", "Failed to handle barcode scan.", [
        {
          text: "OK", onPress: () => {
            setScanned(false);
            setLoading(false);
          }
        },
      ]);
    }
  };

  const extractMaterials = (packagings) => {
    return packagings.map(packaging => packaging.material);
  };

  const determineRecyclability = (materials) => {
    const recyclabilityRules = {
      "pet": true,
      "hdpe": true,
      "glass": true,
      "aluminium": true,
      "steel": true,
      "ps": false,
      "pvc": false,
      "recyclable": true,
      "not recyclable": false,
    };

    for (const material of materials) {
      if (material) {
        const materialKey = Object.keys(recyclabilityRules).find(key => material.toLowerCase().includes(key));
        if (materialKey && recyclabilityRules[materialKey] === false) {
          return false;
        }
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
      <ScanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        productInfo={productInfo}
        isRecyclable={isRecyclable}
        onNavigate={() => {
          setModalVisible(false);
          setShowScanAgainButton(true);
          setLoading(false);
          navigation.navigate('Map');
        }}
      />
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
        <>
          <Button
            title={"Tap to Scan Again"}
            onPress={() => {
              setScanned(false);
              setShowScanAgainButton(false);
            }}
          />
          <Button
            title={"Go Back"}
            onPress={() => navigation.goBack()}
          />
        </>
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

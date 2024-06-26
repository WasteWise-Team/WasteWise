import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Entypo } from '@expo/vector-icons'; // Import Entypo icon
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

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setLoading(true);
      await fetchProductData(data); // Wait for the product data to be fetched
      setLoading(false); // Disable loading indicator
      setShowScanAgainButton(true); // Show the scan again button
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
      {!showScanAgainButton && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "upc_e", "upc_a"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Icon Button */}
      <TouchableOpacity style={styles.iconButton} onPress={() => console.log("Upload image")}>
        <View style={styles.iconContainer}>
          <Entypo name="image" size={24} color="white" />
        </View>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#9ee8a4" />}

      {/* Scan Modal */}
      <ScanModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setShowScanAgainButton(true);
        }}
        productInfo={productInfo}
        isRecyclable={isRecyclable}
        onNavigate={() => {
          setModalVisible(false);
          setShowScanAgainButton(true);
          setLoading(false);
          navigation.navigate('Map', {fromScanner: true});
          
        }}
      />

      {/* Scan Again Buttons */}
      {showScanAgainButton && (
        <View style={styles.centeredButtons}>
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  iconButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 20,
    elevation: 2, // Add elevation for shadow on Android
  },
  iconContainer: {
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 10,
    opacity: .7
  },
  centeredButtons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});



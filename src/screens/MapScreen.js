import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, TouchableWithoutFeedback, Alert, Platform, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import BinModal from '../components/BinModal'; // Adjust the import path if needed
import CustomAlert from '../components/alertModal'; // Adjust the import path if needed
import ThemeContext from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// Import Firestore and Storage functions
import { FIRESTORE_DB, GeoPoint, Timestamp, collection, addDoc, getDocs, FIREBASE_STORAGE } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const MapScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation(); // Get the navigation prop
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputModalVisible, setInputModalVisible] = useState(false); // State for text input modal
  const [binDescription, setBinDescription] = useState(''); // State for bin description
  const [alertVisible, setAlertVisible] = useState(false); // State for custom alert modal
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message
  const [binImage, setBinImage] = useState(null); // State for bin image
  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      watchLocation();
    };

    requestLocationPermission();
    fetchMarkers();
  }, []);

  const watchLocation = async () => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
        distanceInterval: 1,
      },
      (location) => {
        setLocation(location.coords);
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      }
    );
  };

  const fetchMarkers = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'bins'));
      const fetchedMarkers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          latitude: data.binLocation.latitude,
          longitude: data.binLocation.longitude,
          imageUrl: data.binImage, // Ensure the imageUrl is fetched
          description: data.binDescription, // Ensure the description is fetched
        };
      });
      setMarkers(fetchedMarkers);
    } catch (error) {
      console.log(error);
      setAlertMessage('Failed to fetch markers from database');
      setAlertVisible(true);
    }
  };

  const takePhoto = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    Alert.alert(
      'Take a Photo',
      'Please take a photo of the bin.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              let result = await ImagePicker.launchCameraAsync(options);
              console.log(result); // Log the entire result object to debug

              if (result.cancelled || result.canceled) {
                console.log('Camera operation was cancelled.');
              } else if (result.assets && result.assets.length > 0) {
                const { uri } = result.assets[0]; // Extract the uri property from the first object in the assets array
                console.log(uri);
                if (uri) {
                  console.log(uri); // Log the uri to verify
                  await uploadImageToFirebase(uri); // Ensure this is awaited
                } else {
                  console.error('Error: uri is undefined');
                }
              } else {
                console.error('Error: No assets found');
              }
            } catch (error) {
              console.error('Error taking photo:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri) {
      console.error('Invalid URI:', uri);
      return;
    }

    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const resizedUri = manipulatedImage.uri;
      const filename = resizedUri.substring(resizedUri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? resizedUri.replace('file://', '') : resizedUri;
      const storageRef = ref(FIREBASE_STORAGE, `binImages/${filename}`);
      const img = await fetch(uploadUri);
      const bytes = await img.blob();

      await uploadBytes(storageRef, bytes);
      const downloadUrl = await getDownloadURL(storageRef);
      await saveImageUrl(downloadUrl);
    } catch (error) {
      console.error('Error during upload:', error.message);
      console.error('Stack Trace:', error.stack);
    }
  };

  const saveImageUrl = async (downloadUrl) => {
    try {
      setBinImage(downloadUrl); // Save the image URL
      setInputModalVisible(true); // Show the text input modal
    } catch (e) {
      console.error('Saving image URL failed:', e);
    }
  };

  const handleAddBin = async () => {
    try {
      const radius = 0.0001; // ~11 meters
  
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'bins'));
      const existingBins = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          latitude: data.binLocation.latitude,
          longitude: data.binLocation.longitude,
        };
      });
  
      const binExists = existingBins.some(bin => {
        return bin.latitude === location.latitude && bin.longitude === location.longitude;
      });
  
      if (binExists) {
        setAlertMessage('A bin already exists at this location');
        setAlertVisible(true);
        return;
      }

      await addDoc(collection(FIRESTORE_DB, 'bins'), {
        binDescription: binDescription, // Include the bin description
        binImage: binImage, // Include the bin image URL
        binType: null,
        addedBy: null,
        binApproval: null, // for AI filter
        binLocation: new GeoPoint(location.latitude, location.longitude),
        dateAdded: Timestamp.fromDate(new Date()),
        disposalType: null,
      });
      const updatedMarkers = [...markers, {
        latitude: location.latitude,
        longitude: location.longitude,
        imageUrl: binImage, // Include the image URL in the new marker
        description: binDescription, // Include the description in the new marker
      }];
      setMarkers(updatedMarkers);
      setModalVisible(false);
      setInputModalVisible(false); // Hide the text input modal
      setBinDescription(''); // Clear the description input
      setBinImage(null); // Clear the image URL

      // Show success message
      setAlertMessage('Bin successfully added!');
      setAlertVisible(true);
    } catch (error) {
      console.log(error);
      setAlertMessage('Failed to add bin to database');
      setAlertVisible(true);
    }
  };

  const navigateToMarker = (marker) => {
    const url = `http://maps.apple.com/?daddr=${marker.latitude},${marker.longitude}`;
    Linking.openURL(url).catch(err => {
      setAlertMessage('Failed to open navigation');
      setAlertVisible(true);
    });
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  // CSS
  const styles = StyleSheet.create({
    calloutContainer: {
      width: 200, // Adjust width as needed
      padding: 10,
      backgroundColor: theme === 'dark' ? '#042222' : '#dfebd8',
      borderRadius: 10,
      alignItems: 'center',
    },
    calloutTitle: {
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      fontFamily: 'Nunito',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    calloutImage: {
      width: '100%', // Use percentage to scale
      height: 200, // Fixed height to maintain aspect ratio
      marginBottom: 10,
    },
    calloutDescription: {
      fontFamily: 'Nunito',
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      textAlign: 'center',
      marginBottom: 10,
    },
    calloutNavigate: {
      fontFamily: 'Nunito',
      color: theme === 'dark' ? '#f9fff7' : 'green',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%', // Increase width to 90%
      height: '50%', // Adjust height to ensure it takes more space
      backgroundColor: '#C4D8BF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20, // Increase font size
      color: '#2D5A3D',
      fontFamily: 'Nunito',
      fontWeight: 'bold',
      marginBottom: 20, // Increase bottom margin
    },
    textInput: {
      width: '100%',
      padding: 15, // Increase padding
      borderWidth: 1,
      borderColor: '#2D5A3D',
      color: '#2D5A3D',
      borderRadius: 10, // Increase border radius
      marginBottom: 20, // Increase bottom margin
    },
    button: {
      backgroundColor: '#2D5A3D',
      padding: 15, // Increase padding
      borderRadius: 10, // Increase border radius
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16, // Increase font size
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: 28.693602091083623,
          longitude: 77.21464383448563,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker}>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>Bin {index + 1}</Text>
                {marker.imageUrl && (
                  <Image
                    source={{ uri: marker.imageUrl }}
                    style={styles.calloutImage}
                    resizeMode="contain" // Maintain aspect ratio
                  />
                )}
                {marker.description && (
                  <Text style={styles.calloutDescription}>{marker.description}</Text>
                )}
                <TouchableOpacity onPress={() => navigateToMarker(marker)}>
                  <Text style={styles.calloutNavigate}>Navigate Here</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          alignSelf: 'center',
          position: 'absolute',
          backgroundColor: 'green',
          bottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={takePhoto}
      >
        <Text style={{ color: 'white' }}>Add Bin</Text>
      </TouchableOpacity>
      <BinModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNavigate={takePhoto}
      />
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={inputModalVisible}
        onRequestClose={() => setInputModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setInputModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Describe the bin location</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter description"
                  placeholderTextColor="#2D5A3D90"
                  value={binDescription}
                  onChangeText={setBinDescription}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleAddBin}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        title="Alert"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleAlertConfirm}
      />
    </View>
  );
};


export default MapScreen;

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, TouchableWithoutFeedback, Alert, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import BinModal from '../components/BinModal'; // Adjust the import path if needed
import CustomAlert from '../components/alertModal'; // Adjust the import path if needed
import ThemeContext from '../context/ThemeContext';

// Import Firestore and Storage functions
import { FIRESTORE_DB, GeoPoint, Timestamp, collection, addDoc, getDocs, FIREBASE_STORAGE } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const MapScreen = () => {
  const { theme } = useContext(ThemeContext);
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

    try {
      let result = await ImagePicker.launchCameraAsync(options);
      console.log(result); // Log the entire result object to debug

      // if the request isn't cancelled, then add the image uri to the DB 
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0]; // Extract the uri property from the first object in the assets array
        console.log(uri)
        if (uri) {
          console.log(uri); // Log the uri to verify
          await uploadImageToFirebase(uri); // Ensure this is awaited
        } else {
          console.error('Error: uri is undefined');
        }
      } else {
        console.error('Error: Camera operation was cancelled or no assets found');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri) {
      console.error('Invalid URI:', uri);
      return;
    }
  
    try {
      // Resize the image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Adjust width as needed
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      const resizedUri = manipulatedImage.uri;
      console.log('Resized URI:', resizedUri);
  
      const filename = resizedUri.substring(resizedUri.lastIndexOf('/') + 1);
      console.log('Filename:', filename);
      const uploadUri = Platform.OS === 'ios' ? resizedUri.replace('file://', '') : resizedUri;
      console.log('Upload URI:', uploadUri);
  
      // Specify the folder path (binImages) in the storage reference
      const storageRef = ref(FIREBASE_STORAGE, `binImages/${filename}`);
      console.log('Storage reference created:', storageRef);
  
      const img = await fetch(uploadUri);
      console.log('Fetched image:', img);
  
      const bytes = await img.blob();
      console.log('Image blob:', bytes);
      console.log('Blob size:', bytes.size); // Log the size of the resized blob
  
      // Attempt to upload the image bytes to Firebase Storage
      try {
        await uploadBytes(storageRef, bytes);
        console.log('Upload completed');
  
        // Attempt to get the download URL of the uploaded file
        try {
          const downloadUrl = await getDownloadURL(storageRef);
          console.log('File available at:', downloadUrl);
  
          // Store the download URL in Firestore
          await saveImageUrl(downloadUrl);
        } catch (error) {
          console.error('Error getting download URL:', error.message);
          console.error('Stack Trace:', error.stack);
        }
      } catch (error) {
        console.error('Error uploading bytes:', error.message);
        console.error('Stack Trace:', error.stack);
      }
    } catch (error) {
      console.error('Error during fetch or blob conversion:', error.message);
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
        binApproval: null,
        binLocation: new GeoPoint(location.latitude, location.longitude),
        dateAdded: Timestamp.fromDate(new Date()),
        disposalType: null,
      });
      const updatedMarkers = [...markers, {
        latitude: location.latitude,
        longitude: location.longitude
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
            <Callout>
              <View>
                <Text>Bin {index + 1}</Text>
                <TouchableOpacity onPress={() => navigateToMarker(marker)}>
                  <Text style={{ color: 'blue' }}>Navigate Here</Text>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#C4D8BF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#2D5A3D',
    fontFamily: 'Nunito',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#2D5A3D',
    color: '#2D5A3D',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2D5A3D',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapScreen;

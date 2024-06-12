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
  const [binImageUri, setBinImageUri] = useState(null); // State for bin image URI
  const mapRef = useRef(null);

  const [reportModalVisible, setReportModalVisible] = useState(false); // State for report modal visibility
  const [reportText, setReportText] = useState(''); // State for report text
  const [selectedMarker, setSelectedMarker] = useState(null); // State for selected marker for reporting


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

  /***
   * This function keeps track of the user's location and updates it
   */
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

  /***
   * This function fetches all the markers from the DB
   */
  const fetchMarkers = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'bins'));
      const fetchedMarkers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, // Ensure the document ID is included
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

  /***
   * This function takes the photo via the camera and saves/provesses the image
   */
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
                  setBinImageUri(uri);
                  setInputModalVisible(true); // Show the text input modal
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

  /***
   * This function uploads the image to the firebase database
   * @param {String} uri the link of the image (generated by expo/react-native/firebse (probably))
   */
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
      return downloadUrl;
    } catch (error) {
      console.error('Error during upload:', error.message);
      console.error('Stack Trace:', error.stack);
      return null;
    }
  };

  /***
   * This function adds the bin once the 'OK' button is clicked
   */
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

      const downloadUrl = await uploadImageToFirebase(binImageUri); // Upload image after description

      if (!downloadUrl) {
        setAlertMessage('Failed to upload image');
        setAlertVisible(true);
        return;
      }

      await addDoc(collection(FIRESTORE_DB, 'bins'), {
        binDescription: binDescription, // Include the bin description
        binImage: downloadUrl, // Include the bin image URL
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
        imageUrl: downloadUrl, // Include the image URL in the new marker
        description: binDescription, // Include the description in the new marker
      }];
      setMarkers(updatedMarkers);
      setModalVisible(false);
      setInputModalVisible(false); // Hide the text input modal
      setBinDescription(''); // Clear the description input
      setBinImageUri(null); // Clear the image URI

      // Show success message
      setAlertMessage('Bin successfully added!');
      setAlertVisible(true);
    } catch (error) {
      console.log(error);
      setAlertMessage('Failed to add bin to database');
      setAlertVisible(true);
    }
  };

  /***
   * This function adds the user report of the bin (updates, removal, etc) to the database
   */
  const handleReportSubmit = async () => {
    if (selectedMarker) {
      if (reportText.length < 10) {
        console.log("reportText is less than 10 characters");
        alert('Brevity is key but please say a little more than that.');
        return;
      }
      try {
        await addDoc(collection(FIRESTORE_DB, 'reports'), {
          binId: selectedMarker.id, 
          reportText,
          timestamp: new Date(),
        });
        setAlertMessage('Report submitted successfully!');
        setReportModalVisible(false); // Close the modal after submission
        setReportText(''); // Clear the report text
      } catch (error) {
        setAlertMessage('Failed to submit report');
        console.log(error);
      }
      setAlertVisible(true);
    }
  };
  

  /***
   * navigation function (redirect to maps)
   */
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
      paddingBottom: 5,
    },
    calloutReport: {
      fontSize: 10,
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
      height: '20%', // Adjust height to ensure it takes more space
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 16, // Adjust font size to be smaller
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      fontFamily: 'Nunito',
      fontWeight: 'bold',
      marginBottom: 10, // Adjust bottom margin to be smaller
      lineHeight: 20, // Adjust line height for better spacing
    },
    textInput: {
      width: '100%',
      padding: 15, // Increase padding
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#b7c4b390' : '#2D5A3D',
      color: theme === 'dark' ? '#b7c4b3' : '#2D5A3D',
      borderRadius: 10, // Increase border radius
      marginBottom: 20, // Increase bottom margin
    },
    button: {
      backgroundColor: theme === 'dark' ? '#bed4bc' : '#2D5A3D',
      padding: 15, // Increase padding
      borderRadius: 10, // Increase border radius
    },
    buttonText: {
      color: 'white',
      fontFamily: 'Nunito',
      fontWeight: 'bold',
      fontSize: 12, // Increase font size
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
                <TouchableOpacity onPress={() => {
                  setSelectedMarker(marker);
                  setReportModalVisible(true);
                }}>
                  <Text style={styles.calloutReport}>Report Bin Updates</Text>
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
        animationType="fade"
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
                  <Text style={styles.buttonText}>Add Bin</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setReportModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Report Bin Updates</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter report"
                  placeholderTextColor="#2D5A3D90"
                  value={reportText}
                  onChangeText={setReportText}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleReportSubmit}
                >
                  <Text style={styles.buttonText}>Submit</Text>
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

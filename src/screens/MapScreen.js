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
import { FIRESTORE_DB, GeoPoint, Timestamp, collection, addDoc, getDocs, updateDoc, doc, setDoc, getDoc, FIREBASE_STORAGE } from '../../firebaseConfig';
import { increment, deleteDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateEmail } from 'firebase/auth';

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
  const [viewReportModalVisible, setViewReportModalVisible] = useState(false); // report display thing
  const mapRef = useRef(null);

  const [reportModalVisible, setReportModalVisible] = useState(false); // State for report modal visibility
  const [reportText, setReportText] = useState(''); // State for report text
  const [selectedMarker, setSelectedMarker] = useState(null); // State for selected marker for reporting

  //bin types stuff
  const [types] = useState(['General Trash', 'General Recyclables', 'E-waste', 'Hazardous Waste']);
  const [typeModalVisible, setTypeModalVisible] = useState(false); // State for type selection modal visibility
  const [selectedTypes, setSelectedTypes] = useState([]); // State for selected types

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
   * This function fetches all the markers from the DB and fetches report data on the bin 
   */
  const fetchMarkers = () => {
    try {
      const binCollectionRef = collection(FIRESTORE_DB, 'bins');
      const reportCollectionRef = collection(FIRESTORE_DB, 'reports');
  
      onSnapshot(binCollectionRef, (binSnapshot) => {
        onSnapshot(reportCollectionRef, (reportSnapshot) => {
          const reports = reportSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          const fetchedMarkers = binSnapshot.docs.map(doc => {
            const data = doc.data();
            const relatedReports = reports.filter(report => report.binId === doc.id);
  
            return {
              id: doc.id,
              latitude: data.binLocation.latitude,
              longitude: data.binLocation.longitude,
              imageUrl: data.binImage,
              description: data.binDescription,
              types: data.binType,
              reports: relatedReports,
            };
          });
  
          setMarkers(fetchedMarkers);
        }, (error) => {
          console.error('Failed to get reports from DB:', error);
          setAlertMessage('Failed to get reports from database');
          setAlertVisible(true);
        });
      }, (error) => {
        console.error('Failed to get bins from DB:', error);
        setAlertMessage('Failed to get bins from database');
        setAlertVisible(true);
      });
    } catch (error) {
      console.error('Failed to set up snapshot listeners:', error);
      setAlertMessage('Failed to set up snapshot listeners');
      setAlertVisible(true);
    }
  };
  

  /***
   * This function saves the selected types and then closes the modal so the modal right after shows up
   */
  const handleSaveTypes = (types) => {
    setSelectedTypes(types);
    setInputModalVisible(true);
    setTypeModalVisible(false);
  };  

  /***
   * This function updates the list based on the user's toggle, ensuring that if an option is removed/unpressed, then that is reflected in the list 
   */
  const handleToggleOption = (option) => {
    setSelectedTypes((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };

  /***
   * This function renders the selectType modal
   */
  const renderTypeSelectModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={typeModalVisible}
      onRequestClose={() => setTypeModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setTypeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContentType}>
              <Text style={styles.modalTitle}>Select Types</Text>
              <View style={styles.optionsContainer}>
                {types.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedTypes.includes(option) && styles.selectedOptionButton,
                    ]}
                    onPress={() => handleToggleOption(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={() => handleSaveTypes(selectedTypes)}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
  

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
                  setTypeModalVisible(true); // Show the type selection modal
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

    const newBinData = {
      binDescription: binDescription, // Include the bin description
      binImage: downloadUrl, // Include the bin image URL
      binType: selectedTypes,
      addedBy: null,
      binApproval: null, // for AI filter
      binLocation: new GeoPoint(location.latitude, location.longitude),
      dateAdded: Timestamp.fromDate(new Date()),
      disposalType: null,
    };

    const docRef = await addDoc(collection(FIRESTORE_DB, 'bins'), newBinData);

    const newMarker = {
      id: docRef.id, // Add the document ID to the marker
      latitude: location.latitude,
      longitude: location.longitude,
      imageUrl: downloadUrl, // Include the image URL in the new marker
      description: binDescription, // Include the description in the new marker
      types: selectedTypes, // the types of the bin
      reports: [] // Initialize reports as an empty array
    };

    // Use functional state update to ensure latest state
    setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    setModalVisible(false);
    setInputModalVisible(false); // Hide the text input modal
    setBinDescription(''); // Clear the description input
    setTypeModalVisible(false); // Hide the type selection modal
    setBinImageUri(null); // Clear the image URI
    setSelectedTypes([]); // Reset the selected types

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
      if (reportText.length < 5) {
        console.log("reportText is less than 5 characters");
        alert('Brevity is key but please say a little more than that.');
        return;
      }
      try {
        await addDoc(collection(FIRESTORE_DB, 'reports'), {
          binId: selectedMarker.id, 
          reportText,
          timestamp: new Date(),
          trueCount: 0,
          falseCount: 0,
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
   * This function handles the true/false vote count of each report to see if they're true or not
   */
  // const handleVote = async (reportId, isTrueVote) => {
  //   const reportRef = doc(FIRESTORE_DB, 'reports', reportId);
  //   const voteRef = doc(reportRef, 'votes', userId); // see which users have voted
  
  //   try {
  //     // check if the user has already voted
  //     const voteSnap = await getDoc(voteRef);
  //     if (voteSnap.exists()) {
  //       setAlertMessage('You have already voted!');
  //       setAlertVisible(true);
  //     } else {
  //       await setDoc(voteRef, {
  //         voted: true,
  //         voteType: isTrueVote ? 'True' : 'False'
  //       });
  //       // if user has not already voted, then let them vote
  //       await updateDoc(reportRef, {
  //         trueCount: isTrueVote ? firebase.firestore.FieldValue.increment(1) : firebase.firestore.FieldValue.increment(0),
  //         falseCount: isTrueVote ? firebase.firestore.FieldValue.increment(0) : firebase.firestore.FieldValue.increment(1),
  //       });
  //       setAlertMessage('Thanks for your input!');
  //       setAlertVisible(true);
  //     }
  //   } catch (error) {
  //     console.error('Failed to record vote:', error);
  //     setAlertMessage('Failed to record input');
  //     setAlertVisible(true);
  //   }
  // };
  

  /***
   * TEMP HANDLEVOTE WITHOUT USER RESTRICTION
   */

  const handleVoteOnFirstReport = (selectedMarker, isTrueFalse) => {
    if (selectedMarker.reports && selectedMarker.reports.length > 0) {
        const firstReportId = selectedMarker.reports[0].id;
        handleVote(firstReportId, isTrueFalse);
    } else {
        console.log("No reports available to vote on for this bin");
    }
  };

  const handleVote = async (reportId, isTrueVote) => {
    const reportRef = doc(FIRESTORE_DB, 'reports', reportId);

    try {
      // Firestore transaction to increment the correct counter
      await updateDoc(reportRef, {
        // Conditional update based on the value of isTrueVote
        trueCount: isTrueVote ? increment(1) : increment(0),
        falseCount: isTrueVote ? increment(0) : increment(1),
      });

      // Check if the criteria for deletion are met
      const updatedDoc = await getDoc(reportRef);
      const data = updatedDoc.data();

      if (data.trueCount >= 5) {
        // Remove the associated bin and its image
        await deleteBinAndImage(data.binId);
        await deleteDoc(reportRef);
      }
      // delete the report
      if (data.falseCount >= 5) {
        await deleteDoc(reportRef);
      }

      setViewReportModalVisible(false); // Close the modal after voting
      alert('Thanks for your input!');
    } catch (error) {
      console.error('Failed to record vote:', error);
      alert('Failed to record vote, please try again or send in a report to the team.');
    }
  };
  
  /***
   * This function deletes the bin + image from storage after 5 votes is reached to keep bin locations updated
   */
  const deleteBinAndImage = async (binId) => {
    try {
      const binRef = doc(FIRESTORE_DB, 'bins', binId);
      const binDoc = await getDoc(binRef);
      
      // if the bin doesn't exist for some reason (edge case)
      if (!binDoc.exists()) {
        console.log(`Bin with binId ${binId} does not exist.`);
        return;
      }
      
      const binData = binDoc.data();
      const imageUrl = binData.binImage;
  
      // if the imageUrl for the bin exists
      if (imageUrl) {
        // Decode the URL to handle special characters
        const decodedUrl = decodeURIComponent(imageUrl);
        console.log('Decoded URL:', decodedUrl); // Debugging line
  
        // Extract the filename from the decoded URL
        const filename = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1, decodedUrl.indexOf('?'));
        console.log('Filename:', filename); // Debugging line
  
        const imageRef = ref(FIREBASE_STORAGE, `binImages/${filename}`);
        await deleteObject(imageRef);  // Delete the image from Firebase Storage
      }
  
      await deleteDoc(binRef);  // Delete the bin document
      console.log(`Bin and image deleted for binId ${binId}`);
    } catch (error) {
      console.error('Error deleting bin and image:', error);
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
    typesContainer: {
      margin: 5,
    },
    calloutTypes: {
      fontFamily: 'Nunito',
      fontSize: 10,
      color: theme === 'dark' ? '#b7c4b3' : '#2D5A3D',
    },
    calloutTypesTitle: {
      fontSize: 12,
      fontFamily: 'Nunito',
    },
    calloutDescription: {
      fontFamily: 'Nunito',
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      textAlign: 'center',
      marginBottom: 2,
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
    calloutReportPin: {
      fontSize: 15,
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
    modalContentType: {
      width: '90%', // Increase width to 90%
      height: '30%', // Adjust height to ensure it takes more space
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
      padding: 13, // Increase padding
      borderRadius: 10, // Increase border radius
    },
    buttonText: {
      color: 'white',
      fontFamily: 'Nunito',
      fontWeight: 'bold',
      fontSize: 12, // Increase font size
    },
    optionsContainer: {
      marginBottom: 5,
      justifyContent: 'center',
      alignItems: 'center', // Center items horizontally
    },
    optionButton: {
      padding: 5,
      margin: 5,
    },
    selectedOptionButton: {
      borderColor: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      borderWidth: 1,
    },
    optionText: {
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      fontSize: 14,
      fontFamily: 'Nunito',
    },
    reportText: {
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      fontFamily: 'Nunito',
      fontSize: 15,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
    },
    voteButton: {
      backgroundColor: theme === 'dark' ? '#bed4bc' : '#2D5A3D',
      padding: 10,
      borderRadius: 10,
      margin: 5,
    },
    voteButtonText: {
      color: 'white',
      fontFamily: 'Nunito',
      fontWeight: 'bold',
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
                    resizeMode="contain"
                  />
                )}
                {marker.description && (
                  <Text style={styles.calloutDescription}>{marker.description}</Text>
                )}
                {marker.types && marker.types.length > 0 && (
                  <View style={styles.typesContainer}>
                    <Text style={styles.calloutTypes}>Types: {marker.types.join(', ')}</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => navigateToMarker(marker)}>
                  <Text style={styles.calloutNavigate}>Navigate Here</Text>
                </TouchableOpacity>
                {marker.reports && marker.reports.length > 0 ? (
                  <TouchableOpacity onPress={() => {
                    setSelectedMarker(marker);
                    setViewReportModalVisible(true);
                  }}>
                    <Text style={styles.calloutReportPin}>❗</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => {
                    setSelectedMarker(marker);
                    setReportModalVisible(true);
                  }}>
                    <Text style={styles.calloutReport}>Report Bin Updates</Text>
                  </TouchableOpacity>
                )}
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
      {renderTypeSelectModal()}
      <CustomAlert
        visible={alertVisible}
        title="Alert"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleAlertConfirm}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={viewReportModalVisible}
        onRequestClose={() => setViewReportModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setViewReportModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Bin Reports</Text>
                {selectedMarker && selectedMarker.reports.map(report => (
                  <Text key={report.id} style={styles.reportText}>{report.reportText}</Text>
                ))}
                <View style={{ flexDirection: 'row', padding: 30, justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={[styles.voteButton, { marginRight: 15 }]}
                    onPress={() => handleVoteOnFirstReport(selectedMarker, false)}
                  >
                    <Text style={styles.voteButtonText}>False</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.voteButton, { marginLeft: 15 }]}
                    onPress={() => handleVoteOnFirstReport(selectedMarker, true)}
                    >
                    <Text style={styles.voteButtonText}>True</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};


export default MapScreen;
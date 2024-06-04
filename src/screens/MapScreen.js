import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import BinModal from '../components/BinModal'; // Adjust the import path if needed
import ThemeContext from '../context/ThemeContext';

// Import Firestore functions
import { FIRESTORE_DB, GeoPoint, Timestamp, collection, addDoc, getDocs } from '../../firebaseConfig';

const MapScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      getLocation();
    };

    requestLocationPermission();
    fetchMarkers();
  }, []);

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(location.coords);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
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
      Alert.alert('Error', 'Failed to fetch markers from database');
    }
  };

  const addBinMarker = async () => {
    if (!location) {
      Alert.alert('Error', 'Current location is not available');
      return;
    }

    try {
      // Define a radius (in degrees, approx. for small distances)
      const radius = 0.0001; // ~11 meters
  
      // Query Firestore for bins within the radius
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'bins'));
      const existingBins = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          latitude: data.binLocation.latitude,
          longitude: data.binLocation.longitude,
        };
      });
  
      // Check if any existing bin has the exact same coordinates
      const binExists = existingBins.some(bin => {
        return bin.latitude === location.latitude && bin.longitude === location.longitude;
      });
  
      if (binExists) {
        Alert.alert('Error', 'A bin already exists at this location');
        return;
      }

      // if no bin exists yet, add the marker
      await addDoc(collection(FIRESTORE_DB, 'bins'), {
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
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to add bin to database');
    }
  };

  const navigateToMarker = (marker) => {
    const url = `http://maps.apple.com/?daddr=${marker.latitude},${marker.longitude}`;
    Linking.openURL(url).catch(err => Alert.alert('Error', 'Failed to open navigation'));
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
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: 'white' }}>Add Bin</Text>
      </TouchableOpacity>
      <BinModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNavigate={addBinMarker}
      />
      {errorMsg ? <Text>{errorMsg}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
});

export default MapScreen;

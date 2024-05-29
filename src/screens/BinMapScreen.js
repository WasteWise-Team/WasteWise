import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow icon

const BinMapScreen = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
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

  const addBinMarker = async () => {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const newMarker = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
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
                <Text>Marker {index + 1}</Text>
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
        onPress={addBinMarker}
      >
        <Text style={{ color: 'white' }}>Add Bin</Text>
      </TouchableOpacity>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: 10,
          borderRadius: 5,
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default BinMapScreen;

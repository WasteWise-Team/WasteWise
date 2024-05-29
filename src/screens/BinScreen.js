import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const BinScreen = () => {
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
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
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
          <Marker key={index} coordinate={marker} />
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
    </View>
  );
};

export default BinScreen;

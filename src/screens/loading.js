import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'CustomFont': require('./assets/fonts/NunitoRegular-vmABZ.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // You can return a loading indicator here
  }

  return (
    <View style={styles.container}>
      <FontAwesome name="recycle" size={40} color="#2D5A3D" />
      <View style={styles.title_container}>
        <Text style={styles.title}>
          Waste
          <Text style={styles.title2}>Wise</Text>
        </Text>
      </View>
      <Text style={styles.subtitle}>Recycle Smarter,</Text>
      <Text style={styles.subtitle}>Not Harder</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4D8BF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 40,
    fontFamily: 'Nunito-Regular',
    color: '#34724B',
  },

  title2: {
    color: '#FCFCFE',
    fontFamily: 'Nunito-Regular',
  },
  
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    color: '#34724B',
  },
});

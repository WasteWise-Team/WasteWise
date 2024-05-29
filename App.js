import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { View } from 'react-native';
import AppNavigator from './src/components/appNavigator'; // Adjust the import path as needed

const loadFonts = async () => {
  await Font.loadAsync({
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf')
    // add more fonts here
  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const fetchFonts = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    fetchFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <AppNavigator />;
};

export default App;

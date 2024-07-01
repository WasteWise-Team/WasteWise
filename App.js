import React, { useState, useEffect, useCallback, useContext } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/components/appNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import ThemeContext from './src/context/ThemeContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import Settings from './src/components/settingsPage';
import AboutUs from './src/screens/AboutUs';

SplashScreen.preventAutoHideAsync();

const loadFonts = async () => {
  await Font.loadAsync({
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
    'Nunito-Medium': require('./assets/fonts/Nunito-Medium.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf')
  });
};

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Log the isAuthenticated state whenever it changes
  useEffect(() => {
    console.log('isAuthenticated state has changed:', isAuthenticated);
  }, [isAuthenticated]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <ThemedApp onLayout={onLayoutRootView} isAuthenticated={isAuthenticated} />
    </ThemeProvider>
  );
};

const ThemedApp = ({ onLayout, isAuthenticated }) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <AppNavigator isAuthenticated={isAuthenticated} />
    </View>
  );
};

export default App;

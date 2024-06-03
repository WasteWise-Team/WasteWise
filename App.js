import React, { useState, useEffect, useCallback, useContext } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/components/appNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import ThemeContext from './src/context/ThemeContext';

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
      <ThemedApp onLayout={onLayoutRootView} />
    </ThemeProvider>
  );
};

const ThemedApp = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <AppNavigator />
    </View>
  );
};

export default App;

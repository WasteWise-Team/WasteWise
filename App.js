import React from 'react';
import { View } from 'react-native';
import AppNavigator from './src/components/appNavigator'; // Adjust the import path as needed

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
};

export default App;

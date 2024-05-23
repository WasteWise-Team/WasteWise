// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraPage from './cameraPage'; // Import your camera page component

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen 
          name="Camera" 
          component={CameraPage} 
          options={{ headerShown: false }} // You can customize the header options here
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
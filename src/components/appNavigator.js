// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScannerScreen from '../screens/cameraPage';
import BinScreen from '../screens/BinScreen';

// Screen names
const homeName = 'Home';
const MapName = 'Map';
const ProfileName = 'Profile';
const ScannerName = 'Scanner';
const BinName = 'Bin';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === MapName) {
              iconName = focused ? 'navigate' : 'navigate-outline';
            } else if (route.name === ProfileName) {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === ScannerName) {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === BinName) {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } 

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2D5A3D',
          tabBarInactiveTintColor: '#2D5A3D',
          headerShown: false,
          tabBarInactiveBackgroundColor: '#C4D8BF',
          tabBarActiveBackgroundColor: '#C4D8BF',
          tabBarStyle: {backgroundColor: '#C4D8BF'},
          })}
      >
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={MapName} component={MapScreen} />
        <Tab.Screen name={ScannerName} component={ScannerScreen} />
        <Tab.Screen name={ProfileName} component={ProfileScreen} />
        <Tab.Screen name={BinName} component={BinScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

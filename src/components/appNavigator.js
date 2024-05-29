import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Scan from '../screens/Scan';
import BinScreen from '../screens/BinScreen';
import CameraScreen from '../screens/cameraScreen';
import UploadScreen from '../screens/UploadScreen';
import LoginScreen from '../screens/Login';
import StartingScreen from '../screens/StartingScreen';

// Screen names
const homeName = 'Home';
const MapName = 'Map';
const ProfileName = 'Profile';
const ScannerName = 'Scanner';
const BinName = 'Bin';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomTabButton = (props) => (
  <TouchableOpacity
    {...props}
    style={
      props.accessibilityState.selected
        ? [props.style, { borderTopColor: '#2D5A3D', borderTopWidth: 2 }]
        : props.style
    }
  />
);

const ScanStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ScannerStack" component={Scan} />
    <Stack.Screen name="ScanItem" component={CameraScreen} />
    <Stack.Screen name="UploadImage" component={UploadScreen} />
    
    <Stack.Screen name="Starting" component={StartingScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Starting" component={StartingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="AppTabs" component={AppTabs} />
  </Stack.Navigator>
);

const AppTabs = () => (
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
      tabBarStyle: { backgroundColor: '#C4D8BF' },
    })}
  >
    <Tab.Screen name={homeName} component={HomeScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={MapName} component={MapScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={ScannerName} component={ScanStack} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={BinName} component={BinScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={ProfileName} component={ProfileScreen} options={{ tabBarButton: CustomTabButton }} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
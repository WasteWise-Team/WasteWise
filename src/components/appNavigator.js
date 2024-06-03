import React, { useContext } from 'react';
import { TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ThemeContext from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Scan from '../screens/Scan';
import BinScreen from '../screens/AddBinScreen';
import CameraScreen from '../screens/cameraScreen';
import UploadScreen from '../screens/UploadScreen';
import CreateAccount from '../screens/CreateAccount';
import StartingScreen from '../screens/StartingScreen';
import BinMapScreen from '../screens/BinMapScreen';
import LoginScreen from '../screens/LoginScreen';

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
  <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="ScannerStack" component={Scan} />
    <Stack.Screen name="ScanItem" component={CameraScreen} />
    <Stack.Screen name="UploadImage" component={UploadScreen} />
    <Stack.Screen name="Starting" component={StartingScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="Starting" component={StartingScreen} />
    <Stack.Screen name="CreateAccount" component={CreateAccount} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="AppTabs">
      {() => <AppTabs theme={useContext(ThemeContext).theme} />}
    </Stack.Screen>
    <Stack.Screen name="BinMap" component={BinMapScreen}/>
  </Stack.Navigator>
);

const AppTabs = ({ theme }) => ( // Accept theme as a prop
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
      tabBarActiveTintColor: theme === 'dark' ? '#99DAB3' : '#2D5A3D',
      tabBarInactiveTintColor: theme === 'dark' ? '#FFF' : '#2D5A3D',
      headerShown: false,
      tabBarInactiveBackgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      tabBarActiveBackgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      tabBarStyle: { backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF', shadowColor: 'transparent', elevation: 0, borderBlockColor: 'transparent' },
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
  const { theme } = useContext(ThemeContext);
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

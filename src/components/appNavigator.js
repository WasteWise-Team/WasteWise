import React, { useContext } from 'react';
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
import CameraScreen from '../screens/cameraScreen';
import UploadScreen from '../screens/UploadScreen';
import CreateAccount from '../screens/CreateAccount';
import StartingScreen from '../screens/StartingScreen';
import BinMapScreen from '../screens/BinMapScreen';
import LoginScreen from '../screens/LoginScreen';
import InfoScreen from '../screens/infoScreen';
import { TouchableOpacity } from 'react-native';
import GuestHomeScreen from '../screens/GuestHomeScreen';
import GuestProfileScreen from '../screens/GuestProfileScreen';


// Screen names
const homeName = 'Home';
const mapName = 'Map';
const profileName = 'Profile';
const scannerName = 'Scanner';
const infoName = 'Info';
const guestHomeName = 'GuestHome';

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
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="Starting" component={StartingScreen} />
    <Stack.Screen name="CreateAccount" component={CreateAccount} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="GuestTabs" component={GuestTabs} />
    <Stack.Screen name="Info" component={InfoScreen} />
  </Stack.Navigator>
);


const MainStack = ({theme}) => (
  <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
     <Stack.Screen name="AppTabs">
      {(props) => <AppTabs {...props} theme={theme} />}
    </Stack.Screen>
    <Stack.Screen name="Info" component={InfoScreen} />
  </Stack.Navigator>
);


const GuestTabs = ({ theme }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === homeName) {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === mapName) {
          iconName = focused ? 'navigate' : 'navigate-outline';
        } else if (route.name === profileName) {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === scannerName) {
          iconName = focused ? 'camera' : 'camera-outline';
        } else if (route.name === infoName) {
          iconName = focused ? 'information-circle' : 'information-circle-outline';
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
    <Tab.Screen name={homeName} component={GuestHomeScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={mapName} component={MapScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={scannerName} component={ScanStack} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={infoName} component={InfoScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={profileName} component={GuestProfileScreen} options={{ tabBarButton: CustomTabButton }} />
  </Tab.Navigator>
);



const AppTabs = ({ theme }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === homeName) {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === mapName) {
          iconName = focused ? 'navigate' : 'navigate-outline';
        } else if (route.name === profileName) {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === scannerName) {
          iconName = focused ? 'camera' : 'camera-outline';
        } else if (route.name === infoName) {
          iconName = focused ? 'information-circle' : 'information-circle-outline';
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
    <Tab.Screen name={mapName} component={MapScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={scannerName} component={ScanStack} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={infoName} component={InfoScreen} options={{ tabBarButton: CustomTabButton }} />
    <Tab.Screen name={profileName} component={ProfileScreen} options={{ tabBarButton: CustomTabButton }} />
  </Tab.Navigator>
);

export default function AppNavigator({ isAuthenticated }) {
  const { theme } = useContext(ThemeContext);
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack theme={theme}/> : <AuthStack />}
    </NavigationContainer>
  );
}

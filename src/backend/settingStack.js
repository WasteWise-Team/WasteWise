import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text } from 'react-native';
import Settings from '../components/settingsPage';
import UserSettings from '../backend/userSettings';
import ThemeContext from '../context/ThemeContext';

const Stack = createStackNavigator();

export default function SettingsStack( {onUpdateBio} ) {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    headerStyle: {
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
    headerTitleStyle: {
      fontWeight: 'medium',
      fontFamily: 'Nunito',
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
    },
    headerButtonStyle: {
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D', // Style for header buttons
      fontSize: 5, 
    },
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTintColor: styles.headerButtonStyle.color,
      }}
    >
      <Stack.Screen
        name="SettingsPage"
        component={Settings}
        options={{
          headerShown: false, // Hide the header for this screen if needed
          title: '',
        }}
      />
      <Stack.Screen
        name="UserSettings"
        options={{
          title: 'Edit Profile',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      >
        {props => <UserSettings {...props} onUpdateBio={onUpdateBio} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

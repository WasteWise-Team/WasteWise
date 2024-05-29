import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ProfileHeader from '../components/profileHeader';
import Settings from '../components/settings';
import History from '../components/scanHistory';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Leaderboard from '../components/Leaderboard';

const { width } = Dimensions.get('window');
const baseFontSize = width > 350 ? 16 : 14;

// Dummy components for each tab
function HistoryScreen({navigation}) {
  return (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
       <History navigation={navigation} />
    </View>
  );
}

function RanksScreen() {
  return (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
      <Leaderboard navigation={navigation} />
    </View>
  );
}

function SocialScreen() {
  return (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
      <Text>Social Content</Text>
    </View>
  );
}

function SettingsScreen({navigation}) {
  return (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
       <Settings navigation={navigation} />
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ navigation }) {
  const profileData = {
    profileImage: 'https://i.pinimg.com/564x/1b/2d/d6/1b2dd6610bb3570191685dcfb3e5e68e.jpg',
    username: 'dmalfoy',
    bio: 'draco. draco malfoy',
  };

  return (
    <View style={styles.container}>
      <ProfileHeader
        profileImage={profileData.profileImage}
        username={profileData.username}
        bio={profileData.bio}
        onLogout={() => {}} // Empty function for onLogout
      />
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#2D5A3D', height: 2 }, // actual tab bar
          tabBarLabelStyle: { fontSize: baseFontSize, fontFamily: 'Nunito-Regular', color: '#2D5A3D', textTransform: 'none', marginBottom: -5,}, // tab bar container
          tabBarStyle: {
            backgroundColor: '#C4D8BF',
            borderBottomWidth: 0, // Remove the bottom border
            shadowColor: 'transparent', // Remove the shadow
            elevation: 0, // Remove the elevation (shadow on Android)
          },
          tabBarActiveTintColor: '#2D5A3D', // Active tab label color
          tabBarInactiveTintColor: '#2D5A3D', // Inactive tab label color
        }}
      >
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Ranks" component={Leaderboard} />
        <Tab.Screen name="Social" component={SocialScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4D8BF',
  },
  scene: {
    flex: 1,
  },
});
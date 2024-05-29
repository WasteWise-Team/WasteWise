import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ProfileHeader from '../components/profileHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const { width } = Dimensions.get('window');

// Dummy components for each tab
function HistoryScreen() {
  return (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
      <Text>History Content</Text>
    </View>
  );
}

function LeaderboardsScreen() {
  return (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
      <Text>Leaderboards Content</Text>
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

function SettingsScreen() {
  return (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
      <Text>Settings Content</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ navigation }) {
  // const [index, setIndex] = useState(0);
  // const [routes] = useState([
  //   { key: 'history', title: 'History' },
  //   { key: 'leaderboards', title: 'Leaderboards' },
  //   { key: 'social', title: 'Social' },
  //   { key: 'settings', title: 'Settings' },
  // ]);

  // const renderScene = SceneMap({
  //   history: HistoryRoute,
  //   leaderboards: LeaderboardsRoute,
  //   social: SocialRoute,
  //   settings: SettingsRoute,
  // });

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
          tabBarIndicatorStyle: { backgroundColor: '#2D5A3D', height: 2 },
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#C4D8BF' },
          tabBarActiveTintColor: '#2D5A3D', // Active tab label color
          tabBarInactiveTintColor: '#2D5A3D', // Inactive tab label color
        }}
      >
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Leaderboards" component={LeaderboardsScreen} />
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
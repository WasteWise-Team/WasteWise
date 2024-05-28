import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import ProfileHeader from '../components/profileHeader';
import ProfileNavigation from '../components/profileNavigation';


const { width } = Dimensions.get('window');

// Dummy components for each tab
const HistoryRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
    <Text>History Content</Text>
  </View>
);

const LeaderboardsRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
    <Text>Leaderboards Content</Text>
  </View>
);

const SocialRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
    <Text>Social Content</Text>
  </View>
);

const SettingsRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
    <Text>Settings Content</Text>
  </View>
);

const initialLayout = { width };

export default function ProfileScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'history', title: 'History' },
    { key: 'leaderboards', title: 'Leaderboards' },
    { key: 'social', title: 'Social' },
    { key: 'settings', title: 'Settings' },
  ]);

  const renderScene = SceneMap({
    history: HistoryRoute,
    leaderboards: LeaderboardsRoute,
    social: SocialRoute,
    settings: SettingsRoute,
  });

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
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <ProfileNavigation 
            navigationState={props.navigationState} 
            setIndex={setIndex} 
          />
        )}
      />
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
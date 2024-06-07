import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import GuestProfileHeader from '../components/GuestProfileHeader';
import Settings from '../components/settings';
import History from '../components/scanHistory';
import Social from '../components/social';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Leaderboard from '../components/Leaderboard';
import ThemeContext from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const baseFontSize = width > 350 ? 16 : 14;

const Tab = createMaterialTopTabNavigator();

export default function GuestProfileScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const profileData = {
    profileImage: 'https://i.pinimg.com/564x/1b/2d/d6/1b2dd6610bb3570191685dcfb3e5e68e.jpg',
    username: 'Guest',
    bio: 'Sign In',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
    scene: {
      flex: 1,
    },
    welcome_text: {
        fontSize: 45,
        fontFamily: 'Nunito-Regular',
        color: theme === 'dark' ? '#F8F8F8' : '#2D5A3D',
        textAlign: 'center', // Center the text
        marginBottom: 20, // Add margin to separate from the chart
    },
  });

  return (
    <View style={styles.container}>
      <GuestProfileHeader
        profileImage={profileData.profileImage}
        username={profileData.username}
        bio={profileData.bio}
        navigation={navigation}
      />
      <Text style={styles.welcome_text}> 
        Sign in to unlock features!
      </Text>
    </View>
  );
}

// Dummy components for each tab
function HistoryScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
  });

  return (
    <View style={styles.scene}>
      <History navigation={navigation} />
    </View>
  );
}

function RanksScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
  });

  return (
    <View style={styles.scene}>
      <Leaderboard navigation={navigation} />
    </View>
  );
}

function SocialScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
  });

  return (
    <View style={styles.scene}>
      <Social navigation={navigation} />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
  });

  return (
    <View style={styles.scene}>
      <Settings navigation={navigation} />
    </View>
  );
}

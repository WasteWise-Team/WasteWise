import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ProfileHeader from '../components/profileHeader';
import History from '../components/scanHistory';
import Social from '../components/social';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Leaderboard from '../components/Leaderboard';
import ThemeContext from '../context/ThemeContext';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import SettingsStack from '../backend/settingStack';  // Import the new SettingsStack component

const { width } = Dimensions.get('window');
const baseFontSize = width > 350 ? 16 : 14;

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [profileData, setProfileData] = useState({
    profileImage: 'https://i.pinimg.com/564x/1b/2d/d6/1b2dd6610bb3570191685dcfb3e5e68e.jpg', // default image
    username: 'Guest',
    bio: 'Change me',
  });

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const userDocRef = doc(FIRESTORE_DB, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setProfileData({
              profileImage: userData.profileImageLink || profileData.profileImage,
              username: userData.username || '',
              bio: userData.bio || 'Change me!',
            });
          } else {
            console.log('User document does not exist.');
          }
        } else {
          console.log('No current user.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromFirestore(); // Call the function inside useEffect to ensure it runs after the component mounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures it runs only once after mounting

  const updateProfileImage = (newImageUri) => {
    setProfileData((prevData) => ({
      ...prevData,
      profileImage: newImageUri,
    }));
  };

  const updateBio = (newBio) => {
    setProfileData((prevData) => ({
      ...prevData,
      bio: newBio,
    }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
    scene: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <ProfileHeader
        profileImage={profileData.profileImage}
        username={profileData.username}
        bio={profileData.bio}
        navigation={navigation}
        onUpdateProfileImage={updateProfileImage} // Pass the callback to ProfileHeader
        onUpdateBio={updateBio}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#2D5A3D', height: 2 },
          tabBarLabelStyle: {
            fontSize: baseFontSize,
            fontFamily: 'Nunito-Regular',
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            textTransform: 'none',
            marginBottom: -5,
          },
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
            borderBottomWidth: 0,
            shadowColor: 'transparent',
            elevation: 0,
          },
          tabBarActiveTintColor: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
          tabBarInactiveTintColor: '#2D5A3D',
        }}
      >
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Ranks" component={RanksScreen} />
        <Tab.Screen name="Social" component={SocialScreen} />
        <Tab.Screen name="Settings">
          {() => <SettingsStack onUpdateBio={updateBio} />}
        </Tab.Screen>
      </Tab.Navigator>
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

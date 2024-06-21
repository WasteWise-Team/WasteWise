import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ThemeContext from '../context/ThemeContext';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';

/**
 * SCALING STUFF
 */
const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.20;

const ProfileHeader = ({ profileImage, username, bio, navigation, onUpdateProfileImage }) => {
  const { theme } = useContext(ThemeContext);
  const [uploading, setUploading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photo library.');
    }
    return status === 'granted';
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker Result:', result);

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log('Selected Image URI:', uri);
        if (!uri) {
          throw new Error('Image URI is undefined');
        }
        await uploadImage(uri);
      } else {
        console.log('Image picking was cancelled.');
      }
    } catch (error) {
      console.error('Error during image picking:', error);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      console.log('Uploading image from URI:', uri);

      // Ensure the URI is accessible
      if (!uri) {
        throw new Error('Invalid URI');
      }

      const response = await fetch(uri);
      console.log('Fetch response:', response);

      const blob = await response.blob();
      console.log('Blob:', blob);

      const user = FIREBASE_AUTH.currentUser;
      console.log('Current user:', user);

      if (!user) {
        throw new Error('No user logged in');
      }

      const filename = `${user.uid}/profile.jpg`;
      const storageRef = ref(FIREBASE_STORAGE, `profileimages/${filename}`);
      console.log('Storage reference:', storageRef);

      // Upload the image
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded successfully to storage');

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);

      // Update Firestore with the new profile image URL
      const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
      console.log('User document reference:', userDocRef);

      await updateDoc(userDocRef, { profileImageLink: downloadURL });
      console.log('Firestore document updated with profile image URL');

      // Call the onUpdateProfileImage callback to update the profile image in the state
      onUpdateProfileImage(downloadURL);

      Alert.alert('Success', 'Profile image updated successfully');
    } catch (error) {
      console.error('Error during image upload:', error);
      Alert.alert('Error', 'Could not update profile image');
    } finally {
      setUploading(false);
      console.log('Uploading process finished');
    }
  };

  const styles = StyleSheet.create({
    headerContainer: {
      height: HEADER_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 40,
      paddingLeft: 40,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      marginBottom: -20, // Negative margin to reduce space between header and next item
    },
    profileImage: {
      width: HEADER_HEIGHT * 0.50, // Adjust the size to fit your design
      height: HEADER_HEIGHT * 0.50,
      borderRadius: (HEADER_HEIGHT * 0.6) / 2,
      marginRight: 10,
    },
    textContainer: {
      padding: 12,
      flex: 1,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
    },
    bio: {
      fontSize: 14,
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
    },
    logoutButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      padding: 10,
      borderRadius: 5,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={pickImage} disabled={uploading}>
        <View>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          {uploading && (
            <View style={[styles.profileImage, { position: 'absolute', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => FIREBASE_AUTH.signOut()}
        underlayColor="#68A77C" // Color when pressed, doesn't work yet
      >
        <AntDesign name="logout" size={20} color={theme === 'dark' ? '#C4D8BF' : '#2D5A3D'} />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;

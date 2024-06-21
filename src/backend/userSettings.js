import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import ThemeContext from '../context/ThemeContext';

export default function UserSettings({ onUpdateBio }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [bio, setBio] = useState('');

  const handleChangePassword = () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      sendPasswordResetEmail(FIREBASE_AUTH, user.email)
        .then(() => {
          Alert.alert('Success', 'Password reset email sent!');
        })
        .catch(error => {
          Alert.alert('Error', error.message);
        });
    }
  };

  const handleChangeBio = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
      try {
        await updateDoc(userDocRef, { bio });
        onUpdateBio(bio);
        Alert.alert('Success', 'Bio updated successfully!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        await deleteDoc(userDocRef);
        await user.delete();
        Alert.alert('Success', 'Account deleted successfully!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
    inputContainer: {
      alignItems: 'center', // Center horizontally
      marginTop: 20,
      marginBottom: 20,
    },
    input: {
      width: '80%',
      height: 50,
      borderColor: theme === 'dark' ? '#C4D8BF90' : '#2D5A3D',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D', // Text color
    },
    button: {
      width: '80%',
      height: 50,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#639460' : '#387a4d',
      marginVertical: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Change Bio"
          placeholderTextColor={theme === 'dark' ? '#C4D8BF90' : '#2D5A3D90'}
          value={bio}
          onChangeText={text => setBio(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangeBio}>
          <Text style={styles.buttonText}>Change Bio</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

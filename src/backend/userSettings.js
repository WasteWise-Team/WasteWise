import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import ThemeContext from '../context/ThemeContext';

export default function UserSettings() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [status, setStatus] = useState('');

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

    const handleChangeStatus = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        try {
            await updateDoc(userDocRef, { status });
            Alert.alert('Success', 'Status updated successfully!');
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
          marginBottom: 20,
        },
        input: {
          width: '100%',
          height: 50,
          borderColor: '#ddd',
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 10,
          marginVertical: 10,
        },
        button: {
          width: '100%',
          height: 50,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1AB385',
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
          placeholder="Change Status"
          value={status}
          onChangeText={setStatus}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangeStatus}>
          <Text style={styles.buttonText}>Change Status</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Modal } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, signOut, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import ThemeContext from '../context/ThemeContext';

export default function UserSettings({ onUpdateBio }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
      const credential = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, credential);
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        await deleteDoc(userDocRef);
        await user.delete();
        await signOut(FIREBASE_AUTH);
        Alert.alert('Success', 'Account deleted successfully!');
        navigation.navigate('LoginScreen'); // Ensure this matches your route name
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    closeModal();
    await handleDeleteAccount();
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalInput: {
      width: '100%',
      height: 50,
      borderColor: theme === 'dark' ? '#C4D8BF90' : '#2D5A3D',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D', // Text color
    },
    modalButton: {
      width: '100%',
      height: 50,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#639460' : '#387a4d',
      marginVertical: 10,
    },
    modalButtonText: {
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
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your password"
              placeholderTextColor={theme === 'dark' ? '#C4D8BF90' : '#2D5A3D90'}
              value={password}
              secureTextEntry
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirmDelete}>
              <Text style={styles.modalButtonText}>Confirm Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

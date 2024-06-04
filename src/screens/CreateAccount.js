import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from '../context/ThemeContext';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';



const { width, height } = Dimensions.get('window');

const CreateAccount = ({ navigation }) => {

  const { theme, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth  = FIREBASE_AUTH;

  const signUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Sign Up successful!')
    }  catch(error) {
      console.log(error);
      alert('Sign up failed!' + error.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ?  '#042222' : '#fff',
      paddingHorizontal: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: height * 0.02, // Adjusted to 2% of screen height
      position: 'relative', // Ensure relative positioning for absolute children
    },
    iconContainer: {
      position: 'absolute',
      left: 20,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#00DF82' : '#2D5A3D',
    },
    formContainer: {
      alignItems: 'center',
      marginTop: height * 0.05, // Further reduced from 10% to 5% of screen height
    },
    input: {
      width: '80%', // Adjust width as needed
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: '#f5f5f5',
    },
    signUpButton: {
      width: '80%', // Adjust width as needed
      height: 50,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#1AB385' : '#2D5A3D',
      marginTop: 20,
    },
    signUpButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    forgotPasswordButton: {
      marginTop: 10,
    },
    forgotPasswordButtonText: {
      color: theme === 'dark' ? '#1AB385' : '#2D5A3D',
      fontSize: 16,
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme === 'dark' ?  '#042222' : '#fff',
      
    },
    scrollViewContainer: {
      flexGrow: 1,
    },
  });



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                <AntDesign name="close" size={24} color="gray" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Sign Up</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#666" />
              <TextInput value={email} style={styles.input} placeholder="Email" placeholderTextColor="#666" keyboardType="email-address" onChangeText={(text) => setEmail(text)} />
              <TextInput value={password} style={styles.input} placeholder="Password" placeholderTextColor="#666" secureTextEntry onChangeText={(text) => setPassword(text)} />
              <TextInput style={styles.input} placeholder="Retype Password" placeholderTextColor="#666" secureTextEntry />

              <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordButtonText}>Forgot Your Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};


export default CreateAccount;

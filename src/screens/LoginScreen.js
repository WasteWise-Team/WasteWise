import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import ThemeContext from '../context/ThemeContext';



const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  
  

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

  const signIn = async() => {
    if (!email || !password ) {
      alert('All fields are required!');
      return;
    }
    
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log(response);
      alert('Sign in successful');
    } catch (error) {
      console.log(error);
      alert('Sign in failed:');
    }
  } 


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                <AntDesign name="close" size={24} color="gray" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Log In</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput style={styles.input} value={email} placeholder="Email" placeholderTextColor="#666" keyboardType="email-address" onChangeText={(text) => setEmail(text)} />
              <TextInput style={styles.input} value={password} placeholder="Password" placeholderTextColor="#666" secureTextEntry onChangeText={(text) => setPassword(text)} />

              <TouchableOpacity style={styles.signUpButton} onPress={signIn}>
                <Text style={styles.signUpButtonText}>Log In</Text>
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


export default LoginScreen;

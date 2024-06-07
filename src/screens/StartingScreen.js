import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slideshow from '../components/startScreenSlide'; // Import the Slideshow component
import ThemeContext from '../context/ThemeContext';

export default function StartingScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const gradientColors = theme === 'dark' ? ['#042222', '#68A77C'] : ['#C4D8BF', '#E2FAEC'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      marginVertical: 30,
    },
    title: {
      fontSize: 25,
      fontFamily: 'Nunito-SemiBold',
      color: theme === 'dark' ? '#00DF82' : '#2D5A3D',
    },
    title2: {
      color: '#FCFCFE',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: Dimensions.get('window').width * 0.75,
      height: Dimensions.get('window').height * 1.5,
      alignSelf: 'center', // Center the container horizontally
    },
    footer: {
      alignItems: 'center',
      marginVertical: 50,
      fontFamily: 'Nunito-Regular',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderWidth: 1, // Add border width
      borderColor: theme === 'dark' ? '#EDF7EA' : '#2D5A3D',
      backgroundColor: 'transparent',
      marginVertical: 10,
      width: '60%', // Make the button width wider
    },
    buttonText: {
      fontSize: 15,
      lineHeight: 21,
      letterSpacing: 0.25,
      color: theme === 'dark' ? '#EDF7EA' : '#2D5A3D',
    },
    link: {
      marginVertical: 10,
    },
    linkText: {
      fontSize: 15,
      color: theme === 'dark' ? '#EDF7EA' : '#2D5A3D',
      textDecorationLine: 'none', // Remove underline
    },
  });

  const handleGuestMode = () => {
    navigation.navigate('GuestTabs'); // Navigate to a screen within the GuestStack
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Waste
            <Text style={styles.title2}>Wise</Text>
          </Text>
        </View>
        <View style={styles.content}>
          <Slideshow />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.firstButton]} onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.linkText}>Already a member?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={handleGuestMode}>
            <Text style={styles.linkText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

import React, { useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ThemeContext from '../context/ThemeContext';

export default function ScanHistory() {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      padding: 16, // Add padding around the container
    },
    content: {
      width: '87%', // Make content 87% of the screen width
      alignSelf: 'center', // Center the content
      height: '95%',
    },
    title: {
      paddingTop: 20,
      fontSize: 20,
      fontFamily: 'Nunito-Bold',
      textAlign: 'left', // Align title to the left
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      marginVertical: 20,
      paddingLeft: 25,
    },
    fillerText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan History</Text>
        <Text style={styles.fillerText}>This is a placeholder text while we disable the fetching functionality.</Text>
      </View>
    </SafeAreaView>
  );
}
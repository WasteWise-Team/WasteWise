import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ThemeContext from '../context/ThemeContext';
import { AntDesign } from '@expo/vector-icons';

/**
 * SCALING STUFF
 */
const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.20;
const LEFT_MARGIN = width * 0.2;

const ProfileHeader = ({ profileImage, username, bio, navigation }) => {

  const { theme, toggleTheme } = useContext(ThemeContext);

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
    }
  });
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Starting")}
        underlayColor="#68A77C" // Color when pressed, doesn't work yet
      >
        <AntDesign name="logout" size={20} color={theme === 'dark' ? '#C4D8BF' : '#2D5A3D'} />
      </TouchableOpacity>
    </View>
  );
};



export default ProfileHeader;

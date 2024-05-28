import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileNavigation = ({ navigationState, setIndex }) => {
  return (
    <View style={styles.navContainer}>
      {navigationState.routes.map((route, index) => {
        const isFocused = navigationState.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              console.log(`Navigating to ${route.title}`);
              setIndex(index);
            }}
            style={styles.navItem}
          >
            <Text style={[styles.navText, isFocused ? styles.navTextFocused : null]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50, // Adjust the height as needed
    backgroundColor: '#C4D8BF', // Change the background color if needed
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    color: '#2D5A3D',
  },
  navTextFocused: {
    color: '#2D5A3D',
    fontWeight: 'bold',
  },
});

export default ProfileNavigation;
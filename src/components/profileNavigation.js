import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileNavigation = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.navContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.navItem, isFocused ? styles.navItemFocused : null]}
          >
            <Text style={[styles.navText, isFocused ? styles.navTextFocused : null]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  // navContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   height: 50, // Adjust the height as needed
  //   backgroundColor: '#C4D8BF', // Change the background color if needed
  // },
  // navItem: {
  //   flex: 1,
  //   alignItems: 'center',
  //   paddingVertical: 10,
  // },
  // navItemFocused: {
  //   backgroundColor: '#D4E1D0', // Add a background color for the focused item if desired
  // },
  // navText: {
  //   fontSize: 16,
  //   color: '#2D5A3D',
  // },
  // navTextFocused: {
  //   color: '#2D5A3D',
  //   fontWeight: 'bold',
  // },
});

export default ProfileNavigation;

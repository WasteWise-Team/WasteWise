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
export default ProfileNavigation;

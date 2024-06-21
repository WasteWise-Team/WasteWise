import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ThemeContext from '../context/ThemeContext';

export default function Settings({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(theme === 'dark');
  const [isDataEnabled, setIsDataEnabled] = useState(false);
  const [isAccountPublic, setIsAccountPublic] = useState(false);

  useEffect(() => {
    setIsDarkModeEnabled(theme === 'dark');
  }, [theme]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
  };

  const toggleDataSwitch = () => setIsDataEnabled(previousState => !previousState);

  const publicAccountSwitch = () => setIsAccountPublic(previousState => !previousState);

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
    },
    scrollViewContent: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
    },
    title: {
      fontSize: 12,
      color: theme === 'dark' ? '#C4D8BF70' : '#2D5A3D',
      marginLeft: 18,
      marginRight: 18,
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#C4D8BF70' : '#2D5A3D',
    },
    body_container: {
      flex: 1,
      marginLeft: 20,
      marginRight: 20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      paddingVertical: 2,
    },
    text: {
      fontSize: 16,
      color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
      fontFamily: 'Nunito-Medium',
    },
    icon: {
      marginLeft: 'auto',
    },
    switch: {
      marginLeft: 'auto',
    },
    section: {
      marginTop: 40,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#C4D8BF70' : '#2D5A3D',
    },
    sectionTitle: {
      fontSize: 12,
      color: theme === 'dark' ? '#C4D8BF70' : '#2D5A3D',
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Account Settings</Text>
        <View style={styles.body_container}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('UserSettings')}>
            <Text style={styles.text}>Edit Profile</Text>
            <Icon name="chevron-right" size={20} color={theme === 'dark' ? '#C4D8BF' : '#2D5A3D'} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.row}>
            <Text style={styles.text}>Dark Mode</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#2D593D' }}
              thumbColor={isDarkModeEnabled ? '#99DAB3' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleTheme}
              value={isDarkModeEnabled}
              style={styles.switch}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Data Collection</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#2D593D' }}
              thumbColor={isDarkModeEnabled ? '#99DAB3' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleDataSwitch}
              value={isDataEnabled}
              style={styles.switch}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Make My Account Public</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#2D593D' }}
              thumbColor={isDarkModeEnabled ? '#99DAB3' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={publicAccountSwitch}
              value={isAccountPublic}
              style={styles.switch}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>About Us</Text>
            <Icon name="chevron-right" size={20} color={theme === 'dark' ? '#C4D8BF' : '#2D5A3D'} style={styles.icon} />
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color={theme === 'dark' ? '#C4D8BF' : '#2D5A3D'} style={styles.icon} />
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Terms and Conditions</Text>
            <Icon name="chevron-right" size={20} color={theme === 'dark' ? '#C4D8BF' : '#2D5A3D'} style={styles.icon} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

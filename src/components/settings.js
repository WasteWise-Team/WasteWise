import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Settings({ setting }) {
    const [isDataEnabled, setIsDataEnabled] = useState(false);
    const toggleDataSwitch = () => setIsDataEnabled(previousState => !previousState);

    const [isPublicEnabled, setIsPublicEnabled] = useState(false);
    const togglePublicSwitch = () => setIsPublicEnabled(previousState => !previousState);

    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
    const toggleDarkModeSwitch = () => setIsDarkModeEnabled(previousState => !previousState);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}> 
                    Account Settings
                </Text>
                <View style={styles.body_container}>
                    <View style={styles.row}>
                      <Text style={styles.text}>Edit Profile</Text> 
                      <Icon name="chevron-right" size={20} color="#000" style={styles.icon} /> 
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>Change Password</Text> 
                      <Icon name="chevron-right" size={20} color="#000" style={styles.icon} /> 
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>Data Collection</Text> 
                      <Switch
                            trackColor={{ false: '#767577', true: '#2D5A3D' }}
                            thumbColor={isDataEnabled ? '#99DAB3' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleDataSwitch}
                            value={isDataEnabled}
                            style={styles.switch}
                        />
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>Make Profile Public</Text> 
                      <Switch
                            trackColor={{ false: '#767577', true: '#2D5A3D' }}
                            thumbColor={isPublicEnabled  ? '#99DAB3' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={togglePublicSwitch}
                            value={isPublicEnabled}
                            style={styles.switch}
                        />
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>Dark Mode</Text> 
                      <Switch
                            trackColor={{ false: '#767577', true: '#2D5A3D' }}
                            thumbColor={isDarkModeEnabled  ? '#99DAB3' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleDarkModeSwitch}
                            value={isDarkModeEnabled}
                            style={styles.switch}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>More</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>About Us</Text> 
                      <Icon name="chevron-right" size={20} color="#000" style={styles.icon} /> 
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>Privacy Policy</Text> 
                      <Icon name="chevron-right" size={20} color="#000" style={styles.icon} /> 
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.text}>Terms and Conditions</Text> 
                      <Icon name="chevron-right" size={20} color="#000" style={styles.icon} /> 
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Edit style stuff here
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#C4D8BF',
    },
    scrollViewContent: {
        padding: 16,
    },
    title: {
        fontSize: 15,
        color: '#7C7C7C',
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
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
        borderBottomColor: '#7C7C7C',
    },
    sectionTitle: {
        fontSize: 15,
        color: '#7C7C7C',
    },
});

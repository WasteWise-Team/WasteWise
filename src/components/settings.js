import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function settings({ navigation }) {
    const [isDataEnabled, setIsDataEnabled] = useState(false);
    const toggleDataSwitch = () => setIsDataEnabled(previousState => !previousState);

    const [isPublicEnabled, setIsPublicEnabled] = useState(false);
    const togglePublicSwitch = () => setIsPublicEnabled(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Text style={styles.title}> 
                <Text>Account Settings</Text>
            </Text>
            <View style={styles.body_container}>
                <View style={styles.edit_container}>
                  <Text>Edit Profile</Text> 
                  <Icon name="chevron-right" size={20} color="#000" style={styles.icon} /> 
                </View>
                <View style={styles.change_container}>
                  <Text>Change Password</Text> 
                  <Icon name="chevron-right" size={20} color="#000" style={styles.icon2} /> 
                </View>
                <View style={styles.data_container}>
                  <Text>Data Collection</Text> 
                  <Switch
                        trackColor={{ false: '#767577', true: '#2D5A3D' }}
                        thumbColor={isDataEnabled ? '#99DAB3' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleDataSwitch}
                        value={isDataEnabled}
                        style={styles.switch}
                    />
                </View>
                <View style={styles.public_container}>
                  <Text>Make Profile Public</Text> 
                  <Switch
                        trackColor={{ false: '#767577', true: '#2D5A3D' }}
                        thumbColor={isPublicEnabled  ? '#99DAB3' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={togglePublicSwitch}
                        value={isPublicEnabled}
                        style={styles.switch2}
                    />
                </View>
            </View>
        </View>
    );
}

// Edit style stuff here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#C4D8BF',
    },
    title: {
        position: 'absolute',
        fontSize: 15,
        color: '#7C7C7C',
        alignItems: 'left',
        marginLeft: 40,
        top: 10,
    },
    body_container: {
        flex: 1,
        marginLeft: 40,
        marginToptop: 60,
    },
    edit_container: {
        marginTop: 40,
        flexDirection: 'row',
        paddingVertical: 2,
    },
    icon: {
        marginLeft: 200,
        flex: 1,
    },
    change_container: {
        flexDirection: 'row',
        marginTop: 20,
        paddingVertical: 2,
    },
    icon2: {
        marginLeft: 156,
        flex: 1,
    },
    data_container: {
        flexDirection: 'row',
        marginTop: 20,
        paddingVertical: 2,
    },
    switch: {
        marginLeft: 160, // Adjust as needed for spacing
    },
    public_container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 2,
    },
    switch2: {
        marginLeft: 135,
    },
});
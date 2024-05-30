import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const StartingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>Welcome</Text>
                <Pressable
                    style={[styles.button, styles.firstButton]}
                    onPress={() => navigation.navigate('CreateAccount')}
                >
                    <Text style={styles.buttonText}>Create Account</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigation.navigate('AppTabs')}>
                    <Text style={styles.buttonText}>Continue as Guest</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C4D8BF',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#2D5A3D',
    },
    firstButton: {
        marginBottom: 10, // Add margin only to the first button
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default StartingScreen;

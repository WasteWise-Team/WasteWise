import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text 
                onPress={() => alert('This is the Home Screen')}
                style={styles.text}
            >
                Home Screen
            </Text>
        </View>
    );
}

// Edit style stuff here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 26,
        fontWeight: 'bold',
    },
});

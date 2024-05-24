import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import * as Font from 'expo-font';

export default function HomeScreen({ navigation }) {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    useEffect(() => {
        async function loadFonts() {
            // await Font.loadAsync({
            //     'CustomFont': require('./assets/fonts/NunitoRegular-vmABZ.ttf'),
            // });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return null; // You can return a loading indicator here
    }

    return (
        <View style={styles.container}>
            <View style={styles.title_container}>
                <Text style={styles.title}>
                    Waste
                    <Text style={styles.title2}>Wise</Text>
                    {/* <FontAwesome name="recycle" size={40} color="#2D5A3D" /> */}
                </Text>
                <View style={styles.horizontalLine} />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

// Edit style stuff here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4D8BF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 80,
    },

    title_container: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%', // Ensure the container takes the full width
        paddingHorizontal: 20, // Add padding to make the line appear properly
    },

    title: {
        fontSize: 30,
        fontFamily: 'NunitoRegular-vmABZ',
        color: '#34724B',
    },

    title2: {
        color: '#FCFCFE',
    },

    horizontalLine: {
        marginTop: 10, // Space between the title and the line
        width: '100%', // Full width
        height: 2, // Line height
        backgroundColor: '#34724B', // Line color
    },
});

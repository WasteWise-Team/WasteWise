import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
// import * as Font from 'expo-font';

// Get screen dimensions
const { width } = Dimensions.get('window');

const baseFontSize = width > 600 ? 24 : 16; // Example breakpoint at 600
  
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

            <Text style={styles.welcome_text}>
                Good afternoon, <Text style={styles.name}>My</Text>. 
                It's <Text style={styles.name}>73°F</Text> and mostly sunny outside.
            </Text>

            <View style={styles.summary_container}>
                <Text style={styles.summary_text}>
                    <Text style={styles.summary_word}>Summary:</Text> 
                </Text>
                <Text style={styles.summary_text2}>
                    You've recycled a total of <Text style={styles.name}>2478</Text> pounds
                </Text>
            </View>
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
        paddingTop: 70,
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
        width: '120%', // Full width
        height: 1, // Line height
        backgroundColor: '#264131', // Line color
    },

    welcome_text: {
        alignItems: 'center',
        fontSize: 15,
        fontFamily: 'NunitoRegular-vmABZ',
        color: '#2D5A3D',
    },

    name: {
        alignItems: 'center',
        color: '#68A77C',
    },

    summary_container: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%', // Ensure the container takes the full width
        justifyContent: 'flex-end',
        paddingBottom: 30,
        flex: 1,
    },

    summary_text: {
        alignItems: 'center',
        fontSize: 15,
        fontFamily: 'NunitoRegular-vmABZ',
        color: '#2D5A3D',
    },

    summary_text2: {
        alignItems: 'center',
        fontSize: 15,
        fontFamily: 'NunitoRegular-vmABZ',
        color: '#2D5A3D',
    },

    summary_word: {
        color: '#264131',
    },
});

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import TestChart from '../components/pie-chart';
import HeaderLogo from '../components/headerLogo'; // Import the HeaderLogo component

// Get screen dimensions
const { width } = Dimensions.get('window');

const baseFontSize = width > 600 ? 24 : 16; // Example breakpoint at 600

const Square = () => {
    return <View style={styles.square} />;
};
const Square1 = () => {
    return <View style={styles.square1} />;
};
const Square2 = () => {
    return <View style={styles.square1} />;
};
  
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
            <HeaderLogo />
            <StatusBar style="auto" />

            <Text style={styles.welcome_text}>
                Good afternoon, <Text style={styles.name}>My</Text>. 
                It's <Text style={styles.name}>73°F</Text> and mostly sunny outside.
            </Text>

            
            <TestChart />
            
            <View style={styles.squares_container}>
                <Square />
                <Text style={styles.category}>Plastic</Text>
                <Square1 />
                <Text style={styles.category}>Aluminum</Text>
                <Square2 />
                <Text style={styles.category}>Paper</Text>
            </View>
            
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

    shapes_container: {
        backgroundColor: '#0000',
    },

    squares_container: {
        flexDirection: 'row', // Arrange squares horizontally
        alignItems: 'center', // Align squares vertically centered
        marginVertical: 10, // Add vertical margin
        marginBottom: 50,
    },

    square: {
        width: 50,
        height: 50,
        backgroundColor: '#2D5A3D',
        alignSelf: 'flex-start', // Center the square horizontally
        marginLeft: 10,
    },

    square1: {
        width: 50,
        height: 50,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center', // Center the square horizontally
        marginLeft: 10,
    },

    square2: {
        width: 50,
        height: 50,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center', // Center the square horizontally
    },

    category: {
        color: '#000000',
        marginLeft: 10,
        alignContent: 'left', 
    },

    summary_container: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%', // Ensure the container takes the full width
        justifyContent: 'center',
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

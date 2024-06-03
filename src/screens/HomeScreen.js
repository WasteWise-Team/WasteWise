import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, SafeAreaView } from 'react-native';
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
    return <View style={styles.square2} />;
};
  
export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderLogo />
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <StatusBar style="auto" />
                    <Text style={styles.welcome_text}>
                        Good afternoon, <Text style={styles.name}>My</Text>. 
                        It's <Text style={styles.name}>73°F</Text> and mostly sunny outside.
                    </Text>

                    <View style={styles.chartContainer}>
                        <TestChart />

                        <View style={styles.squares_container}>
                            <Square />
                            <Text style={styles.category}>Plastic</Text>
                            <Square1 />
                            <Text style={styles.category}>Aluminum</Text>
                            <Square2 />
                            <Text style={styles.category}>Paper</Text>
                        </View>
                    </View>
                    
                    <View style={styles.summary_container}>
                        <Text style={styles.summary_text}>
                            <Text style={styles.summary_word}>Summary:</Text>
                            {"\n"}
                            You've recycled a total of <Text style={styles.name}>2478</Text> pounds
                        </Text>
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
    container: {
        flex: 1,
        backgroundColor: '#C4D8BF',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 5,
        width: '85%',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Add vertical margin to adjust spacing
        paddingBottom: 20,
        width: '85%',
        alignSelf: 'center',
    },
    

    welcome_text: {
        fontSize: 15,
        fontFamily: 'Nunito-Regular',
        color: '#2D5A3D',
        textAlign: 'center', // Center the text
        marginBottom: 20, // Add margin to separate from the chart
    },

    name: {
        color: '#68A77C',
        fontFamily: 'Nunito-Regular',
    },

    squares_container: {
        paddingTop: 50,
        flexDirection: 'row', // Arrange squares horizontally
        alignItems: 'center', // Align squares vertically centered
    }, 

    square: {
        width: 50,
        height: 50,
        backgroundColor: '#2D5A3D',
        marginHorizontal: 5, // Add horizontal margin between squares
    },
    square1: {
        width: 50,
        height: 50,
        backgroundColor: '#99DAB3',
        marginHorizontal: 5, // Add horizontal margin between squares
    },
    square2: {
        width: 50,
        height: 50,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 5, // Add horizontal margin between squares
    },
    category: {
        color: '#2D5A3D',
        marginHorizontal: 5, // Add horizontal margin between text and squares
        fontSize: 10, 
        fontFamily: 'Nunito-Regular',
        textAlign: 'center', // Center the text
    },

    summary_container: {
        paddingTop: 75,
        paddingBottom: 40,
        alignItems: 'center',
        width: '90%', // Ensure the container takes the full width
        justifyContent: 'center',
    },
    summary_text: {
        fontSize: 15,
        fontFamily: 'Nunito-Regular',
        color: '#2D5A3D',
        textAlign: 'center',
    },
    summary_word: {
        color: '#264131',
        fontFamily: 'Nunito-Regular',
    },
    name: {
        color: '#68A77C',
        fontFamily: 'Nunito-Regular',
    },
});
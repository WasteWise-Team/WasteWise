import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ThemeContext from '../context/ThemeContext';


export default function HeaderLogo() {

    const { theme, toggleTheme } = useContext(ThemeContext);


    const styles = StyleSheet.create({
        title_container: {
            alignItems: 'center',
            marginBottom: 20,
            width: '100%', // Ensure the container takes the full width
            paddingHorizontal: 20, // Add padding to make the line appear properly
            paddingTop: 5,
        },

        title: {
            fontSize: 30,
            fontFamily: 'Nunito-Regular',
            color: theme === 'dark' ? '#00DF82' : '#34724B',
        },

        title2: {
            color: '#FCFCFE',
            fontFamily: 'Nunito-Regular',
        },

        horizontalLine: {
            marginTop: 10, // Space between the title and the line
            width: '120%', // Full width
            height: 1, // Line height
            backgroundColor: theme === 'dark' ? '#264131' : '#82B37A', // Line color
        },
    });

    return (
        <View style={styles.title_container}>
            <Text style={styles.title}>
                Waste
                <Text style={styles.title2}>Wise</Text>
                {/* <FontAwesome name="recycle" size={40} color="#2D5A3D" /> */}
            </Text>
            <View style={styles.horizontalLine} />
        </View>
    );
}



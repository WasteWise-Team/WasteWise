import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import HeaderLogo from '../components/headerLogo';

export default function BinScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <HeaderLogo />
                <View style={styles.sectionContainer}>
                    <View style={styles.intro}>
                        <Text style={styles.paragraph}>
                            See a bin that doesn’t show up in our maps?
                        </Text>
                    </View>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.headerSection}>
                        Contribute to the Community,{'\n'}
                        Add a Bin.
                    </Text>
                </View>
                <View style={styles.sectionContainer}>
                    <View style={styles.stepsContainer}>
                        <View style={styles.verticalLine} />
                        <View style={styles.stepsContent}>
                            <Text style={styles.paragraph}>
                                1. Walk to the bin{'\n'}
                                2. Take a picture{'\n'}
                                3. Contribute to the community!{'\n\n'}
                                Happy Recycling
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Add My Bin</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Edit style stuff here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4D8BF',
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    sectionContainer: {
        width: '90%', // Adjust width as necessary
        marginBottom: 15, // Adjust margin as necessary to make gaps smaller
        alignSelf: 'center', // Center the container
        alignItems: 'flex-start', // Align content to the left
    },
    headerSection: {
        fontFamily: 'Nunito-Bold',
        fontSize: 20,
        marginBottom: 8,
        color: '#2D5A3D',
        textAlign: 'left',
    },
    paragraph: {
        fontFamily: 'Nunito-Regular',
        fontSize: 16,
        marginBottom: 8, // Adjust margin as necessary to make gaps smaller
        textAlign: 'left',
        color: '#2D5A3D',
    },
    stepsContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    verticalLine: {
        width: 1.5,
        backgroundColor: '#2D5A3D',
        marginRight: 10,
        color: '#2D5A3D',
    },
    stepsContent: {
        flex: 1,
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: '#2D5A3D',
        width: '65%', // Make the button span more horizontally
        alignSelf: 'center', // Center the button horizontally
    },
    buttonText: {
        fontSize: 16,
        color: '#2D5A3D',
        textAlign: 'center',
    },
});

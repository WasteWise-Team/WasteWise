import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import HeaderLogo from '../components/headerLogo';
import ThemeContext from '../context/ThemeContext';


export default function BinScreen({ navigation }) {
    const { theme, toggleTheme } = useContext(ThemeContext);


    // Edit style stuff here
    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF', 
        },
        scrollViewContainer: {
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
        },
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        sectionContainer: {
            width: '90%',
            marginBottom: 15,
            alignItems: 'right',
            paddingLeft: 10,
        },
        headerSection: {
            fontFamily: 'Nunito-Bold',
            fontSize: 20,
            marginBottom: 8,
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            textAlign: 'left',
        },
        paragraph: {
            fontFamily: 'Nunito-Regular',
            fontSize: 16,
            marginBottom: 8,
            textAlign: 'left',
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
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
            borderColor: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            width: '65%',
            alignSelf: 'center',
        },
        buttonText: {
            fontSize: 16,
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            textAlign: 'center',
        },
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderLogo />
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
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
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("BinMap")}>
                        <Text style={styles.buttonText}>Add My Bin</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}



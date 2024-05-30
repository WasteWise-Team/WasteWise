import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const IMAGE_URL = 'https://i.pinimg.com/564x/25/d9/dd/25d9dd4a3d76d97de90b9363d5c049d9.jpg';

const StartingScreen = ({ navigation }) => {
    return (
        <LinearGradient
            colors={['#C4D8BF', '#E2FAEC']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Waste
                        <Text style={styles.title2}>Wise</Text>
                    </Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: IMAGE_URL }} style={styles.image} />
                    </View>
                </View>
                <View style={styles.footer}>
                    <Pressable
                        style={[styles.button, styles.firstButton]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </Pressable>
                    <Pressable style={styles.link} onPress={() => navigation.navigate('CreateAccount')}>
                        <Text style={styles.linkText}>Already a member?</Text>
                    </Pressable>
                    <Pressable style={styles.link} onPress={() => navigation.navigate('AppTabs')}>
                        <Text style={styles.linkText}>Continue as Guest</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginVertical: 30,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Nunito-SemiBold',
        color: '#34724B',
    },
    title2: {
        color: '#FCFCFE',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width * 0.65,
        height: Dimensions.get('window').height * 0.6,
        borderRadius: 15,
    },
    footer: {
        alignItems: 'center',
        marginVertical: 40,
        fontFamily: 'Nunito-Regular',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderWidth: 1, // Add border width
        borderColor: '#2D5A3D', // Set border color
        backgroundColor: 'transparent',
        marginVertical: 10,
        width: '60%', // Make the button width wider
    },
    buttonText: {
        fontSize: 15,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: '#2D5A3D',
    },
    link: {
        marginVertical: 5,
    },
    linkText: {
        fontSize: 15,
        color: '#2D5A3D',
        textDecorationLine: 'none', // Remove underline
    },
});

export default StartingScreen;

import React from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const images = [
    'https://i.pinimg.com/564x/2a/cb/a2/2acba250c520f76108e9db8534b8496a.jpg',
    'https://i.pinimg.com/474x/5e/ce/77/5ece776bd7caac725b45d7d9dc784f13.jpg',
    'https://i.pinimg.com/474x/25/c3/d0/25c3d09c2f0b895f23e5af615c6d4a2d.jpg',
    // Add more URLs as needed
];

const Slideshow = () => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}
            >
                {images.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.75,
        height: height * 0.5, // Adjust the height as needed
        alignSelf: 'center', // Center the container horizontally
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.75,
        height: height * 0.5,
        resizeMode: 'cover',
    },
});

export default Slideshow;

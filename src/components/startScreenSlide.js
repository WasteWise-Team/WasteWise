import React, { useRef, useState } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const images = [
    'https://i.pinimg.com/564x/2a/cb/a2/2acba250c520f76108e9db8534b8496a.jpg',
    'https://i.pinimg.com/474x/5e/ce/77/5ece776bd7caac725b45d7d9dc784f13.jpg',
    'https://i.pinimg.com/474x/25/c3/d0/25c3d09c2f0b895f23e5af615c6d4a2d.jpg',
    // Add more URLs as needed
];

const Slideshow = () => {
    const scrollViewRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event) => {
        const slideSize = width * 0.75;
        const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
        setActiveIndex(index);
    };

    const scrollToIndex = (index) => {
        scrollViewRef.current.scrollTo({ x: index * width * 0.75, animated: true });
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContainer}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    ref={scrollViewRef}
                >
                    {images.map((uri, index) => (
                        <Image key={index} source={{ uri }} style={styles.image} />
                    ))}
                </ScrollView>
            </View>
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => scrollToIndex(index)}>
                        <View style={[styles.dot, activeIndex === index ? styles.activeDot : styles.inactiveDot]} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    container: {
        width: width * 0.75,
        height: height * 0.55, // Adjust the height as needed
        alignSelf: 'center', // Center the container horizontally
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.75,
        height: height * 0.55,
        resizeMode: 'cover',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10, // Add some margin to create space between the slider and the dots
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
});

export default Slideshow;

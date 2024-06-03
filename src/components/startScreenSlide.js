import React, { useRef, useState, useContext } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import communityImageLight from '../../assets/graphics/light-mode/community.png'; // Correct import path
import communityImageDark from '../../assets/graphics/dark-mode/community.png';
import circularLight from '../../assets/graphics/light-mode/graphics1.png'
import circularDark from '../../assets/graphics/dark-mode/graphics1.2.png'
import sloganLight from '../../assets/graphics/light-mode/graphics2.png'
import sloganDark from '../../assets/graphics/dark-mode/graphics2.2.png'
import ThemeContext from '../context/ThemeContext';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


const Slideshow = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const images = theme === 'dark'
        ? [communityImageDark, circularDark, sloganDark]
        : [communityImageLight, circularLight, sloganLight];


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
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            source={typeof image === 'string' ? { uri: image } : image}
                            style={styles.image}
                        />
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

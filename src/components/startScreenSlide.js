import React, { useRef, useState, useContext } from 'react';
import { View, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import communityImageLight from '../../assets/graphics/light-mode/community.png'; // Correct import path
import communityImageDark from '../../assets/graphics/dark-mode/community.png';
import circularLight from '../../assets/graphics/light-mode/graphics1.png';
import circularDark from '../../assets/graphics/dark-mode/graphics1.2.png';
import sloganLight from '../../assets/graphics/light-mode/graphics2.png';
import sloganDark from '../../assets/graphics/dark-mode/graphics2.2.png';
import ThemeContext from '../context/ThemeContext';
import PagerView from 'react-native-pager-view';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const Slideshow = () => {
    const { theme } = useContext(ThemeContext);

    const images = theme === 'dark'
        ? [communityImageDark, circularDark, sloganDark]
        : [communityImageLight, circularLight, sloganLight];

    const [activeIndex, setActiveIndex] = useState(0);

    const handlePageSelected = (event) => {
        setActiveIndex(event.nativeEvent.position);
    };

    const scrollToIndex = (index) => {
        setActiveIndex(index);
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <PagerView
                    style={styles.scrollViewContainer}
                    initialPage={0}
                    onPageSelected={handlePageSelected}
                >
                    {images.map((image, index) => (
                        <View style={styles.page} key={index}>
                            <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
                        </View>
                    ))}
                </PagerView>
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
        flex: 1,
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
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Slideshow;

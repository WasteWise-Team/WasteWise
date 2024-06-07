import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import HeaderLogo from '../components/headerLogo';
import ThemeContext from '../context/ThemeContext';


const recyclingData = [
    {
        symbol: 'https://www.recycling.com/wp-content/uploads/recycling%20symbols/black/Black%20Recycling%20Symbol%20%28U%2B267B%29.png',
        description: 'Recycle',
        products: ['Empty Plastic Water Bottles', 'Tin Soda Cans', 'Paper'],
    },         
    {
        symbol: 'https://static.vecteezy.com/system/resources/previews/006/844/970/original/container-for-battery-disposal-black-glyph-icon-recycling-and-reuse-electronic-waste-bin-lithium-accumulators-safe-storage-silhouette-symbol-on-white-space-isolated-illustration-vector.jpg', // Replace with actual URL
        description: 'E-Wastes',
        products: ['Laptops With LCD Monitors', 'LCD Plasma TV', 'OLED Tablets'],
    },
    {
        symbol: 'https://static.vecteezy.com/system/resources/previews/005/352/153/non_2x/food-misuse-black-glyph-icon-excessive-nutrition-and-addictive-overeating-poverty-and-hunger-issue-food-imbalance-in-world-silhouette-symbol-on-white-space-isolated-illustration-vector.jpg', // Replace with actual URL
        description: 'Food Wastes',
        products: ['Coffee Grounds', 'Egg Shells', 'Fruits'],
    },
    // Add more recycling symbols and their descriptions here
];

const RecyclingInfoPage = () => {

    const { theme } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
        },
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            fontFamily: 'Nunito-Regular',
            fontWeight: 'bold',
        },
        card: {
            backgroundColor: theme === 'dark' ? '#9FBCA5' : '#FFFFFF',
            borderRadius: 10,
            padding: 15,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
        },
        symbolImage: {
            width: 100,
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
        },
        description: {
            fontSize: 16,
            color: '#2D5A3D',
            marginVertical: 10,
            textAlign: 'center',
            fontFamily: 'Nunito-Regular',
        },
        productsTitle: {
            fontSize: 17,
            fontFamily: 'Nunito-Medium',
            marginTop: 10,
            color: '#2D5A3D',
        },
        productItem: {
            fontSize: 16,
            fontFamily: 'Nunito-Regular',
            color: '#2D5A3D',
            marginVertical: 2,
        },
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderLogo />
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Disposal Info</Text>
                {recyclingData.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Image source={{ uri: item.symbol }} style={styles.symbolImage} />
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.productsTitle}>Common Products:</Text>
                        {item.products.map((product, idx) => (
                            <Text key={idx} style={styles.productItem}>• {product}</Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};



export default RecyclingInfoPage;

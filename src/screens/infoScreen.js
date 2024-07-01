import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import HeaderLogo from '../components/headerLogo';
import ThemeContext from '../context/ThemeContext';
import Recycle from '../../assets/recycle.png';
import EWaste from '../../assets/e-waste.png';
import FoodWaste from '../../assets/food-waste.png';
import { collection, addDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig'; // Update this path to your actual Firebase config file

const recyclingData = [
    {
        image: Recycle,
        description: 'Recycle',
        products: ['Empty Plastic Water Bottles', 'Tin Soda Cans', 'Paper'],
    },         
    {
        image: EWaste,
        description: 'E-Wastes',
        products: ['Laptops With LCD Monitors', 'LCD Plasma TV', 'OLED Tablets'],
    },
    {
        image: FoodWaste,
        description: 'Food Wastes',
        products: ['Coffee Grounds', 'Egg Shells', 'Fruits'],
    },
    // Add more recycling symbols and their descriptions here
];

const RecyclingInfoPage = () => {
    const { theme } = useContext(ThemeContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [location, setLocation] = useState('');
    const [guidelines, setGuidelines] = useState('');

    const handleSave = async () => {
        try {
            console.log('Saving data to Firestore...');
            const docRef = await addDoc(collection(FIRESTORE_DB, 'disposalGuidelines'), {
                location,
                guidelines
            });
            console.log('Document written with ID: ', docRef.id);
            
            setModalVisible(false);
            setLocation('');
            setGuidelines('');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

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
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center', // Center the title container
            position: 'relative', // Needed for absolute positioning of the addButton
            marginBottom: 20, // Add margin to separate from content
            height: '4%',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            fontFamily: 'Nunito-Regular',
            fontWeight: 'bold',
            textAlign: 'center', // Ensure text is centered
            flex: 1, // Center the title text
        },
        addButtonContainer: {
            position: 'absolute',
            right: 20,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
        },
        addButtonText: {
            fontSize: 15,
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            fontFamily: 'Nunito-Bold',
            padding: 10,
        },
        card: {
            backgroundColor: theme === 'dark' ? '#9FBCA5' : '#f5fff0',
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
        modalView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            width: '80%',
            backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
            borderRadius: 10,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalTitle: {
            fontFamily: 'Nunito',
            fontSize: 18,
            marginBottom: 5,
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
        },
        modalSubtitle: {
            fontSize: 12,
            color: '#f57373',
            marginBottom: 15,
        },
        input: {
            height: 40,
            borderColor: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 15,
            paddingHorizontal: 10,
            color: theme === 'dark' ? '#C4D8BF' : '#2D5A3D',
        },
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderLogo />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Disposal Info</Text>
                <View style={styles.addButtonContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.container}>
                {recyclingData.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Image source={item.image} style={styles.symbolImage} />
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.productsTitle}>Common Products:</Text>
                        {item.products.map((product, idx) => (
                            <Text key={idx} style={styles.productItem}>• {product}</Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalView} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tell us the recycling guidelines of your city/trash center!</Text>
                        <Text style={styles.modalSubtitle}>Please be sure to mention the city.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Location of Interest"
                            placeholderTextColor={theme === 'dark' ? '#C4D8BF80' : '#2D5A3D80'}
                            value={location}
                            onChangeText={setLocation}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Disposal Guidelines"
                            placeholderTextColor={theme === 'dark' ? '#C4D8BF80' : '#2D5A3D80'}
                            value={guidelines}
                            onChangeText={setGuidelines}
                        />
                        <Button title="Save" onPress={handleSave} color={theme === 'dark' ? '#C4D8BF' : '#2D5A3D'} />
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default RecyclingInfoPage;

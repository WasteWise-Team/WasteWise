import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import ThemeContext from '../context/ThemeContext';

export default function BinModal({ visible, onClose, onNavigate }) {
    const { theme } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        modalContent: {
            width: '80%',
            backgroundColor: theme === 'dark' ? '#04222270' : '#C4D8BF',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            position: 'relative',
        },
        sectionContainer: {
            width: '100%',
            marginBottom: 15,
            alignItems: 'flex-start',
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
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalContent}>
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
                            <TouchableOpacity style={styles.button} onPress={onNavigate}>
                                <Text style={styles.buttonText}>Add My Bin</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

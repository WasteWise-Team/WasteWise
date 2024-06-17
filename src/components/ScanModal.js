import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import ThemeContext from '../context/ThemeContext';

export default function ScanModal({ visible, onClose, productInfo, isRecyclable, onNavigate }) {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: theme === 'dark' ? '#042222' : '#C4D8BF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      position: 'relative',
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
      <TouchableWithoutFeedback onPress={onNavigate}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.headerSection}>Product Information</Text>
              <Text style={styles.paragraph}>Product: {productInfo}</Text>
              <Text style={styles.paragraph}>Recyclable: {isRecyclable ? 'Yes' : 'No'}</Text>
              <TouchableOpacity style={styles.button} onPress={onNavigate}>
                <Text style={styles.buttonText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

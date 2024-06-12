import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import ThemeContext from '../../context/ThemeContext';

const CustomAlert = ({ visible, title, message, onClose, onConfirm }) => {
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
      backgroundColor: theme === 'dark' ? '#04222295' : '#C4D8BF',
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
                <Text style={styles.headerSection}>{title}</Text>
                <Text style={styles.paragraph}>{message}</Text>
              </View>
              <TouchableOpacity onPress={onConfirm || onClose} style={styles.button}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomAlert;

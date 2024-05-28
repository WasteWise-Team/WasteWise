import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function UploadScreen({ navigation }) {
    return (
        <View style={styles.container}>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
          <Text>Upload Screen</Text>
        </View>
    );
}

// Edit style stuff here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 26,
        fontWeight: 'bold',
    },
});

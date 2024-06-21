import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import OpenAI from 'openai';
import {OPENAI_API_KEY} from '@env';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export default function Identifier() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [response, setResponse] = useState('');

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({ base64: true });
        setPhotoUri(photo.uri);
        analyzeImage(photo.base64);
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const analyzeImage = async (base64) => {
    const params = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What’s in this image?" },
            {
              type: "image_url",
              image_url: {
                "url": `data:image/jpeg;base64,${base64}`,
                "detail": "low"
              },
            },
          ],
        },
      ],
    };

    try {
        const response = await openai.chat.completions.create(params);
        console.log('OpenAI API Response:', response.choices[0]); 
        setResponse(response.choices[0].message.content);
      } catch (error) {
        console.error('Failed to analyze image:', error);
        Alert.alert('Error', 'Failed to analyze image');
      }
  };

  let cameraRef;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={ref => {
          cameraRef = ref;
        }}
        facing={facing}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {photoUri && <Image source={{ uri: photoUri }} style={{ width: 300, height: 300, marginTop: 20 }} />}
      {response !== '' && <Text style={{ marginTop: 20, textAlign: 'center' }}>{response}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

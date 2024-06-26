import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Image, Alert, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, addDoc } from '../../firebaseConfig';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export default function Identifier({ navigation }) {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState(null);
    const [response, setResponse] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [materialType, setMaterialType] = useState('');
    const [disposal, setDisposal] = useState('');
    const [name, setName] = useState('');

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
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
                setLoading(true);
                analyzeImage(photo.base64);
            } catch (error) {
                console.error('Failed to take picture:', error);
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result)

            if (!result.cancelled) {
                setPhotoUri(result.assets[0].uri);
                //analyzeImage(result.assets[0].base64);
                setLoading(true); // Set loading to true when picking image


                if (result.assets[0].base64) {
                    analyzeImage(result.assets[0].base64);
                } else {
                    // If base64 data is not provided, load the image from URI and convert
                    const base64 = await getBase64FromUri(result.assets[0].uri);
                    analyzeImage(base64);
                }
            } else {
                setLoading(false); // Reset loading state if image selection is cancelled
            }
        } catch (error) {
            console.error('Failed to pick image:', error);
            Alert.alert('Error', 'Failed to pick image');
            setLoading(false); // Reset loading state on error
        }
    };


    const getBase64FromUri = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            return await blobToBase64(blob);
        } catch (error) {
            console.error('Failed to fetch image:', error);
            throw error;
        }
    };

    const blobToBase64 = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]); // Remove the data URL prefix
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const saveScannedItem = async (materialType, disposal, name) => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            try {
                await addDoc(collection(FIRESTORE_DB, 'scannedItems'), {
                    userId: user.uid,
                    materialType: materialType,
                    disposal: disposal,
                    name: name,
                    timestamp: new Date(),
                });
                console.log('Scanned item saved to Firestore');
            } catch (error) {
                console.error('Failed to save scanned item:', error);
            }
        }
    };


    const analyzeImage = async (base64) => {
        const prompt = "Provide valid JSON output. Given these categories: E-waste, Food, Chemicals, Textiles, Metal, Plastic, classify the object in the image. Provide one column name 'name' which is the name of the object. Provide one column name 'material_type' which is the type of material of the object. Provide another column name 'disposal' which is the instructions on how to properly dispose of the material. Make the instructions limited to 50 words."
        const params = {
            model: "gpt-4o",
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "system",
                    content: "You are a helpful recycling assistant designed to output JSON."
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
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

            const jsonResponse = JSON.parse(response.choices[0].message.content);
            const { material_type, disposal, name } = jsonResponse;

            setName(name);
            setMaterialType(material_type);
            setDisposal(disposal);
            saveScannedItem(material_type, disposal);
            setLoading(false);
            setModalVisible(true);
        } catch (error) {
            console.error('Failed to analyze image:', error);
            Alert.alert('Error', 'Failed to analyze image');
            setLoading(false);
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
                    <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
                        <MaterialIcons name="flip-camera-ios" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={takePicture}>
                        <Ionicons name="camera-outline" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
                        <Ionicons name="images-outline" size={35} color="white" />
                    </TouchableOpacity>
                </View>
            </CameraView>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Image source={{ uri: photoUri }} style={{ width: 300, height: 300 }} />
                        <Text style={{ marginTop: 20, textAlign: 'center' }}>Material Type: {materialType}</Text>
                        <Text style={{ marginTop: 20, textAlign: 'center' }}>Disposal: {disposal}</Text>
                        <TouchableOpacity
                            style={styles.navigateButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Map');
                            }}
                        >
                            <Text style={styles.buttonText}>Navigate</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
        paddingHorizontal: 50,
        paddingBottom: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    iconButton: {
        alignItems: 'center',
        flex: 1,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    navigateButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    permissionButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginTop: 20,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

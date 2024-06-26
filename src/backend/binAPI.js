import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';
import { Alert } from 'react-native';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const analyzeImage = async (base64) => {
  const prompt = "Classify the object in the image as 'bin' or 'not bin'. Return 'true' if the object is a bin and 'false' otherwise.";

  const params = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to classify images.",
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
    const result = response.choices[0].message.content.trim().toLowerCase();

    console.log('OpenAI API Response:', result);

    if (result === 'true') {
      return true;
    } else if (result === 'false') {
      return false;
    } else {
      console.error('Unexpected response:', result);
      Alert.alert('Error', 'Unexpected response from the image analysis');
      return false;
    }
    } catch (error) {
        console.error('Failed to analyze image:', error);
        Alert.alert('Error', 'Failed to analyze image');
        return false;
    }
};

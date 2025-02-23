import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { APP_GEMINI_API_KEY } from '@env';
import Markdown from 'react-native-markdown-display';
import { Plus, X } from 'lucide-react-native';

const genAI = new GoogleGenerativeAI(APP_GEMINI_API_KEY);
const SYSTEM_PROMPT = `You are a medical assistant AI. Consider the user's health profile while providing advice:

1. Provide information about possible conditions based on symptoms, considering the user's health metrics.
2. Offer general medical information and advice considering the user's health metrics if applicable.
3. Suggest specific home remedies suitable for their body type and condition.
4. Discuss medications, their uses, and effects when asked, noting any specific considerations based on their health profile.

Keep responses:
- Direct and clear
- Using clinical terms for sensitive topics
- Educational without making diagnoses
- Professional but easy to understand
- Considerate of the user's specific health metrics
- If you can't provide a response, let the user know.

Format your responses using markdown for better readability:
- Use bullet points for lists
- Use headers for sections
- Use bold for important terms
- Use code blocks for medical terms definitions

Always remind the user to consult a doctor for a professional diagnosis.`;

const MessageList = ({ messages, isLoading, isDark }) => {
  const markdownStyles = {
    body: {
      color: isDark ? '#f7f9eb' : '#1e1c16',
    },
    heading1: {
      color: isDark ? '#ff8f00' : '#ff9800',
      fontSize: 24,
      marginTop: 8,
      marginBottom: 8,
    },
    heading2: {
      color: isDark ? '#ff8f00' : '#ff9800',
      fontSize: 20,
      marginTop: 8,
      marginBottom: 8,
    },
    paragraph: {
      marginBottom: 8,
      lineHeight: 22,
    },
    list_item: {
      marginBottom: 4,
    },
    bullet_list: {
      marginBottom: 8,
    },
    code_block: {
      backgroundColor: isDark ? '#30241a' : '#f7f7eb',
      padding: 8,
      borderRadius: 4,
      marginVertical: 4,
    },
    code_inline: {
      backgroundColor: isDark ? '#30241a' : '#f7f7eb',
      padding: 4,
      borderRadius: 2,
    },
    link: {
      color: isDark ? '#ff8f00' : '#ff9800',
    },
    blockquote: {
      borderLeftColor: isDark ? '#ff8f00' : '#ff9800',
      borderLeftWidth: 4,
      paddingLeft: 8,
      marginLeft: 0,
      marginVertical: 8,
    },
  };

  return (
    <View className="flex-1">
      {messages.map((message, index) => (
        <View 
          key={index} 
          className={`p-3 m-2 rounded-lg ${
            message.role === 'user' 
              ? `${isDark ? 'bg-dark-primary' : 'bg-light-primary'} self-end` 
              : `${isDark ? 'bg-dark-secondary' : 'bg-light-secondary'} self-start`
          }`}
        >
          {message.role === 'user' ? (
            <Text className={
              message.role === 'user'
                ? `${isDark ? 'text-dark-primaryText' : 'text-light-primaryText'}`
                : `${isDark ? 'text-dark-secondaryText' : 'text-light-secondaryText'}`
            }>
              {message.content}
            </Text>
          ) : (
            <Markdown
              style={markdownStyles}
              mergeStyle={true}
            >
              {message.content}
            </Markdown>
          )}
        </View>
      ))}
      {isLoading && (
        <View className={`p-3 m-2 rounded-lg ${isDark ? 'bg-dark-secondary' : 'bg-light-secondary'} self-start`}>
          <Text className={isDark ? 'text-dark-secondaryText' : 'text-light-secondaryText'}>
            Thinking...
          </Text>
        </View>
      )}
    </View>
  );
};

const SymptomTag = ({ symptom, onRemove, isDark }) => (
  <View className={`flex-row items-center rounded-full px-3 py-1 mr-2 mb-2 ${
    isDark ? 'bg-dark-secondary' : 'bg-light-secondary'
  }`}>
    <Text className={`mr-2 ${
      isDark ? 'text-dark-secondaryText' : 'text-light-secondaryText'
    }`}>
      {symptom.text}
    </Text>
    <TouchableOpacity onPress={() => onRemove(symptom.id)}>
      <X size={16} color={isDark ? '#f7f9eb' : '#1e1c16'} />
    </TouchableOpacity>
  </View>
);


const MedicalChatbot = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [messages, setMessages] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const addSymptom = () => {
    if (currentSymptom.trim()) {
      setSymptoms(prev => [...prev, { id: Date.now(), text: currentSymptom.trim() }]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (id) => {
    setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
  };

  const sendMessage = async () => {
    const symptomsText = symptoms.length > 0 ? `Symptoms: ${symptoms.map(s => s.text).join(', ')}. ` : '';
    const fullMessage = `${symptomsText}${additionalMessage}`.trim();
    if (!fullMessage) return;

    setMessages(prev => [...prev, { role: 'user', content: fullMessage }]);
    setSymptoms([]);
    setAdditionalMessage('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${fullMessage}`);
      const response = result.response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-dark-bg' : 'bg-light-bg'} p-4`}>
      <Text className={`text-center text-2xl font-bold ${isDark ? 'text-dark-primary' : 'text-light-primary'}`}>
        Umeed
      </Text>
      
      <ScrollView 
        ref={scrollViewRef} 
        className="flex-1 mt-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <Text className={`text-center ${isDark ? 'text-dark-mutedText' : 'text-light-mutedText'}`}>
            Start by entering your symptoms or questions.
          </Text>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} isDark={isDark} />
        )}
      </ScrollView>

      <View className="mt-4 space-y-2">
        {symptoms.length > 0 && (
          <View className="flex-row flex-wrap mb-2">
            {symptoms.map(symptom => (
              <SymptomTag
                key={symptom.id}
                symptom={symptom}
                onRemove={removeSymptom}
                isDark={isDark}
              />
            ))}
          </View>
        )}

        <View className="flex-row items-center space-x-2">
          <TextInput 
            className={`flex-1 p-3 rounded-lg ${
              isDark ? 'bg-dark-input text-dark-text' : 'bg-light-input text-light-text'
            } border ${
              isDark ? 'border-dark-border' : 'border-light-border'
            }`}
            placeholder="Add a symptom..."
            placeholderTextColor={isDark ? '#9f8b76' : '#716f65'}
            value={currentSymptom}
            onChangeText={setCurrentSymptom}
            onSubmitEditing={addSymptom}
          />
          
          <TouchableOpacity 
            className={`p-3 rounded-lg ${
              isDark ? 'bg-dark-primary' : 'bg-light-primary'
            } items-center justify-center`}
            onPress={addSymptom}
          >
            <Plus size={24} color={isDark ? '#f7f9eb' : '#ffffff'} />
          </TouchableOpacity>
        </View>

        <TextInput 
          className={`p-3 rounded-lg ${
            isDark ? 'bg-dark-input text-dark-text' : 'bg-light-input text-light-text'
          } border ${
            isDark ? 'border-dark-border' : 'border-light-border'
          }`}
          placeholder="Additional message..."
          placeholderTextColor={isDark ? '#9f8b76' : '#716f65'}
          value={additionalMessage}
          onChangeText={setAdditionalMessage}
          multiline
        />

        <TouchableOpacity 
          className={`p-3 rounded-lg ${
            isDark ? 'bg-dark-primary' : 'bg-light-primary'
          } ${isLoading ? 'opacity-50' : 'opacity-100'}`}
          onPress={sendMessage}
          disabled={isLoading}
        >
          <Text className={`text-center ${
            isDark ? 'text-dark-primaryText' : 'text-light-primaryText'
          }`}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MedicalChatbot;
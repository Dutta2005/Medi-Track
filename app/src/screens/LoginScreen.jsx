import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import AuthController from '../controllers/AuthController';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useAuth();

    const handleLogin = async () => {
        const response = await AuthController.login(email, password);
        if (response.success) {
            const userResponse = await AuthController.getCurrentUser();
            if (userResponse.success) {
                setUser(userResponse.data);
            }
        } else {
            Alert.alert('Error', response.error);
        }
    };

    return (
        <View className="flex-1 justify-center p-4">
            <TextInput
                className="border p-2 rounded mb-4"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                className="border p-2 rounded mb-4"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity 
                className="bg-blue-500 p-3 rounded"
                onPress={handleLogin}
            >
                <Text className="text-white text-center">Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
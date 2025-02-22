import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AuthController from '../controllers/AuthController';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuth();
    const navigation = useNavigation()

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await AuthController.login(email, password);
            if (response.success) {
                const userResponse = await AuthController.getCurrentUser();
                if (userResponse.success) {
                    setUser(userResponse.data);
                    navigation.replace('dashboard');
                }
            } else {
                Alert.alert('Error', response.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-dark-bg"
        >
            <View className="flex-1 justify-center px-6">
                {/* Header Section */}
                <View className="mb-8">
                    <Text className="text-dark-text text-3xl font-bold mb-2">Welcome Back</Text>
                    <Text className="text-dark-mutedText text-base">
                        Sign in to continue to your account
                    </Text>
                </View>

                {/* Form Section */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-dark-text text-sm mb-2 font-medium">
                            Email Address
                        </Text>
                        <TextInput
                            className="bg-dark-input border border-dark-border text-dark-text px-4 py-3 rounded-lg"
                            placeholder="Enter your email"
                            placeholderTextColor="#9f8b76"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <View>
                        <Text className="text-dark-text text-sm mb-2 font-medium">
                            Password
                        </Text>
                        <TextInput
                            className="bg-dark-input border border-dark-border text-dark-text px-4 py-3 rounded-lg"
                            placeholder="Enter your password"
                            placeholderTextColor="#9f8b76"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity 
                        className="self-end"
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text className="text-dark-primary text-sm">
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity 
                        className={`bg-dark-primary p-4 rounded-lg mt-6 ${isLoading ? 'opacity-70' : ''}`}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#f7f9eb" />
                        ) : (
                            <Text className="text-dark-primaryText text-center font-semibold text-lg">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center mt-6">
                        <Text className="text-dark-mutedText">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                            <Text className="text-dark-primary font-medium">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
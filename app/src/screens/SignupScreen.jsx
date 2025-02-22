import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import AuthController from "../controllers/AuthController";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useAuth();
  const navigation = useNavigation();

  const handleSignup = async () => {
    // Basic validation
    if (!email || !password || !name || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const response = await AuthController.register(email, password, name);
    if (response.success) {
      const loginResponse = await AuthController.login(email, password);
      if (loginResponse.success) {
        const userResponse = await AuthController.getCurrentUser();
        if (userResponse.success) {
          setUser(userResponse.data);
          navigation.navigate("dashboard");
        }
      }
    } else {
      Alert.alert("Error", response.error);
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-dark-bg">
      <Text className="text-2xl font-bold mb-4 text-dark-text">
        Create Account
      </Text>

      <TextInput
        className="border border-dark-border bg-dark-input text-dark-text p-2 rounded mb-4"
        placeholder="Full Name"
        placeholderTextColor="#9f8b76"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        className="border border-dark-border bg-dark-input text-dark-text p-2 rounded mb-4"
        placeholder="Email"
        placeholderTextColor="#9f8b76"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="border border-dark-border bg-dark-input text-dark-text p-2 rounded mb-4"
        placeholder="Password"
        placeholderTextColor="#9f8b76"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="border border-dark-border bg-dark-input text-dark-text p-2 rounded mb-4"
        placeholder="Confirm Password"
        placeholderTextColor="#9f8b76"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-dark-primary p-3 rounded mb-4"
        onPress={handleSignup}
      >
        <Text className="text-dark-primaryText text-center font-semibold">
          Sign Up
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-dark-mutedText">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("login")}>
          <Text className="text-dark-primary font-medium">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;

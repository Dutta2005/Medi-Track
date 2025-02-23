import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import AuthController from "../controllers/AuthController";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Theme configuration based on the tailwind config
const themeConfig = {
  light: {
    bg: "#ffffff",
    text: "#1e1c16",
    primary: "#ff9800",
    primaryText: "#f7f9eb",
    secondary: "#f7f7eb",
    secondaryText: "#3d2b13",
    muted: "#f7f7eb",
    mutedText: "#716f65",
    border: "#e5e5e5",
    input: "#e5e5e5",
  },
  dark: {
    bg: "#1e1c16",
    text: "#f7f9eb",
    primary: "#ff8f00",
    primaryText: "#f7f9eb",
    secondary: "#30241a",
    secondaryText: "#f7f9eb",
    muted: "#30241a",
    mutedText: "#9f8b76",
    border: "#30241a",
    input: "#30241a",
  }
};

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { setUser } = useAuth();
  const navigation = useNavigation();
  
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  // Use the appropriate theme colors based on color scheme
  const colors = themeConfig[systemColorScheme === 'dark' ? 'dark' : 'light'];

  const handleSignup = async () => {
    if (!email || !password || !name || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthController.register(email, password, name);
      if (response?.success) {
        const loginResponse = await AuthController.login(email, password);
        if (loginResponse?.success) {
          const userResponse = await AuthController.getCurrentUser();
          if (userResponse?.success) {
            setUser(userResponse.data);
            navigation.navigate("dashboard");
          }
        }
      } else {
        Alert.alert("Error", response?.error || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    background: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    header: {
      marginBottom: 32,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.mutedText,
    },
    form: {
      width: "100%",
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 48,
      color: colors.text,
    },
    signupButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
    },
    signupButtonDisabled: {
      opacity: 0.7,
    },
    signupButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primaryText,
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
    },
    loginText: {
      fontSize: 14,
      color: colors.mutedText,
    },
    loginLink: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={systemColorScheme === 'dark' 
          ? [colors.bg, colors.secondary] 
          : [colors.bg, colors.secondary]}
        style={styles.background}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Sign up to get started</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={colors.mutedText} 
                  style={styles.icon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.mutedText}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={colors.mutedText} 
                  style={styles.icon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.mutedText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={colors.mutedText} 
                  style={styles.icon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.mutedText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={toggleShowPassword}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.mutedText}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={colors.mutedText} 
                  style={styles.icon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.mutedText}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={toggleShowConfirmPassword}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.mutedText}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.primaryText} />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("login")}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

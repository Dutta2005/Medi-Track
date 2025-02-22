import React from "react";
import { Button, View, Text, Alert } from "react-native";
import AuthController from "../controllers/AuthController";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const navigation = useNavigation();
  const { setUser, user } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await AuthController.logout();
      
      if (response.success) {
        setUser(null);
        navigation.reset({
          index: 0,
          routes: [{ name: 'login' }]
        });
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={{ height: 60 }} className="flex-row justify-between items-center px-4 bg-dark-bg">
      <Text className="text-dark-text text-lg font-bold">MediTrack</Text>
      { user && (
        <Button 
        title="Logout" 
        onPress={handleLogout} 
        color="#ff8f00"
      />
      )}
    </View>
  );
}

export default Navbar;
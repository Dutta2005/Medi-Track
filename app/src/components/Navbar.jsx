import React from "react";
import { Button } from "react-native";
import { View, Text } from "react-native";
import AuthController from "../controllers/AuthController";
import { useNavigation } from "@react-navigation/native";

function Navbar() {
  const navigation = useNavigation();
  const handleLogout = () => {
    try {
      const response = AuthController.logout();
      if (response.success) {
        console.log("Logout successful");
        
        navigation.navigate("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View classname="h-7">
      <Text>MediTrack</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

export default Navbar;

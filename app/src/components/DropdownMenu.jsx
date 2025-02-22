// DropdownMenu.js
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { User, Settings, LogOut, Bell } from "lucide-react-native";
import AuthController from "../controllers/AuthController";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

function DropdownMenu({ onClose }) {
  const navigation = useNavigation();
  const { setUser, user } = useAuth();

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      onPress: () => {
        navigation.navigate("Profile");
        onClose();
      },
    },
    {
      icon: Bell,
      label: "Notifications",
      onPress: () => {
        navigation.navigate("Notifications");
        onClose();
      },
    },
    {
      icon: Settings,
      label: "Settings",
      onPress: () => {
        navigation.navigate("Settings");
        onClose();
      },
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await AuthController.logout();

      if (response.success) {
        setUser(null);
      } else {
        Alert.alert("Error", response.error);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <View className="absolute right-0 top-12 w-56 bg-dark-card rounded-lg shadow-lg border border-dark-border overflow-hidden">
      {/* User Info Section */}
      {user && (
        <View className="p-4 border-b border-dark-border">
          <Text className="text-dark-text font-semibold">{user.name || "User Name"}</Text>
          <Text className="text-dark-mutedText text-sm">{user.email || "user@example.com"}</Text>
        </View>
      )}

      {/* Menu Items */}
      <View className="py-1">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center px-4 py-3 active:bg-dark-secondary"
            onPress={item.onPress}
          >
            <item.icon size={20} color="#f7f9eb" />
            <Text className="text-dark-text ml-3">{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Logout Section */}
        {user && (
          <>
            <View className="h-px bg-dark-border mx-2 my-1" />
            <TouchableOpacity
              className="flex-row items-center px-4 py-3 active:bg-dark-secondary"
              onPress={handleLogout}
            >
              <LogOut size={20} color="#d32f2f" />
              <Text className="text-destructive ml-3">Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export default DropdownMenu;
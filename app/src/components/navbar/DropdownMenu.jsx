// DropdownMenu.js
import React from "react";
import { View, Text, TouchableOpacity, Alert, Modal } from "react-native";
import { User, Settings, LogOut, Bell } from "lucide-react-native";
import AuthController from "../../controllers/AuthController";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import Alerts from "../Alerts";

function DropdownMenu({ onClose }) {
  const navigation = useNavigation();
  const { setUser, user } = useAuth();
  const [show, setShow] = React.useState(false);

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
        // navigation.navigate("Notifications");
        setShow(true);
        // onClose();
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
    <>
    <Modal
    visible={show}
    animationType="slide"
    onRequestClose={() => setShow(false)}
  >
    <View className="flex-1">
      <View className="bg-[#1e1c16] py-4 px-4 flex-row justify-between items-center">
        <Text className="text-[#f7f9eb] text-xl">Notifications</Text>
        <TouchableOpacity onPress={() => setShow(false)}>
          <Text className="text-[#ff8f00]">Close</Text>
        </TouchableOpacity>
      </View>
      <Alerts />
    </View>
  </Modal>

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
    </>
  );
}

export default DropdownMenu;
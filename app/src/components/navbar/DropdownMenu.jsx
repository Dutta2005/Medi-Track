import React from "react";
import { View, Text, TouchableOpacity, Alert, Animated } from "react-native";
import { User, Bell, Settings, LogOut, ChevronRight, Stethoscope, MapPin } from "lucide-react-native";
import AuthController from "../../controllers/AuthController";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
// import Alerts from "../Alerts";

function DropdownMenu({ onClose }) {
  const navigation = useNavigation();
  const { setUser, user } = useAuth();
  // const [show, setShow] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const menuItems = [
    {
      icon: User,
      label: "Dashboard",
      onPress: () => {
        navigation.navigate("dashboard");
        onClose();
      },
      color: "#4CAF50",
    },
    {
      icon: Bell,
      label: "Notifications",
      onPress: () => {
        navigation.navigate("Alerts");
      },
      color: "#2196F3",
    },
    {
      icon: Stethoscope,
      label: "Umeed",
      onPress: () => {
        navigation.navigate("Chatbot")
      },
      color: "#4CAF50",
    },
    {
      icon: MapPin,
      label:"Nearby Pharmacies",
      onPress: () => {
        navigation.navigate("dashboard");
      },
      color: "#D32F2F",
    },
    {
      icon: Settings,
      label: "Settings",
      onPress: () => {
        navigation.navigate("settings");
        onClose();
      },
      color: "#9C27B0",
    },
  ];

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              const response = await AuthController.logout();
              if (response.success) {
                setUser(null);
              } else {
                Alert.alert("Error", response.error);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <Animated.View
        className="absolute right-4 top-20 bg-light-muted dark:bg-dark-muted rounded-2xl shadow-xl w-72 overflow-hidden"
        style={{
          transform: [
            {
              scale: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
          opacity: slideAnim,
        }}
      >
        {user && (
          <View className="p-6 border-b border-light-ring dark:border-dark-ring">
            <View className="w-12 h-12 bg-light-primary dark:bg-dark-primary rounded-full mb-3 items-center justify-center">
              <Text className="text-light-text dark:text-dark-text text-xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text className="text-light-text dark:text-dark-text text-lg font-semibold">{user.name || "User Name"}</Text>
            <Text className="text-light-text dark:text-dark-text text-sm">{user.email || "user@example.com"}</Text>
          </View>
        )}

        <View className="py-2">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center px-4 py-3.5 active:bg-light-bg dark:active:bg-dark-bg"
              onPress={item.onPress}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon size={20} color={item.color} />
              </View>
              <Text className="text-light-text dark:text-dark-text text-base ml-3 flex-1">{item.label}</Text>
              <ChevronRight size={20} color="#ffffff40" className="ml-2" />
            </TouchableOpacity>
          ))}

          {user && (
            <>
              <View className="h-px mx-4 my-2" />
              <TouchableOpacity
                className="flex-row items-center px-4 py-3.5 active:bg-light-bg dark:active:bg-dark-bg"
                onPress={handleLogout}
              >
                <View className="w-8 h-8 rounded-full items-center justify-center">
                  <LogOut size={20} color="#dc3545" />
                </View>
                <Text className="text-[#dc3545] text-base ml-3">Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </>
  );
}

export default DropdownMenu;
import { Moon, Sun } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

function ThemeToggler() {
  const { theme, toggleTheme } = useAuth();
  return (
    <TouchableOpacity onPress={toggleTheme}>
      {theme === "dark" ? (
        <Moon color="#f7f9eb" size={24} />
      ) : (
        <Sun color="#f7f9eb" size={24} />
      )}
    </TouchableOpacity>
  );
}

export default ThemeToggler;

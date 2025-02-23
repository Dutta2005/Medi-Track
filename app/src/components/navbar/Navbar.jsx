import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Menu } from "lucide-react-native";
import DropdownMenu from "./DropdownMenu";
import ThemeToggler from "./ThemeToggler";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ zIndex: 50 }}>
      <View
        style={{ height: 60 }}
        className="flex-row justify-between items-center px-4 bg-dark-bg border-b border-dark-border"
      >
        <Text className="text-dark-text text-xl font-bold">MediTrack</Text>

        <ThemeToggler />

        <TouchableOpacity
          className="p-2 rounded-full active:bg-dark-secondary"
          onPress={() => setOpen(!open)}
        >
          <Menu color="#f7f9eb" size={24} />
        </TouchableOpacity>
      </View>

      {open && (
        <>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 60,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              height: Dimensions.get('window').height - 60,
            }}
            onPress={() => setOpen(false)}
          />
          <DropdownMenu onClose={() => setOpen(false)} />
        </>
      )}
    </View>
  );
}

export default Navbar;
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Menu } from "lucide-react-native";
import DropdownMenu from "./DropdownMenu";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <View
        style={{ height: 60 }}
        className="flex-row justify-between items-center px-4 bg-dark-bg border-b border-dark-border relative z-50"
      >
        <Text className="text-dark-text text-xl font-bold">MediTrack</Text>

        <View>
          <TouchableOpacity
            className="p-2 rounded-full active:bg-dark-secondary"
            onPress={() => setOpen(!open)}
          >
            <Menu color="#f7f9eb" size={24} />
          </TouchableOpacity>
          {open && (
            <>
              <DropdownMenu onClose={() => setOpen(false)} />
              <TouchableOpacity
                className="absolute -left-4 top-12 w-screen h-screen bg-black/20"
                onPress={() => setOpen(false)}
              />
            </>
          )}
        </View>
      </View>
    </>
  );
}

export default Navbar;
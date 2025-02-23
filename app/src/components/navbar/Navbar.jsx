import React, { useState } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Menu } from "lucide-react-native";
import DropdownMenu from "./DropdownMenu";
import ThemeToggler from "./ThemeToggler";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, user } = useAuth();
  
  // Define text and background colors based on theme
  const textColor = theme === 'dark' ? '#f7f9eb' : '#1e1c16';
  const bgColor = theme === 'dark' ? '#1e1c16' : '#f7f9eb';
  const activeColor = theme === 'dark' ? 'rgba(247, 249, 235, 0.1)' : 'rgba(30, 28, 22, 0.1)';
 
  return (
    <View style={{ 
      zIndex: 50,
      width: '100%',
      position: 'relative',
      top: 0,
    }}>
      <View
        style={{ 
          height: 60,
          backgroundColor: bgColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          width: '100%',
        }}
      >
        <Image
          source={require('../../../assets/Logo2.png')}
          style={{
            width: 145,
            height: 139,
            resizeMode: 'contain'
          }}
        />

        <View style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          gap: 0
        }}>
          <ThemeToggler />

          {user && (
            <TouchableOpacity
              style={{
                padding: 6,
                borderRadius: 9999,
                backgroundColor: open ? activeColor : 'transparent'
              }}
              onPress={() => setOpen(!open)}
            >
              <Menu color={textColor} size={30} />
            </TouchableOpacity>
          )}
        </View>
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
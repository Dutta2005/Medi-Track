import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { AuthProvider } from './app/src/contexts/AuthContext';
import LoginScreen from './app/src/screens/LoginScreen';
import DemoScreen from './app/src/screens/DemoScreen';
import "./global.css";
import SignupScreen from './app/src/screens/SignupScreen';
import DashBoard from './app/src/screens/DashBoard';
import Navbar from './app/src/components/Navbar';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      <Stack.Screen name="dashboard" component={DashBoard} />
      <Stack.Screen name="demo" component={DemoScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Navbar />
          <Navigation />
        </SafeAreaView>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});

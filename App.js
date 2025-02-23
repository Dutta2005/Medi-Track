import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/src/contexts/AuthContext';
import LoginScreen from './app/src/screens/LoginScreen';
import "./global.css";
import SignupScreen from './app/src/screens/SignupScreen';
import DashBoardScreen from './app/src/screens/DashBoardScreen';
import { useAuth } from './app/src/contexts/AuthContext';
import HomeScreen from './app/src/screens/HomeScreen';
import CreateProductForm from './app/src/screens/CreateProductForm';
import Navbar from './app/src/components/navbar/Navbar';
import Loading from './app/src/components/Loading';
import ReminderController from './app/src/controllers/ReminderController';
import { useEffect } from 'react';
import { NotificationHandler } from './app/src/components/NotificationHandler';
import ProductDetailsScreen from './app/src/screens/ProductDetailsScreen';
const Stack = createNativeStackNavigator();


function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" component={DashBoardScreen} />
      <Stack.Screen name="CreateProduct" component={CreateProductForm} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}

// Separate stack for non-authenticated users
function NonAuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// Navigation wrapper that handles auth state
function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loading
        fullScreen={true}
      />
    );
  }

  return user ? <AuthenticatedStack /> : <NonAuthenticatedStack />;
}

export default function App() {
  useEffect(() => {
    async function initializeNotifications() {
      await ReminderController.initializeNotifications();
    }
    initializeNotifications();
  }, []);

  return (
    <NotificationHandler>
      <AuthProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Navbar />
          <Navigation />
        </SafeAreaView>
      </NavigationContainer>
    </AuthProvider>
    </NotificationHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});

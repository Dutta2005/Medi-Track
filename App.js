import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/src/contexts/AuthContext';
import LoginScreen from './app/src/screens/LoginScreen';
import SignupScreen from './app/src/screens/SignupScreen';
import DashBoardScreen from './app/src/screens/DashBoardScreen';
import { useAuth } from './app/src/contexts/AuthContext';
import HomeScreen from './app/src/screens/HomeScreen';
import CreateProductForm from './app/src/screens/CreateProductForm';
import Navbar from './app/src/components/navbar/Navbar';
import Loading from './app/src/components/Loading';
import ReminderController from './app/src/controllers/ReminderController';
import { useEffect } from 'react';
import { NotificationHandler, usePushNotifications } from './app/src/components/NotificationHandler';
import ProductDetailsScreen from './app/src/screens/ProductDetailsScreen';
import './global.css';
import * as Notifications from 'expo-notifications';

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

function NonAuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user, loading } = useAuth();
  const { notification } = usePushNotifications();

  useEffect(() => {
    if (notification) {
      // Handle notification while app is in foreground
      console.log('Received notification:', notification);
      // Add your notification handling logic here
    }
  }, [notification]);

  if (loading) {
    return <Loading fullScreen={true} />;
  }

  return user ? <AuthenticatedStack /> : <NonAuthenticatedStack />;
}

function AppContent() {
  useEffect(() => {
    async function initializeNotifications() {
      try {
        await ReminderController.initializeNotifications();
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    }
    initializeNotifications();
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Navbar />
        <Navigation />
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationHandler>
        <AppContent />
      </NotificationHandler>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff'
  },
});
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { AuthProvider } from './app/src/contexts/AuthContext';
import LoginScreen from './app/src/screens/LoginScreen';
import DemoScreen from './app/src/screens/DemoScreen';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Demo" component={DemoScreen} />
    </Stack.Navigator>
  );
}

function NavigateButton() {
  const navigation = useNavigation();
  
  return (
  <View style={{margin: 20}}>
    <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
    <Button title="Go to Demo" onPress={() => navigation.navigate("Demo")} />
  </View>
);
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <NavigateButton />
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

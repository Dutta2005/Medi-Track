import { useState, useEffect, useRef, createContext, useContext } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import ReminderController from '../controllers/ReminderController';

// Create context
const NotificationContext = createContext();

export const NotificationHandler = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState();
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  // Set default notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get push token
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });

      // Set up Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF8F00',
        });
      }

      return token;
    } else {
      console.log('Must use physical device for Push Notifications');
    }
  };

  const setupNotificationListeners = () => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        setNotification(notification);
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification response:', response);
      }
    );
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    });
    
    setupNotificationListeners();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to access notification context
export const usePushNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotifications must be used within a NotificationHandler');
  }
  return context;
};

// Notification trigger helpers
export const scheduleNotifications = async (product) => {
  try {
    // Schedule low stock notifications
    if (product.quantity && product.reorderPoint) {
      await ReminderController.checkLowStock(product.$id);
    }

    // Schedule expiry notifications
    if (product.expiryDate) {
      await ReminderController.checkExpiry(product.$id);
    }

    // Schedule dosage reminders
    if (product.scheduleType && product.scheduleType !== '') {
      await ReminderController.scheduleDosageReminders(product.$id);
    }

    return true;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return false;
  }
};
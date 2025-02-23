import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import ReminderController from '../controllers/ReminderController';

export const NotificationHandler = ({ children }) => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();
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

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF8F00',
      });
    }

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
  };

  const setupNotificationListeners = () => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        // Handle received notification
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        // Handle notification response (when user taps notification)
        console.log('Notification response:', response);
      }
    );
  };

  return children;
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
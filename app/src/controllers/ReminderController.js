// ReminderController.js
import { databases } from "../config/appwrite";
import { ID, Query } from "appwrite";
import conf from "../../appwrite/conf";
import * as Notifications from 'expo-notifications';

class ReminderController {
    // Initialize notifications
    async initializeNotifications() {
        await Notifications.requestPermissionsAsync();
        
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
    }

    // Check for low stock
    async checkLowStock(productId) {
        try {
            const response = await databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                productId
            );

            if (response.quantity <= response.reorderPoint) {
                await this.sendNotification(
                    "Low Stock Alert",
                    `${response.name} is running low on stock. Current quantity: ${response.quantity}`
                );
                
                // Create alert record
                await databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteReminderCollectionId,
                    ID.unique(),
                    {
                        type: 'lowStock',
                        productId: productId,
                        message: `Low stock alert for ${response.name}`,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                    }
                );
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Check for expiry
    async checkExpiry(productId) {
        try {
            const response = await databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                productId
            );

            const expiryDate = new Date(response.expiryDate);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntilExpiry <= 30) {
                await this.sendNotification(
                    "Expiry Alert",
                    `${response.name} will expire in ${daysUntilExpiry} days`
                );

                await databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteReminderCollectionId,
                    ID.unique(),
                    {
                        type: 'expiry',
                        productId: productId,
                        message: `Expiry alert for ${response.name}`,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                    }
                );
            }
            return { success: true, data: daysUntilExpiry };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Schedule dosage reminders
    // async scheduleDosageReminders(productId) {
    //     try {
    //         const response = await databases.getDocument(
    //             conf.appwriteDatabaseId,
    //             conf.appwriteProductCollectionId,
    //             productId
    //         );

    //         const scheduleType = response.scheduleType;
    //         let reminders = [];

    //         switch (scheduleType) {
    //             case 'daily':
    //                 reminders = JSON.parse(response.dailyDosages);
    //                 for (let time of reminders) {
    //                     await this.scheduleRecurringNotification(
    //                         "Medication Reminder",
    //                         `Time to take ${response.name}`,
    //                         time,
    //                         'daily'
    //                     );
    //                 }
    //                 break;

    //             case 'weekly':
    //                 reminders = JSON.parse(response.weeklyDosages);
    //                 for (let schedule of reminders) {
    //                     await this.scheduleRecurringNotification(
    //                         "Medication Reminder",
    //                         `Time to take ${response.name}`,
    //                         schedule,
    //                         'weekly'
    //                     );
    //                 }
    //                 break;

    //             case 'custom':
    //                 reminders = JSON.parse(response.customSchedule);
    //                 for (let datetime of reminders) {
    //                     await this.scheduleOneTimeNotification(
    //                         "Medication Reminder",
    //                         `Time to take ${response.name}`,
    //                         new Date(datetime)
    //                     );
    //                 }
    //                 break;
    //         }

    //         return { success: true };
    //     } catch (error) {
    //         return { success: false, error: error.message };
    //     }
    // }

    async scheduleDosageReminders(productId) {
        try {
            const response = await databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                productId
            );
    
            const scheduleType = response.scheduleType;
            let reminders = [];
    
            switch (scheduleType) {
                case 'daily':
                    // Check if it's a string before parsing
                    reminders = typeof response.dailyDosages === 'string' 
                        ? JSON.parse(response.dailyDosages) 
                        : response.dailyDosages;
                    
                    for (let time of reminders) {
                        await this.scheduleRecurringNotification(
                            "Medication Reminder",
                            `Time to take ${response.name}`,
                            time,
                            'daily'
                        );
                    }
                    break;
    
                case 'weekly':
                    // Check if it's a string before parsing
                    reminders = typeof response.weeklyDosages === 'string'
                        ? JSON.parse(response.weeklyDosages)
                        : response.weeklyDosages;
                    
                    for (let schedule of reminders) {
                        await this.scheduleRecurringNotification(
                            "Medication Reminder",
                            `Time to take ${response.name}`,
                            schedule,
                            'weekly'
                        );
                    }
                    break;
    
                case 'custom':
                    // Check if it's a string before parsing
                    reminders = typeof response.customSchedule === 'string'
                        ? JSON.parse(response.customSchedule)
                        : response.customSchedule;
                    
                    for (let datetime of reminders) {
                        await this.scheduleOneTimeNotification(
                            "Medication Reminder",
                            `Time to take ${response.name}`,
                            new Date(datetime)
                        );
                    }
                    break;
            }
    
            return { success: true };
        } catch (error) {
            console.error('Error in scheduleDosageReminders:', error);
            return { success: false, error: error.message };
        }
    }

    // Send immediate notification
    async sendNotification(title, body) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
            },
            trigger: null, // Immediate notification
        });
    }

    // Schedule recurring notification
    async scheduleRecurringNotification(title, body, timeString, type) {
        const [hours, minutes] = timeString.split(':').map(Number);
        
        let trigger = {
            hour: hours,
            minute: minutes,
            repeats: true,
        };

        if (type === 'weekly') {
            trigger.weekday = this.getDayNumber(timeString.split(' ')[0]); // Assuming format "Monday 10:00"
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger,
        });
    }

    // Schedule one-time notification
    async scheduleOneTimeNotification(title, body, datetime) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: datetime,
        });
    }

    // Helper function to get day number
    getDayNumber(day) {
        const days = {
            'Sunday': 1,
            'Monday': 2,
            'Tuesday': 3,
            'Wednesday': 4,
            'Thursday': 5,
            'Friday': 6,
            'Saturday': 7
        };
        return days[day];
    }

    // Get all pending alerts
    async getPendingAlerts(userId) {
        try {
            const response = await databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteReminderCollectionId,
                [
                    Query.equal('status', 'pending'),
                    Query.equal('userId', userId)
                ]
            );
            return { success: true, data: response.documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Mark alert as read
    async markAlertAsRead(alertId) {
        try {
            await databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteReminderCollectionId,
                alertId,
                {
                    status: 'read'
                }
            );
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new ReminderController();
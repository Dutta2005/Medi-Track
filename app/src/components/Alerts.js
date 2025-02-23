import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import ReminderController from '../controllers/ReminderController';

const Alerts = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        const response = await ReminderController.getPendingAlerts(user.$id);
        if (response.success) {
            setAlerts(response.data);
        }
        setLoading(false);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAlerts();
        setRefreshing(false);
    };

    const markAsRead = async (alertId) => {
        const response = await ReminderController.markAlertAsRead(alertId);
        if (response.success) {
            setAlerts(alerts.filter(alert => alert.$id !== alertId));
        }
    };

    useEffect(() => {
        ReminderController.initializeNotifications();
        fetchAlerts();
    }, []);

    const renderAlert = ({ item }) => (
        <View className="bg-[#30241a] p-4 rounded-lg mb-2">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-[#f7f9eb] text-lg">
                        {item.type === 'lowStock' ? '⚠️ Low Stock' : 
                         item.type === 'expiry' ? '⏰ Expiry Warning' : '💊 Dosage Reminder'}
                    </Text>
                    <Text className="text-[#f7f9eb] mt-1">{item.message}</Text>
                    <Text className="text-[#9f8b76] text-sm mt-1">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <TouchableOpacity 
                    onPress={() => markAsRead(item.$id)}
                    className="bg-[#ff8f00] px-3 py-1 rounded-lg"
                >
                    <Text className="text-[#f7f9eb]">Mark as Read</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#1e1c16]">
                <Text className="text-[#f7f9eb]">Loading alerts...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#1e1c16] p-4">
            <Text className="text-xl text-[#f7f9eb] mb-4">Alerts</Text>
            <FlatList
                data={alerts}
                renderItem={renderAlert}
                keyExtractor={item => item.$id}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={handleRefresh}
                        tintColor="#f7f9eb"
                    />
                }
                ListEmptyComponent={
                    <Text className="text-[#f7f9eb] text-center">No pending alerts</Text>
                }
            />
        </View>
    );
};

export default Alerts;
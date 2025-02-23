import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Dosage from '../components/Dosage';
import { Trash2 } from 'lucide-react-native';

function ProductDetailsScreen( product ) {
  const item = product.route.params.product;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <View className="flex-1 p-4 bg-light-bg dark:bg-dark-bg">
      <View className="rounded-xl p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-lg">
        <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold mb-4 text-light-cardText dark:text-dark-cardText">
          {item.name}
        </Text>
        {item.category && (
            <Text className="text-sm bg-light-primary text-light-muted py-1 px-2 rounded-full dark:bg-dark-primary dark:text-dark-muted">{item.category}</Text>
        )}
        </View>

        <Dosage scheduleType={item.scheduleType} dosage={item.dailyDosages.length > 0 ? item.dailyDosages : item.weeklyDosages.length > 0 ? item.weeklyDosages : item.customSchedule} />

        <View className="flex-row justify-between items-center py-2 border-b border-light-border dark:border-dark-border">
          <Text className="text-base font-medium text-light-mutedText dark:text-dark-mutedText">
            Quantity:
          </Text>
          <Text className="text-base text-light-cardText dark:text-dark-cardText">
            {item.quantity}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2 border-b border-light-border dark:border-dark-border">
          <Text className="text-base font-medium text-light-mutedText dark:text-dark-mutedText">
            Reorder Point:
          </Text>
          <Text className="text-base text-light-cardText dark:text-dark-cardText">
            {item.reorderPoint}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2 border-b border-light-border dark:border-dark-border">
          <Text className="text-base font-medium text-light-mutedText dark:text-dark-mutedText">
            Expiry Date:
          </Text>
          <Text className="text-base text-light-cardText dark:text-dark-cardText">
            {formatDate(item.expiry_date)}
          </Text>
        </View>

        {item.quantity <= item.reorderPoint && (
          <View className="mt-4 p-3 rounded-lg bg-light-destructive dark:bg-dark-destructive">
            <Text className="text-sm font-medium text-center text-light-destructiveText dark:text-dark-destructiveText">
              Stock Alert: Quantity is at or below reorder point!
            </Text>
          </View>
        )}

        <Text className="text-xs text-right mt-4 text-light-mutedText dark:text-dark-mutedText">
          Last updated: {item.updatedAt}
        </Text>

        <TouchableOpacity 
          onPress={() => {}}
          className="flex-row items-center gap-2 mt-4"
        >
            <Trash2 size={20} color="red" />
            <Text className="text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProductDetailsScreen;
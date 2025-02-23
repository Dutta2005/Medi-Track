import React from "react";
import { View, Text } from "react-native";

function Dosage({ scheduleType, dosage }) {
  console.log(scheduleType, dosage);
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View className="p-4 mb-2">
      {scheduleType === "daily" && (
        <View className="flex-row justify-between items-center">
          {days.map((day, index) => (
            <View key={index} className="items-center">
              <Text className="mb-2 text-sm font-medium text-light-text dark:text-dark-text">{day}</Text>
              <View className="w-2 h-2 rounded-full bg-green-500" />
            </View>
          ))}
          <Text className="text-light-text dark:text-dark-text">{dosage[0]}</Text>
        </View>
      )}
    </View>
  );
}

export default Dosage;

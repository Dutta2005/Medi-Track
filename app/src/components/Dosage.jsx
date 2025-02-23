import React from "react";
import { View, Text } from "react-native";

const Weekly = ({ days }) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const shouldShowDot = (day) => {
    if (
      days.length === 1 &&
      (days[0].includes("pm") || days[0].includes("am"))
    ) {
      return true;
    }
    return days.includes(day);
  };

  return (
    <View className="flex-row justify-between items- w-full px-4">
      {weekDays.map((day, index) => (
        <View key={index} className="items-center">
          <Text className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            {day.charAt(0)}
          </Text>
          {shouldShowDot(day) && (
            <View className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </View>
      ))}
      <View>
        <Text className="text-light-text dark:text-dark-text ml-2">
          {days[0]}
        </Text>
      </View>
    </View>
  );
};

const Dosage = ({ scheduleType, dosage }) => {
  return (
    <View className="p-4 mb-2">
      {scheduleType === "weekly" || scheduleType === "daily" ? (
        <Weekly days={dosage} />
      ) : (
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          Next Dose: {dosage}
        </Text>
      )}
    </View>
  );
};

export default Dosage;

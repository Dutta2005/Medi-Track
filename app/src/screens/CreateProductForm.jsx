import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ProductController from '../controllers/ProductController';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const CreateProductForm = () => {
    const { user } = useAuth()
    const navigation = useNavigation()
  const [product, setProduct] = useState({
    name: '',
    quantity: '',
    expiryDate: new Date(),
    scheduleType: '',
    dailyDosages: [],
    weeklyDosages: [],
    customSchedule: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatDays, setRepeatDays] = useState('');


  const handleChange = (name, value) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate >= today) {
        handleChange('expiryDate', selectedDate);
      }
    }
  };

  const handleCustomDateChange = (event, selectedDate) => {
    setShowCustomDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate >= today) {
        setCustomStartDate(selectedDate);
      }
    }
  };

  const handleTimeSelection = (event, selected) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selected) {
      setSelectedTime(selected);
      if (product.scheduleType === 'daily') {
        const timeString = selected.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setProduct(prev => ({
          ...prev,
          dailyDosages: [...prev.dailyDosages, timeString]
        }));
      }
    }
  };

  const removeDailyTime = (index) => {
    setProduct(prev => ({
      ...prev,
      dailyDosages: prev.dailyDosages.filter((_, i) => i !== index)
    }));
  };

  const toggleDaySelection = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => 
        daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
      )
    );
  };

  const handleSubmit = async() => {
    let updatedProduct = { ...product };

    if (enableSchedule) {
      switch (product.scheduleType) {
        case 'weekly':
          if (selectedDays.length > 0) {
            const timeString = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            updatedProduct.weeklyDosages = [timeString, ...selectedDays];
          }
          break;
        case 'custom':
          if (repeatDays && !isNaN(repeatDays) && parseInt(repeatDays) > 0) {
            updatedProduct.customSchedule = [customStartDate.toISOString(), parseInt(repeatDays)];
          }
          break;
      }
    }

    setProduct(updatedProduct);

    try {
        const res = await ProductController.createProduct({
            ...updatedProduct,
            userId: user.$id
        })
        if (res.success) {
            navigation.navigate('dashboard')
        }
    } catch (error) {
        console.log(error)
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const toggleSchedule = (value) => {
    setEnableSchedule(value);
    if (!value) {
      setProduct(prev => ({
        ...prev,
        scheduleType: '',
        dailyDosages: [],
        weeklyDosages: [],
        customSchedule: []
      }));
    } else {
      handleChange('scheduleType', 'daily');
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#1e1c16] p-4">
      {/* Previous sections remain the same */}
      <View className="space-y-4">
        <Text className="text-2xl font-bold text-[#f7f9eb]">Create Product</Text>

        {/* Basic fields remain the same */}
        <View className="space-y-2">
          <Text className="text-[#f7f9eb]">Product Name</Text>
          <TextInput
            value={product.name}
            onChangeText={(text) => handleChange('name', text)}
            className="w-full p-3 rounded-lg bg-[#30241a] text-[#f7f9eb] border border-[#30241a]"
            placeholderTextColor="#9f8b76"
            placeholder="Enter product name"
          />
        </View>

        <View className="space-y-2">
          <Text className="text-[#f7f9eb]">Quantity</Text>
          <TextInput
            value={product.quantity}
            onChangeText={(text) => handleChange('quantity', text)}
            keyboardType="numeric"
            className="w-full p-3 rounded-lg bg-[#30241a] text-[#f7f9eb] border border-[#30241a]"
            placeholderTextColor="#9f8b76"
            placeholder="Enter quantity"
          />
        </View>

        <View className="space-y-2">
          <Text className="text-[#f7f9eb]">Expiry Date</Text>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="w-full p-3 rounded-lg bg-[#30241a] border border-[#30241a]"
          >
            <Text className="text-[#f7f9eb]">
              {product.expiryDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={product.expiryDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={getMinDate()}
            />
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-[#f7f9eb]">Enable Schedule</Text>
          <Switch
            value={enableSchedule}
            onValueChange={toggleSchedule}
            trackColor={{ false: '#30241a', true: '#ff8f00' }}
            thumbColor={enableSchedule ? '#f7f9eb' : '#9f8b76'}
          />
        </View>

        {enableSchedule && (
          <View className="space-y-4">
            <View className="space-y-2">
              <Text className="text-[#f7f9eb]">Schedule Type</Text>
              <View className="flex-row space-x-2">
                {['daily', 'weekly', 'custom'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleChange('scheduleType', type)}
                    className={`px-4 py-2 rounded-lg ${
                      product.scheduleType === type ? 'bg-[#ff8f00]' : 'bg-[#30241a]'
                    }`}
                  >
                    <Text className="text-[#f7f9eb] capitalize">{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Daily schedule section remains the same */}
            {product.scheduleType === 'daily' && (
              <View className="space-y-2">
                <Text className="text-[#f7f9eb]">Daily Times</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="bg-[#ff8f00] p-3 rounded-lg"
                >
                  <Text className="text-[#f7f9eb] text-center">Add Time</Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeSelection}
                  />
                )}
                <View className="space-y-2">
                  {product.dailyDosages.map((time, index) => (
                    <View key={index} className="flex-row justify-between items-center bg-[#30241a] p-3 rounded-lg">
                      <Text className="text-[#f7f9eb]">{time}</Text>
                      <TouchableOpacity onPress={() => removeDailyTime(index)}>
                        <Text className="text-red-500">Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Weekly schedule section remains the same */}
            {product.scheduleType === 'weekly' && (
              <View className="space-y-4">
                <View className="space-y-2">
                  <Text className="text-[#f7f9eb]">Select Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    className="bg-[#30241a] p-3 rounded-lg"
                  >
                    <Text className="text-[#f7f9eb]">
                      {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      display="default"
                      onChange={handleTimeSelection}
                    />
                  )}
                </View>

                <View className="space-y-2">
                  <Text className="text-[#f7f9eb]">Select Days:</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDaySelection(day)}
                        className={`px-3 py-2 rounded-lg ${
                          selectedDays.includes(day) ? 'bg-[#ff8f00]' : 'bg-[#30241a]'
                        }`}
                      >
                        <Text className="text-[#f7f9eb]">{day.slice(0, 3)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Updated custom schedule section */}
            {product.scheduleType === 'custom' && (
              <View className="space-y-4">
                <View className="space-y-2">
                  <Text className="text-[#f7f9eb]">Start Date</Text>
                  <TouchableOpacity 
                    onPress={() => setShowCustomDatePicker(true)}
                    className="w-full p-3 rounded-lg bg-[#30241a] border border-[#30241a]"
                  >
                    <Text className="text-[#f7f9eb]">
                      {customStartDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showCustomDatePicker && (
                    <DateTimePicker
                      value={customStartDate}
                      mode="date"
                      display="default"
                      onChange={handleCustomDateChange}
                      minimumDate={getMinDate()}
                    />
                  )}
                </View>

                <View className="space-y-2">
                  <Text className="text-[#f7f9eb]">Repeat Every (Days)</Text>
                  <TextInput
                    value={repeatDays}
                    onChangeText={setRepeatDays}
                    keyboardType="numeric"
                    className="w-full p-3 rounded-lg bg-[#30241a] text-[#f7f9eb] border border-[#30241a]"
                    placeholderTextColor="#9f8b76"
                    placeholder="Enter number of days"
                  />
                </View>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          className="bg-[#ff8f00] p-4 rounded-lg mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-[#f7f9eb] text-center font-bold">Save Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateProductForm;
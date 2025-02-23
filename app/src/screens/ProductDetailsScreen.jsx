import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Dosage from '../components/Dosage';
import { Trash2, Package, Calendar, AlertCircle, RefreshCw } from 'lucide-react-native';
import ProductController from '../controllers/ProductController';
import { useNavigation } from '@react-navigation/native';

function ProductDetailsScreen(product) {
  const item = product.route.params.product;
  const navigation = useNavigation();
  const [deleting, setDeleting] = React.useState(false);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date provided';
  
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Invalid Date';
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await ProductController.deleteProduct(item.$id);
      if (res.success) {
        navigation.navigate('dashboard');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (deleting) {
    return (
      <View className="flex-1 items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
        <View className="rounded-xl p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-lg w-full">
          <Text className="text-xl font-semibold text-center text-light-cardText dark:text-dark-cardText">
            Deleting Product...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-light-bg dark:bg-dark-bg">
      <View className="p-4">
        <View className="rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-lg overflow-hidden">
          {/* Header Section */}
          <View className="p-4 border-b border-light-border dark:border-dark-border">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-light-cardText dark:text-dark-cardText">
                {item.name}
              </Text>
              {item.category && (
                <View className="bg-light-primary dark:bg-dark-primary rounded-full px-3 py-1">
                  <Text className="text-sm font-medium text-light-muted dark:text-dark-muted">
                    {item.category}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Dosage Section */}
          <View className="p-4 border-b border-light-border dark:border-dark-border">
            <Text className="text-base font-semibold mb-2 text-light-mutedText dark:text-dark-mutedText">
              Schedule
            </Text>
            <Dosage 
              scheduleType={item.scheduleType} 
              dosage={item.dailyDosages.length > 0 
                ? item.dailyDosages 
                : item.weeklyDosages.length > 0 
                ? item.weeklyDosages 
                : item.customSchedule} 
            />
          </View>

          {/* Details Section */}
          <View className="p-4">
            <View className="flex-row items-center mb-2">
              <Package size={18} color={'#3b82f6'} />
              <View className="flex-1 flex-row justify-between items-center ml-3">
                <Text className="text-base font-medium text-light-mutedText dark:text-dark-mutedText">
                  Quantity
                </Text>
                <Text className="text-base text-light-cardText dark:text-dark-cardText">
                  {item.quantity}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <RefreshCw size={18} color={'#3b82f6'} />
              <View className="flex-1 flex-row justify-between items-center ml-3">
                <Text className="text-base font-medium text-light-mutedText dark:text-dark-mutedText">
                  Reorder Point
                </Text>
                <Text className="text-base text-light-cardText dark:text-dark-cardText">
                  {item.reorderPoint}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <Calendar size={18} color="red" />
              <View className="flex-1 flex-row justify-between items-center ml-3">
                <Text className="text-base font-medium text-light-mutedText dark:text-dark-mutedText">
                  Expiry Date
                </Text>
                <Text className="text-base text-light-cardText dark:text-dark-cardText">
                  {formatDate(item.expiry_date)}
                </Text>
              </View>
            </View>
          </View>

          {/* Alert Section */}
          {item.quantity <= item.reorderPoint && (
            <View className="mx-4 mb-4">
              <View className="flex-row items-center p-3 rounded-lg bg-light-destructive dark:bg-dark-destructive">
                <AlertCircle size={20} color="white" />
                <Text className="flex-1 ml-2 text-sm font-medium text-light-destructiveText dark:text-dark-destructiveText">
                  Stock Alert: Quantity is at or below reorder point!
                </Text>
              </View>
            </View>
          )}

          {/* Footer Section */}
          <View className="p-4 border-t border-light-border dark:border-dark-border">
            <Text className="text-xs text-light-mutedText dark:text-dark-mutedText mb-4">
              Last updated: {formatDate(item.$updatedAt)}
            </Text>
            
            <TouchableOpacity 
              onPress={handleDelete}
              className="flex-row items-center justify-center gap-2 p-3 rounded-lg bg-red-500 dark:bg-red-700"
            >
              <Trash2 size={20} color="white"/>
              <Text className="text-dark-text font-medium">Delete Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ProductDetailsScreen;
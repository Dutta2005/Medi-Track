import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ProductController from '../controllers/ProductController';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Dosage from '../components/Dosage';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const FilterChip = ({ label, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-2 mb-2`}
    style={{ backgroundColor }}
  >
    <Text style={{ color: textColor }} className="font-medium">
      {label}
    </Text>
  </TouchableOpacity>
);

const DashboardCard = ({ title, value, colorClass = "text-light-text dark:text-dark-text" }) => (
  <View className="bg-light-accent dark:bg-dark-accent p-4 rounded-lg shadow-sm mb-4 mt-2">
    <Text className="text-light-mutedText dark:text-dark-mutedText text-sm">{title}</Text>
    <Text className={`text-xl font-bold pt-2 ${colorClass}`}>{value}</Text>
  </View>
);


const ProductCard = ({ product }) => {
  return (
    <View className="w-full mb-4 border-l-4 border-light-primary bg-light-bg dark:bg-dark-bg rounded-lg shadow-sm">
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="package" size={20} color="#4B5563" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {product.name}
            </Text>
          </View>
          {product.category && (
            <View className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Text className="text-sm text-blue-800 dark:text-blue-100">
              {product.category}
            </Text>
          </View>
          )}
        </View>

        <View className="mt-4 mb-5">
          <Dosage 
            scheduleType={product.scheduleType}
            dosage={
              product.dailyDosages.length > 0 
                ? product.dailyDosages 
                : product.weeklyDosages.length > 0 
                ? product.weeklyDosages 
                : product.customSchedule
            }
          />

        <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="pill" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-600 dark:text-gray-300">
              Quantity: {product.quantity}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Feather name="calendar" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Expires: {new Date(product.expiry_date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        </View>
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const { user, theme } = useAuth();
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Medicine', 'Injection', 'Medical Supplies', 'Others'];

  const getLowStockItems = () => {
    return products.filter(p => p.quantity <= (p.reorderPoint || 5));
  };

  const getExpiringItems = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return products.filter(p => {
      const expiryDate = new Date(p.expiry_date);
      return expiryDate <= thirtyDaysFromNow;
    });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductController.getProducts(user.$id);
      if (response.success) {
        setProducts(response.data);
        setError(null);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  const getFilteredProducts = () => {
    let filteredProducts = [...products];
    
    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeFilter) {
      case 'today':
        return filteredProducts.filter(p => {
          const hasScheduleForToday = p.customSchedule?.some(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate.getTime() === today.getTime();
          }) || p.scheduleType === 'daily' || false;
          return hasScheduleForToday;
        });
      case 'lowStock':
        return filteredProducts.filter(p => p.quantity <= (p.reorderPoint || 5));
      case 'expired':
        return filteredProducts.filter(p => new Date(p.expiry_date) < today);
      default:
        return filteredProducts;
    }
  };

  const getFilterColor = (filterName) => {
    const isActive = activeFilter === filterName;
    switch (filterName) {
      case 'today':
        return {
          bg: isActive ? '#0f8568' : '#f7f9eb',
          text: isActive ? '#f7f9eb' : '#1e1c16'
        };
      case 'lowStock':
        return {
          bg: isActive ? '#f0c63b' : '#f7f9eb',
          text: isActive ? '#1e1c16' : '#1e1c16'
        };
      case 'expired':
        return {
          bg: isActive ? '#d32f2f' : '#f7f9eb',
          text: isActive ? '#f7f9eb' : '#1e1c16'
        };
      default:
        return {
          bg: isActive ? '#ff9800' : '#f7f9eb',
          text: isActive ? '#f7f9eb' : '#1e1c16'
        };
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg">
        <ActivityIndicator size="large" color={theme === 'dark' ? '#ff8f00' : '#ff9800'} />
        <Text className="mt-2 text-light-mutedText dark:text-dark-mutedText">Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 p-4 bg-light-bg dark:bg-dark-bg">
        <View className="bg-light-destructive/10 dark:bg-dark-destructive/10 p-4 rounded-lg">
          <Text className="text-light-destructive dark:text-dark-destructive font-semibold">Error</Text>
          <Text className="text-light-destructive dark:text-dark-destructive mt-1">{error}</Text>
          <TouchableOpacity 
            className="bg-light-destructive dark:bg-dark-destructive py-2 px-4 rounded mt-2"
            onPress={fetchProducts}
          >
            <Text className="text-light-destructiveText dark:text-dark-destructiveText text-center">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4">
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-4">
            <DashboardCard 
              title="Low Stock" 
              value={getLowStockItems().length}
              colorClass="text-light-chart4 dark:text-dark-chart4"
            />
          </View>
          <View className="w-[48%] mb-4">
            <DashboardCard 
              title="Expiring Soon" 
              value={getExpiringItems().length}
              colorClass="text-light-destructive dark:text-dark-destructive"
            />
          </View>
        </View>
      </View>

      <View className="px-5 mb-2">
        <TouchableOpacity 
          className="bg-light-primary dark:bg-dark-primary py-3 px-4 rounded-xl"
          onPress={() => navigation.navigate('CreateProduct')}
        >
          <Text className="text-light-primaryText dark:text-dark-primaryText text-center font-semibold text-lg">
            Create New Product
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 mt-2 mb-4">
        <Text className="text-lg font-semibold mb-2 text-light-text dark:text-dark-text">Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip
            label="All"
            onPress={() => setActiveFilter('all')}
            backgroundColor={getFilterColor('all').bg}
            textColor={getFilterColor('all').text}
          />
          <FilterChip
            label="Today's Schedule"
            onPress={() => setActiveFilter('today')}
            backgroundColor={getFilterColor('today').bg}
            textColor={getFilterColor('today').text}
          />
          <FilterChip
            label="Low Stock"
            onPress={() => setActiveFilter('lowStock')}
            backgroundColor={getFilterColor('lowStock').bg}
            textColor={getFilterColor('lowStock').text}
          />
          <FilterChip
            label="Expired"
            onPress={() => setActiveFilter('expired')}
            backgroundColor={getFilterColor('expired').bg}
            textColor={getFilterColor('expired').text}
          />
        </ScrollView>
      </View>

      <View className="px-4 mb-4">
        <Text className="text-light-text dark:text-dark-text text-lg font-semibold mb-2">Category</Text>
        <View className="border border-light-border dark:border-dark-border rounded-lg">
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
            style={{ color: theme === 'dark' ? '#f7f9eb' : '#1e1c16' }}
          >
            {categories.map(category => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
      </View>

      <View className="px-4 pb-4">
        {getFilteredProducts().map(product => (
          <TouchableOpacity 
            key={product.$id}
            onPress={() => navigation.navigate('ProductDetails', { product: product })}
          >
            <ProductCard product={product} />
          </TouchableOpacity>
        ))}
        {getFilteredProducts().length === 0 && (
          <View className="py-8">
            <Text className="text-center text-light-mutedText dark:text-dark-mutedText">
              No products found for this filter
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import ProductController from '../controllers/ProductController';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const DashboardCard = ({ title, value, colorClass = "text-black" }) => (
  <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
    <Text className="text-gray-600 text-sm">{title}</Text>
    <Text className={`text-xl font-bold ${colorClass}`}>{value}</Text>
  </View>
);

const AlertCard = ({ title, description, type = "warning" }) => (
  <View className={`p-4 rounded-lg mb-2 ${type === "warning" ? "bg-yellow-100" : "bg-red-100"}`}>
    <Text className={`font-semibold ${type === "warning" ? "text-yellow-800" : "text-red-800"}`}>
      {title}
    </Text>
    <Text className={`mt-1 ${type === "warning" ? "text-yellow-700" : "text-red-700"}`}>
      {description}
    </Text>
  </View>
);

const ProductCard = ({ product }) => (
  <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
    <View className="flex-row justify-between">
      <Text className="text-lg font-semibold">{product.name}</Text>
      <Text className="text-sm text-dark-primary">{product.category}</Text>
    </View>
    <View className="flex-row justify-between mt-2">
      <Text className="text-gray-600">Quantity: {product.quantity}</Text>
    </View>
    <Text className="text-gray-600 mt-1">
      Expires: {new Date(product.expiry_date).toLocaleDateString()}
    </Text>
  </View>
);

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['Medicine', 'Injection', 'Medical Supplies', 'Others'];

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const getCategoryStats = () => {
    return categories.map(category => ({
      name: category,
      count: products.filter(p => p.category === category).length,
    }));
  };

  const getLowStockItems = () => {
    return products.filter(p => p.quantity <= p.reorderPoint);
  };

  const getExpiringItems = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return products.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      return expiryDate <= thirtyDaysFromNow;
    });
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 p-4">
        <View className="bg-red-100 p-4 rounded-lg">
          <Text className="text-red-800 font-semibold">Error</Text>
          <Text className="text-red-700 mt-1">{error}</Text>
          <TouchableOpacity 
            className="bg-red-500 py-2 px-4 rounded mt-2"
            onPress={fetchProducts}
          >
            <Text className="text-white text-center">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Create Product Button */}
      <View className="p-4">
        <TouchableOpacity 
          className="bg-blue-500 py-3 px-4 rounded-lg"
          onPress={() => navigation.navigate('CreateProduct')}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Create New Product
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View className="px-4">
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-4">
            <DashboardCard title="Total Products" value={products.length} />
          </View>
          <View className="w-[48%] mb-4">
            <DashboardCard 
              title="Low Stock" 
              value={getLowStockItems().length}
              colorClass="text-yellow-600"
            />
          </View>
          <View className="w-[48%] mb-4">
            <DashboardCard 
              title="Expiring Soon" 
              value={getExpiringItems().length}
              colorClass="text-red-600"
            />
          </View>
          <View className="w-[48%] mb-4">
            <DashboardCard title="Categories" value={categories.length} />
          </View>
        </View>
      </View>

      {/* Alerts Section */}
      <View className="px-4">
        {/* Low Stock Alerts */}
        {getLowStockItems().length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Low Stock Alerts</Text>
            {getLowStockItems().map(product => (
              <AlertCard
                key={product.$id}
                title={product.name}
                description={`Current quantity: ${product.quantity} (Reorder point: ${product.reorderPoint})`}
                type="warning"
              />
            ))}
          </View>
        )}

        {/* Expiring Items */}
        {getExpiringItems().length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Items Expiring Soon</Text>
            {getExpiringItems().map(product => (
              <AlertCard
                key={product.$id}
                title={product.name}
                description={`Expires on: ${new Date(product.expiryDate).toLocaleDateString()}`}
                type="error"
              />
            ))}
          </View>
        )}
      </View>

      {/* Products List */}
      <View className="px-4 pb-4">
        <Text className="text-xl font-bold mb-4">Your Products</Text>
        {products.map(product => (
          <TouchableOpacity 
            key={product.$id}
            onPress={() => navigation.navigate('ProductDetails', { product })}
          >
            <ProductCard product={product} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
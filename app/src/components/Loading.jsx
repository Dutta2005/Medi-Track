import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingSpinner = ({
  size = 'large',
  color = '#ff9800',
  message="Loading user data...",
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  fullScreen = false,
}) => {
  const containerStyle = fullScreen
    ? [styles.container, styles.fullScreen]
    : styles.container;

  return (
    <View style={[containerStyle, { backgroundColor }]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
});

export default LoadingSpinner;
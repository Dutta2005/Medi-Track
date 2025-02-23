import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import { Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const WINDOW_WIDTH = Dimensions.get('window').width;

// Updated color scheme for better contrast
const COLORS = {
    gradient: {
      start: "#ff9800",
      end: "#f57c00"  // Darker orange for better contrast
    },
    primary: "#ff9800",
    secondary: "#f57c00",
    text: {
      light: {
        primary: "#1a1a1a",    // Almost black for light mode
        secondary: "#4b5563",  // Darker gray for better readability
        muted: "#6b7280"      // Medium gray for subtle text
      },
      dark: {
        primary: "#f8fafc",    // Very light gray for dark mode
        secondary: "#e2e8f0",  // Light gray for secondary text
        muted: "#cbd5e1"      // Muted gray that's still readable
      }
    }
};

const FEATURES = [
  {
    id: 'reminders',
    icon: 'clock-check-outline',
    title: 'Smart Reminders',
    description: 'Personalized medication alerts',
    color: COLORS.gradient.start
  },
  {
    id: 'progress',
    icon: 'chart-timeline-variant',
    title: 'Track Progress',
    description: 'Monitor your medication routine',
    color: COLORS.gradient.end
  },
  {
    id: 'supply',
    icon: 'pill',
    title: 'Smart Supply Alert',
    description: 'Never run out of medications again',
    color: COLORS.gradient.start
  }
];

const FeatureCard = ({ icon, title, description, color }) => (
  <View className="flex-row items-center mb-4">
    <View className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <View className="ml-4">
      <Text className="text-gray-900 dark:text-gray-50 text-lg font-semibold">{title}</Text>
      <Text className="text-gray-600 dark:text-gray-300">{description}</Text>
    </View>
  </View>
);

const GradientButton = ({ onPress, children }) => {
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  // Combined animation style
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 150 });
    buttonOpacity.value = withTiming(0.9, { duration: 150 });
  };
  
  const handlePressOut = () => {
    buttonScale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );
    buttonOpacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="overflow-hidden rounded-2xl"  // Added overflow hidden for ripple effect
    >
      <Animated.View style={buttonStyle}>
        <LinearGradient
          colors={[COLORS.gradient.start, COLORS.gradient.end]}
          className="rounded-2xl py-4 px-6"  // Added horizontal padding
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// For the login button, we'll create a custom animated button
const AnimatedLoginButton = ({ onPress, title, linkText }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-row justify-center items-center space-x-2 mt-4 bg-white/10 dark:bg-white/5 py-3 px-6 rounded-xl"
      >
        <Text className="text-gray-700 dark:text-gray-300 text-lg">{title}</Text>
        <Text className="text-orange-500 dark:text-orange-400 text-lg font-semibold">  {linkText}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Custom hooks remain the same
const useLogoAnimation = () => {
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }]
  }));
};

const useTrackingAnimation = () => {
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  return {
    style: { 
      left: -WINDOW_WIDTH / 2, 
      width: WINDOW_WIDTH * 2, 
      transform: [{ translateX: pulseAnim.value * 10 }] 
    }
  };
};

function HomeScreen() {
    const navigation = useNavigation();
    const pulseStyle = useLogoAnimation();
    const trackingAnimation = useTrackingAnimation();

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Background with heart tracking animation */}
            <View className="absolute top-0 w-full h-2/5 overflow-hidden">
                <LinearGradient
                    colors={[COLORS.gradient.start, COLORS.gradient.end]}
                    className="w-full h-full rounded-b-[50px]"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <Animated.View 
                    className="absolute bottom-0 w-full h-[4px] bg-white/50 dark:bg-white/30" 
                    style={trackingAnimation.style}
                />
            </View>

            <View className="flex-1 px-6">
                {/* Logo and Title */}
                <Animated.View 
                    entering={FadeInDown.duration(1000)}
                    className="mt-16 items-center"
                >
                    <Animated.View style={pulseStyle}>
                        <Image 
                            source={require('../../assets/Logo.png')}
                            className="w-52 h-32"
                            resizeMode="contain"
                        />
                    </Animated.View>
                    <Text className="text-gray-900 dark:text-white text-4xl font-bold mt-2">
                        MediTrack
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 mt-2 font-bold">
                        Never Miss a Dose Again
                    </Text>
                </Animated.View>

                {/* Feature Cards */}
                <Animated.View 
                    entering={FadeInUp.duration(1000).delay(300)}
                    className="mt-14"
                >
                    <View className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg shadow-gray-200 dark:shadow-gray-900 mb-4">
                        {FEATURES.map((feature) => (
                            <FeatureCard
                                key={feature.id}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                color={feature.color}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Buttons */}
                <Animated.View 
                entering={FadeInUp.duration(1000).delay(600)}
                className="mt-auto mb-8 px-4"  // Added horizontal padding
            >
                <GradientButton onPress={() => navigation.navigate('signup')}>
                    <Text className="text-white text-center text-xl font-semibold">
                        Get Started
                    </Text>
                </GradientButton>

                <AnimatedLoginButton
                    onPress={() => navigation.navigate('login')}
                    title="Already have an account?"
                    linkText="Login"
                />
            </Animated.View>
            </View>
        </View>
    );
}

export default HomeScreen;
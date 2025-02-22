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

// Constants
const WINDOW_WIDTH = Dimensions.get('window').width;
const COLORS = {
    gradient: {
      start: "#ff9800",
      end: "#f7a83b"
    },
    primary: "#ff9800",
    secondary: "#f7a83b",
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
      light: "#ffffff"
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
  
  
// Reusable components
const FeatureCard = ({ icon, title, description, color }) => (
  <View className="flex-row items-center mb-4">
    <View className="bg-light-secondary p-3 rounded-2xl">
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <View className="ml-4">
      <Text className="text-light-cardText text-lg font-semibold">{title}</Text>
      <Text className="text-light-mutedText">{description}</Text>
    </View>
  </View>
);

const GradientButton = ({ onPress, children }) => {
  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };
  
  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={buttonStyle}>
        <LinearGradient
          colors={[COLORS.gradient.start, COLORS.gradient.end]}
          className="rounded-2xl py-4"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Custom hooks
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
        <View className="flex-1 bg-light-bg">
            {/* Background with heart tracking animation */}
            <View className="absolute top-0 w-full h-2/5 overflow-hidden">
                <LinearGradient
                    colors={[COLORS.gradient.start, COLORS.gradient.end]}
                    className="w-full h-full rounded-b-[50px]"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <Animated.View 
                    className="absolute bottom-0 w-full h-[4px] bg-light-primary" 
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
                    <Text className="text-light-primaryText text-4xl font-bold mt-4">
                        MediTrack
                    </Text>
                    <Text className="text-light-mutedText text-lg mt-2">
                        Never Miss a Dose Again
                    </Text>
                </Animated.View>

                {/* Feature Cards */}
                <Animated.View 
                    entering={FadeInUp.duration(1000).delay(300)}
                    className="mt-8"
                >
                    <View className="bg-light-card rounded-3xl p-6 shadow-2xl shadow-light-primary mb-4">
                        <FeatureCard
                            icon="clock-check-outline"
                            title="Smart Reminders"
                            description="Personalized medication alerts"
                            color={COLORS.gradient.start}
                        />
                        <FeatureCard
                            icon="chart-timeline-variant"
                            title="Track Progress"
                            description="Monitor your medication routine"
                            color={COLORS.gradient.end}
                        />
                        <FeatureCard
                            icon="pill"
                            title="Smart Supply Alert"
                            description="Never run out of medications again"
                            color={COLORS.gradient.start}
                        />
                    </View>
                </Animated.View>

                {/* Buttons */}
                <Animated.View 
                    entering={FadeInUp.duration(1000).delay(600)}
                    className="mt-auto mb-8"
                >
                    <GradientButton onPress={() => navigation.navigate('login')}>
                        <Text className="text-light-primaryText text-center text-xl font-semibold">
                            Get Started
                        </Text>
                    </GradientButton>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('signup')}
                        className="flex-row justify-center items-center space-x-2 mt-4"
                    >
                        <Text className="text-light-text text-lg">Already have an account?</Text>
                        <Text className="text-light-primary text-lg font-semibold">Login</Text>
                    </TouchableOpacity>
                    
                </Animated.View>
                
            </View>
        </View>
    );
}

export default HomeScreen;
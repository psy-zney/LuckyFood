import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface LightSpeedInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const LightSpeedIn: React.FC<LightSpeedInProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
}) => {
  const lightSpeedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(lightSpeedAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const translateX = lightSpeedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const skewX = lightSpeedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-20deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX }, { skewX }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

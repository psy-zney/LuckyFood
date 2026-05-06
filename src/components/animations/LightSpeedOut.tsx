import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface LightSpeedOutProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const LightSpeedOut: React.FC<LightSpeedOutProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
  onEnd,
}) => {
  const lightSpeedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(lightSpeedAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start(() => {
      onEnd?.();
    });
  }, []);

  const translateX = lightSpeedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const skewX = lightSpeedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-20deg'],
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

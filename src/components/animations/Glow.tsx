import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface GlowProps {
  children: React.ReactNode;
  minRadius?: number;
  maxRadius?: number;
  duration?: number;
  style?: ViewStyle;
}

export const Glow: React.FC<GlowProps> = ({
  children,
  minRadius = 8,
  maxRadius = 24,
  duration = 1800,
  style,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [minRadius, maxRadius],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
  });

  return (
    <Animated.View
      style={[
        {
          shadowRadius,
          shadowOpacity,
          shadowColor: '#FF8BA7',
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

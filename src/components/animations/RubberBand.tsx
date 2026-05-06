import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RubberBandProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const RubberBand: React.FC<RubberBandProps> = ({
  children,
  duration = 1000,
  delay = 0,
  style,
}) => {
  const rubberAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(rubberAnim, {
        toValue: 0.3,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rubberAnim, {
        toValue: 0.4,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rubberAnim, {
        toValue: 0.5,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rubberAnim, {
        toValue: 0.6,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rubberAnim, {
        toValue: 0.7,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rubberAnim, {
        toValue: 0.8,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rubberAnim, {
        toValue: 0.9,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(rubberAnim, {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const scaleX = rubberAnim.interpolate({
    inputRange: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 0.95, 1, 1],
  });

  const scaleY = rubberAnim.interpolate({
    inputRange: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1.05, 1, 1],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scaleX }, { scaleY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

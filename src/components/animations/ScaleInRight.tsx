import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ScaleInRightProps {
  children: React.ReactNode;
  from?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const ScaleInRight: React.FC<ScaleInRightProps> = ({
  children,
  from = 0.5,
  duration = 400,
  delay = 0,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(from)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

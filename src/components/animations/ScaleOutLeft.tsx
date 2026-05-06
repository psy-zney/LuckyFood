import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ScaleOutLeftProps {
  children: React.ReactNode;
  to?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const ScaleOutLeft: React.FC<ScaleOutLeftProps> = ({
  children,
  to = 0.5,
  duration = 400,
  delay = 0,
  style,
  onEnd,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: -30,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onEnd?.();
    });
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

import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface BounceOutProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const BounceOut: React.FC<BounceOutProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
  onEnd,
}) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(bounceAnim, {
        toValue: 0,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onEnd?.();
    });
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: bounceAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

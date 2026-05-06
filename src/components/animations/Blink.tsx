import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface BlinkProps {
  children: React.ReactNode;
  duration?: number;
  count?: number;
  style?: ViewStyle;
}

export const Blink: React.FC<BlinkProps> = ({
  children,
  duration = 500,
  count = 3,
  style,
}) => {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animations = [];
    for (let i = 0; i < count; i++) {
      animations.push(
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        })
      );
      animations.push(
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      );
    }
    Animated.sequence(animations).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: blinkAnim }, style]}>
      {children}
    </Animated.View>
  );
};

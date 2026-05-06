import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RotateOutProps {
  children: React.ReactNode;
  to?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const RotateOut: React.FC<RotateOutProps> = ({
  children,
  to = 180,
  duration = 500,
  delay = 0,
  style,
  onEnd,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue,
      duration,
      delay,
      useNativeDriver: true,
    }).start(() => {
      onEnd?.();
    });
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, to],
    outputRange: ['0deg', `${to}deg`],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate: rotation }] }, style]}>
      {children}
    </Animated.View>
  );
};

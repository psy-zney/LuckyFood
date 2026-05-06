import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RotateInProps {
  children: React.ReactNode;
  from?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const RotateIn: React.FC<RotateInProps> = ({
  children,
  from = -180,
  duration = 500,
  delay = 0,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [from, 0],
    outputRange: [`${from}deg`, '0deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate: rotation }] }, style]}>
      {children}
    </Animated.View>
  );
};

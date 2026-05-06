import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SlideInLeftProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const SlideInLeft: React.FC<SlideInLeftProps> = ({
  children,
  distance = 50,
  duration = 400,
  delay = 0,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(-distance)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ translateX: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

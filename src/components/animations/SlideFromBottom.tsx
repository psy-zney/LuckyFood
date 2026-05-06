import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SlideFromBottomProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const SlideFromBottom: React.FC<SlideFromBottomProps> = ({
  children,
  distance = 100,
  duration = 500,
  delay = 0,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

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
    <Animated.View style={[{ transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

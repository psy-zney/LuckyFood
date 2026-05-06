import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface FlipProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

export const Flip: React.FC<FlipProps> = ({
  children,
  duration = 600,
  style,
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotationY = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotateY: rotationY }] }, style]}>
      {children}
    </Animated.View>
  );
};

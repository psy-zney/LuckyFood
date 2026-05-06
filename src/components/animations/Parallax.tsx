import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ParallaxProps {
  children: React.ReactNode;
  scrollY: Animated.Value;
  factor?: number;
  style?: ViewStyle;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  scrollY,
  factor = 0.5,
  style,
}) => {
  const translateY = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [100 * factor, 0, -100 * factor],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[{ transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

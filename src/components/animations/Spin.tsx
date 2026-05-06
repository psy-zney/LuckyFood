import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SpinProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

export const Spin: React.FC<SpinProps> = ({
  children,
  duration = 1000,
  style,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate: rotation }] }, style]}>
      {children}
    </Animated.View>
  );
};

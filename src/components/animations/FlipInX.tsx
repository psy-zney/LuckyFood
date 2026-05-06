import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface FlipInXProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const FlipInX: React.FC<FlipInXProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(flipAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotateX = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '0deg', '0deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotateX }] }, style]}>
      {children}
    </Animated.View>
  );
};

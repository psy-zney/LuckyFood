import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RollOutProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const RollOut: React.FC<RollOutProps> = ({
  children,
  duration = 1000,
  delay = 0,
  style,
  onEnd,
}) => {
  const rollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rollAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start(() => {
      onEnd?.();
    });
  }, []);

  const rotate = rollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '120deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate }] }, style]}>
      {children}
    </Animated.View>
  );
};

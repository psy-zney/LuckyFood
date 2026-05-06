import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RollProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const Roll: React.FC<RollProps> = ({
  children,
  duration = 1000,
  delay = 0,
  style,
}) => {
  const rollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rollAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotate = rollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-120deg', '0deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate }] }, style]}>
      {children}
    </Animated.View>
  );
};

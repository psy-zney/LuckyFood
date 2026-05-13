import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface ScaleInProps {
  children: React.ReactNode;
  from?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  from = 0.8,
  duration = 300,
  delay = 0,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay, duration, scaleAnim]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

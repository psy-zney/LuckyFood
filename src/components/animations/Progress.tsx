import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ProgressProps {
  children: React.ReactNode;
  toValue: number;
  duration?: number;
  style?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = ({
  children,
  toValue,
  duration = 1000,
  style,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  }, [toValue]);

  return (
    <Animated.View style={[{ width: progressAnim }, style]}>
      {children}
    </Animated.View>
  );
};

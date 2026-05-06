import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ExpandProps {
  children: React.ReactNode;
  fromHeight?: number;
  toHeight?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const Expand: React.FC<ExpandProps> = ({
  children,
  fromHeight = 0,
  toHeight = 100,
  duration = 400,
  delay = 0,
  style,
}) => {
  const expandAnim = useRef(new Animated.Value(fromHeight)).current;

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: toHeight,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ height: expandAnim, overflow: 'hidden' }, style]}>
      {children}
    </Animated.View>
  );
};

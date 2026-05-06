import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface CollapseProps {
  children: React.ReactNode;
  fromHeight?: number;
  toHeight?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const Collapse: React.FC<CollapseProps> = ({
  children,
  fromHeight = 100,
  toHeight = 0,
  duration = 400,
  delay = 0,
  style,
}) => {
  const collapseAnim = useRef(new Animated.Value(fromHeight)).current;

  useEffect(() => {
    Animated.spring(collapseAnim, {
      toValue: toHeight,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ height: collapseAnim, overflow: 'hidden' }, style]}>
      {children}
    </Animated.View>
  );
};

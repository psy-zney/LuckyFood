import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ZoomInLeftProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const ZoomInLeft: React.FC<ZoomInLeftProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
}) => {
  const zoomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(zoomAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const scale = zoomAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.5, 1],
  });

  const translateX = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }, { translateX }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

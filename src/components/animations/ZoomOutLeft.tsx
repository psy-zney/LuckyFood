import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ZoomOutLeftProps {
  children: React.ReactNode;
  to?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const ZoomOutLeft: React.FC<ZoomOutLeftProps> = ({
  children,
  to = 0.1,
  duration = 600,
  delay = 0,
  style,
  onEnd,
}) => {
  const zoomAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(zoomAnim, {
      toValue,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start(() => {
      onEnd?.();
    });
  }, []);

  const scale = zoomAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [to, 0.5, 1],
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

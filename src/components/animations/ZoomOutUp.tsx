import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ZoomOutUpProps {
  children: React.ReactNode;
  to?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const ZoomOutUp: React.FC<ZoomOutUpProps> = ({
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

  const translateY = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }, { translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

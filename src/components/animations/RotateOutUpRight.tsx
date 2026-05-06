import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RotateOutUpRightProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onEnd?: () => void;
}

export const RotateOutUpRight: React.FC<RotateOutUpRightProps> = ({
  children,
  duration = 800,
  delay = 0,
  style,
  onEnd,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start(() => {
      onEnd?.();
    });
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-45deg'],
  });

  const translateX = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const translateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ rotate }, { translateX }, { translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

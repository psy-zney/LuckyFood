import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RotateInUpRightProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const RotateInUpRight: React.FC<RotateInUpRightProps> = ({
  children,
  duration = 800,
  delay = 0,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(rotateAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  const translateX = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const translateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
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

import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface MorphProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

export const Morph: React.FC<MorphProps> = ({
  children,
  duration = 500,
  style,
}) => {
  const morphAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(morphAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, []);

  const scale = morphAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });

  const borderRadius = morphAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [8, 50, 8],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }],
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

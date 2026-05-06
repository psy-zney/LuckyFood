import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface JelloProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

export const Jello: React.FC<JelloProps> = ({
  children,
  duration = 1000,
  style,
}) => {
  const jelloAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jelloAnim, {
          toValue: 0.25,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(jelloAnim, {
          toValue: 0.5,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(jelloAnim, {
          toValue: 0.75,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.spring(jelloAnim, {
          toValue: 0,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const scaleX = jelloAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 1.25, 0.75, 1.15, 1],
  });

  const scaleY = jelloAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.75, 1.25, 0.85, 1],
  });

  return (
    <Animated.View style={[{ transform: [{ scaleX }, { scaleY }] }, style]}>
      {children}
    </Animated.View>
  );
};

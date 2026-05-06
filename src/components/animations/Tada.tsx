import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface TadaProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const Tada: React.FC<TadaProps> = ({
  children,
  duration = 1000,
  delay = 0,
  style,
}) => {
  const tadaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(tadaAnim, {
        toValue: 0.1,
        duration: duration * 0.1,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.2,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.3,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.4,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.5,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.6,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.7,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.8,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 0.9,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tadaAnim, {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const scale = tadaAnim.interpolate({
    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1, 1],
  });

  const rotate = tadaAnim.interpolate({
    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: ['0deg', '-3deg', '-3deg', '-3deg', '3deg', '-3deg', '3deg', '-3deg', '3deg', '0deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }, { rotate }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

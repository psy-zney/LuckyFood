import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ShakeProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  style?: ViewStyle;
}

export const Shake: React.FC<ShakeProps> = ({
  children,
  duration = 50,
  distance = 10,
  style,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: distance,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -distance,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: distance / 2,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    shake();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface FloatProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  style?: ViewStyle;
}

export const Float: React.FC<FloatProps> = ({
  children,
  distance = 5,
  duration = 2000,
  style,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -distance,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ translateY: floatAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

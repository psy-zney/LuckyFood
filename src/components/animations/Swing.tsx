import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface SwingProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

export const Swing: React.FC<SwingProps> = ({
  children,
  duration = 1000,
  style,
}) => {
  const swingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(swingAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(swingAnim, {
          toValue: -1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const rotation = swingAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <Animated.View style={[{ transform: [{ rotate: rotation }] }, style]}>
      {children}
    </Animated.View>
  );
};

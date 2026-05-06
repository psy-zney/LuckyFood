import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface HeartbeatProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  style?: ViewStyle;
}

export const Heartbeat: React.FC<HeartbeatProps> = ({
  children,
  scale = 1.2,
  duration = 400,
  style,
}) => {
  const heartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: scale,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(heartAnim, {
          toValue: 1,
          tension: 200,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: heartAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};

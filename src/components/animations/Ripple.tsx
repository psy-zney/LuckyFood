import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface RippleProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  style?: ViewStyle;
}

export const Ripple: React.FC<RippleProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 500,
  style,
}) => {
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  }, []);

  const scale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const opacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  return (
    <View style={style}>
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 100,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        }}
      />
      {children}
    </View>
  );
};

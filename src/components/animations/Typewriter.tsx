import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface TypewriterProps {
  children: string;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  textStyle?: any;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  children,
  duration = 50,
  delay = 0,
  style,
  textStyle,
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const index = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index.current < children.length) {
        setDisplayText(children.slice(0, index.current + 1));
        index.current += 1;
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [displayText, children, duration]);

  return (
    <View style={style}>
      <Animated.Text style={textStyle}>{displayText}</Animated.Text>
    </View>
  );
};

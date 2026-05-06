# LuckyFood - Animation Plan

## Overview
Comprehensive animation strategy for LuckyFood app, covering screen transitions, tab navigation, icon animations, and micro-interactions.

---

## 1. Screen Entry/Exit Animations

### 1.1 Auth Screens (Login, Register)

**Entry Animation:**
```typescript
// Fade in + Slide up from bottom
const fadeAnim = useRef(new Animated.Value(0)).current;
const slideUpAnim = useRef(new Animated.Value(30)).current;

useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.spring(slideUpAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }),
  ]).start();
}, []);
```

**Form Field Focus Animation:**
```typescript
// Input container border color + scale effect
const [focused, setFocused] = useState(false);

const inputStyle = {
  borderColor: focused ? theme.colors.primary : theme.colors.borderSubtle,
  transform: [{ scale: focused ? 1.02 : 1 }],
};
```

**Button Press Animation:**
```typescript
const buttonScale = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.spring(buttonScale, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.spring(buttonScale, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};
```

---

### 1.2 HomeScreen

**Entry Animation (Staggered):**
```typescript
// Header → Welcome → Streak Card → Sections
const headerAnim = useRef(new Animated.Value(0)).current;
const welcomeAnim = useRef(new Animated.Value(0)).current;
const streakAnim = useRef(new Animated.Value(0)).current;
const sectionsAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.sequence([
    Animated.timing(headerAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    Animated.timing(welcomeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    Animated.spring(streakAnim, { toValue: 1, useNativeDriver: true }),
    Animated.timing(sectionsAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
  ]).start();
}, []);
```

**Streak Progress Animation:**
```typescript
// Animate progress bar width on mount
const progressAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(progressAnim, {
    toValue: streakPercentage,
    duration: 1000,
    easing: Easing.out(Easing.ease),
    useNativeDriver: false, // width not supported
  }).start();
}, [streakPercentage]);
```

**Horizontal Scroll Cards:**
```typescript
// Scale effect on scroll
const scrollX = useRef(new Animated.Value(0)).current;

const scale = scrollX.interpolate({
  inputRange: [-100, 0, 100],
  outputRange: [0.9, 1, 0.9],
});
```

**Random Section Pulse:**
```typescript
// Subtle pulse animation for CTA
const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]),
  ).start();
}, []);
```

---

### 1.3 SearchScreen

**Search Bar Animation:**
```typescript
// Expand/collapse on focus
const searchWidth = useRef(new Animated.Value(0)).current;

const handleFocus = () => {
  Animated.spring(searchWidth, {
    toValue: 1,
    useNativeDriver: false,
  }).start();
};
```

**Results List Animation (Staggered):**
```typescript
// Fade in each item with delay
const renderItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Item content */}
    </Animated.View>
  );
};
```

**Empty State Animation:**
```typescript
// Bounce animation for icon
const bounceAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]),
  ).start();
}, []);
```

---

### 1.4 RandomWheelScreen

**Slot Machine Animation:**
```typescript
// Already implemented - enhance with:
// 1. Blur effect during spin
const blurAnim = useRef(new Animated.Value(0)).current;

// 2. Color shift during spin
const colorAnim = useRef(new Animated.Value(0)).current;

const interpolatedColor = colorAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [theme.colors.text, theme.colors.primary],
});
```

**Button Glow Animation:**
```typescript
// Pulsing glow effect
const glowAnim = useRef(new Animated.Value(0)).current;

const glowRadius = glowAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [8, 24],
});

const glowOpacity = glowAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0.15, 0.45],
});
```

**Result Card Reveal:**
```typescript
// Scale + Fade + Slide up
const resultAnim = useRef(new Animated.Value(0)).current;

Animated.parallel([
  Animated.spring(resultAnim, {
    toValue: 1,
    tension: 50,
    friction: 7,
    useNativeDriver: true,
  }),
]).start();
```

---

### 1.5 FilterScreen

**Ingredient Selection Animation:**
```typescript
// Scale + Color transition
const selectedAnim = useRef(new Animated.Value(0)).current;

const handleSelect = (id: string) => {
  Animated.spring(selectedAnim, {
    toValue: selected ? 0 : 1,
    useNativeDriver: true,
  }).start();
};

const scale = selectedAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [1, 1.1],
});
```

**Search Button Animation:**
```typescript
// Pulse when ingredients selected
const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (selectedIds.size > 0) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }
}, [selectedIds.size]);
```

**Results Section Animation:**
```typescript
// Slide up + Fade in
const resultsAnim = useRef(new Animated.Value(0)).current;

Animated.parallel([
  Animated.timing(resultsAnim, {
    toValue: 1,
    duration: 400,
    useNativeDriver: true,
  }),
]).start();
```

---

### 1.6 FavouritesScreen

**Empty State Animation:**
```typescript
// Heart beat animation
const heartAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(heartAnim, {
        toValue: 1.2,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(heartAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]),
  ).start();
}, []);
```

**Favourite Toggle Animation:**
```typescript
// Heart icon scale + color transition
const favScale = useRef(new Animated.Value(0)).current;

const toggleFavourite = () => {
  Animated.sequence([
    Animated.spring(favScale, {
      toValue: 1.3,
      useNativeDriver: true,
    }),
    Animated.spring(favScale, {
      toValue: 1,
      useNativeDriver: true,
    }),
  ]).start();
};
```

---

### 1.7 CalendarScreen

**Month Navigation Animation:**
```typescript
// Slide left/right on month change
const slideAnim = useRef(new Animated.Value(0)).current;

const navigateMonth = (direction: 'prev' | 'next') => {
  const toValue = direction === 'next' ? -1 : 1;
  Animated.sequence([
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }),
  ]).start();
};
```

**Day Selection Animation:**
```typescript
// Scale + Ripple effect
const dayScale = useRef(new Animated.Value(1)).current;

const selectDay = (day: number) => {
  Animated.spring(dayScale, {
    toValue: 1.2,
    useNativeDriver: true,
  }).start();
};
```

**Meal Card Animation:**
```typescript
// Staggered entry for meal cards
const mealAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  meals.forEach((_, index) => {
    Animated.timing(mealAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  });
}, [meals]);
```

---

### 1.8 ProfileScreen

**Menu Item Animation:**
```typescript
// Staggered slide in
const menuAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  menuItems.forEach((_, index) => {
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  });
}, []);
```

**Logout Button Animation:**
```typescript
// Shake on press
const shakeAnim = useRef(new Animated.Value(0)).current;

const handleLogout = () => {
  Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]).start();
};
```

---

### 1.9 FoodDetailScreen

**Hero Image Animation:**
```typescript
// Parallax effect on scroll
const scrollY = useRef(new Animated.Value(0)).current;

const imageScale = scrollY.interpolate({
  inputRange: [-200, 0],
  outputRange: [1.2, 1],
  extrapolate: 'clamp',
});

const imageOpacity = scrollY.interpolate({
  inputRange: [0, 200],
  outputRange: [1, 0],
  extrapolate: 'clamp',
});
```

**Content Animation:**
```typescript
// Staggered fade in
const contentAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(contentAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();
}, []);
```

---

## 2. Tab Navigation Animations

### 2.1 Tab Bar Icon Animations

**Icon Scale on Focus:**
```typescript
// In AppNavigator.tsx
tabBarIcon: ({ color, focused }) => (
  <Animated.View
    style={{
      transform: [{
        scale: focused ? 1 : 0.8,
      }],
    }}
  >
    <MaterialIcons
      name="home"
      size={24}
      color={color}
    />
  </Animated.View>
)
```

**Icon Morphing (for Favourites tab):**
```typescript
// Heart border → Heart filled transition
tabBarIcon: ({ color, focused }) => (
  <Animated.View>
    {focused ? (
      <Animated.View
        style={{
          transform: [{ scale: heartScale }],
        }}
      >
        <MaterialIcons name="favorite" size={24} color={color} />
      </Animated.View>
    ) : (
      <MaterialIcons name="favorite-border" size={24} color={color} />
    )}
  </Animated.View>
)
```

**Center Tab (RandomWheel) Floating Animation:**
```typescript
// Already implemented - enhance with:
const floatAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatAnim, {
        toValue: -5,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]),
  ).start();
}, []);
```

---

### 2.2 Tab Transition Animations

**Screen Transition Config:**
```typescript
// In AppNavigator.tsx
<Stack.Navigator
  screenOptions={{
    headerShown: false,
    animation: 'slide_from_right',
    animationTypeForReplace: 'push',
    gestureEnabled: true,
    gestureDirection: 'horizontal',
  }}
>
```

**Custom Tab Transition:**
```typescript
// Fade + Scale transition
const TabTransition = ({ current, next, layouts }) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.9, 1, 0.9],
  });

  return (
    <Animated.View
      style={[
        { flex: 1 },
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      {current}
    </Animated.View>
  );
};
```

---

## 3. Icon Animations

### 3.1 Icon State Transitions

**Favourite Icon Animation:**
```typescript
// Scale + Color transition
const favAnim = useRef(new Animated.Value(0)).current;

const toggleFavourite = () => {
  const toValue = isFavourite ? 1 : 0;
  Animated.spring(favAnim, {
    toValue,
    tension: 200,
    friction: 7,
    useNativeDriver: true,
  }).start();
};

const scale = favAnim.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: [1, 1.3, 1],
});

const color = favAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [theme.colors.textSecondary, theme.colors.heart],
});
```

**Search Icon Animation:**
```typescript
// Rotate + Scale on focus
const searchAnim = useRef(new Animated.Value(0)).current;

const handleFocus = () => {
  Animated.spring(searchAnim, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};

const rotation = searchAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '90deg'],
});
```

**Menu Icon Animation:**
```typescript
// Hamburger → X transition
const menuAnim = useRef(new Animated.Value(0)).current;

const toggleMenu = () => {
  Animated.spring(menuAnim, {
    toValue: showMenu ? 1 : 0,
    useNativeDriver: true,
  }).start();
};

// Top line rotation
const topLineRotation = menuAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '45deg'],
});

// Bottom line rotation
const bottomLineRotation = menuAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '-45deg'],
});
```

---

### 3.2 Loading Animations

**Spinner Animation:**
```typescript
const spinAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();
}, []);

const rotation = spinAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});
```

**Pulse Animation:**
```typescript
const pulseAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]),
  ).start();
}, []);

const scale = pulseAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [1, 1.1],
});

const opacity = pulseAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0.5, 1],
});
```

---

## 4. Micro-Interactions

### 4.1 Button Press Effects

**Ripple Effect:**
```typescript
const rippleAnim = useRef(new Animated.Value(0)).current;

const handlePressIn = (event) => {
  const { locationX, locationY } = event.nativeEvent;
  rippleAnim.setValue(0);
  Animated.timing(rippleAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();
};

const rippleScale = rippleAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 2],
});

const rippleOpacity = rippleAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0.3, 0],
});
```

**Scale Effect:**
```typescript
const buttonScale = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.spring(buttonScale, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.spring(buttonScale, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};
```

---

### 4.2 Card Hover/Press Effects

**Scale + Shadow:**
```typescript
const cardScale = useRef(new Animated.Value(1)).current;
const cardShadow = useRef(new Animated.Value(0)).current;

const handlePressIn = () => {
  Animated.parallel([
    Animated.spring(cardScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }),
    Animated.timing(cardShadow, {
      toValue: 1,
      useNativeDriver: false,
    }),
  ]).start();
};

const handlePressOut = () => {
  Animated.parallel([
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
    }),
    Animated.timing(cardShadow, {
      toValue: 0,
      useNativeDriver: false,
    }),
  ]).start();
};
```

---

### 4.3 Input Field Animations

**Label Float Animation:**
```typescript
const labelAnim = useRef(new Animated.Value(0)).current;

const handleFocus = () => {
  Animated.spring(labelAnim, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};

const labelTranslateY = labelAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0, -20],
});

const labelScale = labelAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [1, 0.8],
});
```

**Border Color Animation:**
```typescript
const borderAnim = useRef(new Animated.Value(0)).current;

const handleFocus = () => {
  Animated.timing(borderAnim, {
    toValue: 1,
    duration: 200,
    useNativeDriver: false,
  }).start();
};

const borderColor = borderAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [theme.colors.borderSubtle, theme.colors.primary],
});
```

---

## 5. Shared Animation Components

### 5.1 FadeIn Component

```typescript
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: any;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 300,
  delay = 0,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, style]}>
      {children}
    </Animated.View>
  );
};
```

### 5.2 SlideUp Component

```typescript
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface SlideUpProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  style?: any;
}

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  distance = 30,
  duration = 400,
  delay = 0,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};
```

### 5.3 ScaleIn Component

```typescript
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface ScaleInProps {
  children: React.ReactNode;
  from?: number;
  duration?: number;
  delay?: number;
  style?: any;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  from = 0.8,
  duration = 300,
  delay = 0,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};
```

### 5.4 Pulse Component

```typescript
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface PulseProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  style?: any;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  scale = 1.05,
  duration = 1000,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: scale,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, style]}>
      {children}
    </Animated.View>
  );
};
```

---

## 6. Animation Constants

```typescript
// src/utils/animations.ts
export const ANIMATION_CONFIG = {
  // Durations
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,

  // Easing
  EASE_IN: Easing.in(Easing.ease),
  EASE_OUT: Easing.out(Easing.ease),
  EASE_IN_OUT: Easing.inOut(Easing.ease),
  SPRING: {
    tension: 100,
    friction: 8,
  },
  BOUNCY: {
    tension: 50,
    friction: 7,
  },

  // Scales
  BUTTON_PRESS: 0.95,
  CARD_HOVER: 1.02,
  ICON_FOCUS: 1.1,

  // Opacity
  FADE_IN: 1,
  FADE_OUT: 0,
  FADE_PARTIAL: 0.5,
};

export const ANIMATION_DELAY = {
  STAGGER_FAST: 50,
  STAGGER_NORMAL: 100,
  STAGGER_SLOW: 150,
};
```

---

## 7. Implementation Priority

### Phase 1: Core Animations (High Impact)
1. ✅ RandomWheel slot machine (already done)
2. Tab bar icon transitions
3. Screen entry animations (fade + slide)
4. Button press effects

### Phase 2: Enhanced Interactions
1. Card hover/press effects
2. Input field focus animations
3. Favourite icon transitions
4. Horizontal scroll card animations

### Phase 3: Polish & Delight
1. Staggered list animations
2. Empty state animations
3. Progress bar animations
4. Micro-interactions (ripple, pulse)

### Phase 4: Advanced Effects
1. Parallax scrolling
2. Page transitions
3. Gesture-based animations
4. Shared element transitions

---

## 8. Performance Considerations

### Use Native Driver When Possible
```typescript
// ✅ Good - uses native driver
Animated.timing(opacity, {
  toValue: 1,
  useNativeDriver: true,
});

// ❌ Avoid - width/height not supported by native driver
Animated.timing(width, {
  toValue: 100,
  useNativeDriver: true, // This won't work!
});
```

### Avoid Layout Thrashing
```typescript
// ✅ Good - batch updates
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, useNativeDriver: true }),
  Animated.timing(scale, { toValue: 1, useNativeDriver: true }),
]).start();

// ❌ Avoid - sequential updates cause reflows
Animated.timing(opacity, { toValue: 1, useNativeDriver: true }).start(() => {
  Animated.timing(scale, { toValue: 1, useNativeDriver: true }).start();
});
```

### Clean Up Animations
```typescript
useEffect(() => {
  const animation = Animated.loop(
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
  );
  animation.start();

  return () => {
    animation.stop();
  };
}, []);
```

---

## 9. Theme Integration

### Animation Colors
```typescript
// In ThemeProvider
const animationColors = {
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

// Use in animations
const colorAnim = useRef(new Animated.Value(0)).current;

const interpolatedColor = colorAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [animationColors.primary, animationColors.secondary],
});
```

---

## 10. Testing Animations

### Animation Testing Checklist
- [ ] Animations don't cause layout shifts
- [ ] Animations respect reduced motion settings
- [ ] Animations are performant (60fps)
- [ ] Animations can be interrupted
- [ ] Animations clean up properly on unmount
- [ ] Animations work in both light and dark themes

### Reduced Motion Support
```typescript
import { useAccessibilityInfo } from 'react-native';

const isReduceMotionEnabled = useAccessibilityInfo().isReduceMotionEnabled;

const animationDuration = isReduceMotionEnabled ? 0 : 300;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: animationDuration,
  useNativeDriver: true,
}).start();
```

---

## Summary

This animation plan provides a comprehensive guide for implementing smooth, performant animations throughout the LuckyFood app. The animations are organized by screen, component, and interaction type, with code examples and implementation priorities.

Key principles:
1. **Performance first** - Use native driver whenever possible
2. **Delightful but not distracting** - Subtle animations enhance UX
3. **Consistent timing** - Use shared animation constants
4. **Respect accessibility** - Support reduced motion settings
5. **Clean up properly** - Stop animations on unmount

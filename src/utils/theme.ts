// Font family - Quicksand for lovely, feminine look
export const fontFamily = {
  display: 'Quicksand',
  body: 'Quicksand',
} as const;

// Light mode colors - white/black base with pastel pink
export const lightColors = {
  // Primary - soft pink pastel
  primary: '#FF8BA7',
  primaryLight: '#FFB3C1',
  primaryDark: '#E66A85',
  primaryContainer: '#FFE5EC',

  // Secondary - soft lavender
  secondary: '#A8D8EA',
  secondaryLight: '#C5E8F5',
  secondaryDark: '#8BC4D8',
  secondaryContainer: '#E8F4F8',

  // Tertiary - soft mint
  tertiary: '#95E1D3',
  tertiaryLight: '#B8F0E6',
  tertiaryDark: '#7AC9BC',
  tertiaryContainer: '#E8F9F6',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#FFFBFB',
  surfaceVariant: '#FFF0F3',

  // Text
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9B9B9B',

  // Borders
  border: '#E8E8E8',
  borderSubtle: 'rgba(26, 26, 26, 0.08)',
  borderLight: 'rgba(255, 139, 167, 0.2)',

  // Status
  success: '#95E1D3',
  warning: '#FFD93D',
  error: '#FF6B6B',
  errorContainer: '#FFE5E5',
  onErrorContainer: '#C92A2A',

  // Special - heart red for favorites
  heart: '#FF6B6B',
  heartLight: '#FF8E8E',
} as const;

// Dark mode colors - dark background with pastel pink accents
export const darkColors = {
  // Primary - pastel pink (same as light for consistency)
  primary: '#FF8BA7',
  primaryLight: '#FFB3C1',
  primaryDark: '#E66A85',
  primaryContainer: '#3D2A30',

  // Secondary - soft lavender
  secondary: '#A8D8EA',
  secondaryLight: '#C5E8F5',
  secondaryDark: '#8BC4D8',
  secondaryContainer: '#2A3A40',

  // Tertiary - soft mint
  tertiary: '#95E1D3',
  tertiaryLight: '#B8F0E6',
  tertiaryDark: '#7AC9BC',
  tertiaryContainer: '#2A4038',

  // Backgrounds
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2A2A2A',

  // Text
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#707070',

  // Borders
  border: '#333333',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 139, 167, 0.3)',

  // Status
  success: '#95E1D3',
  warning: '#FFD93D',
  error: '#FF6B6B',
  errorContainer: '#3D2A2A',
  onErrorContainer: '#FF8E8E',

  // Special - heart red for favorites
  heart: '#FF6B6B',
  heartLight: '#FF8E8E',
} as const;

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const;

export const typography = {
  families: fontFamily,
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 36,
    xxxl: 48,
  } as const,
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export const shadows = {
  light: {
    small: {
      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000000',
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  },
} as const;

// Export default theme (light mode) - for backward compatibility
export const theme = {
  colors: lightColors,
  spacing,
  typography,
  borderRadius,
  shadows: shadows.light,
  isDark: false,
};

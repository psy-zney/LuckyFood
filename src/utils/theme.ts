export const theme = {
  colors: {
    primary: '#FF6B6B', // Red-ish for food
    secondary: '#4ECDC4', // Teal for accents
    background: '#F7F9FC',
    surface: '#FFFFFF',
    text: '#2D3436',
    textSecondary: '#636E72',
    border: '#DFE6E9',
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#D63031',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    round: 9999,
  },
};

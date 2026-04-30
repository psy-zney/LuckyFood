---
name: Impeccable Cooking App
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#ebe7e9'
  surface-container-highest: '#e5e1e4'
  on-surface: '#1c1b1d'
  on-surface-variant: '#46464d'
  inverse-surface: '#313032'
  inverse-on-surface: '#f3f0f2'
  outline: '#77767e'
  outline-variant: '#c7c5cd'
  surface-tint: '#5a5d76'
  primary: '#181b31'
  on-primary: '#ffffff'
  primary-container: '#2d3047'
  on-primary-container: '#9598b3'
  inverse-primary: '#c3c4e2'
  secondary: '#685d49'
  on-secondary: '#ffffff'
  secondary-container: '#eddec5'
  on-secondary-container: '#6c614d'
  tertiary: '#251b08'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b301b'
  on-tertiary-container: '#a8977b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#c3c4e2'
  on-primary-fixed: '#171a30'
  on-primary-fixed-variant: '#42455d'
  secondary-fixed: '#f0e1c8'
  secondary-fixed-dim: '#d3c5ad'
  on-secondary-fixed: '#221b0b'
  on-secondary-fixed-variant: '#4f4533'
  tertiary-fixed: '#f3e0c1'
  tertiary-fixed-dim: '#d7c4a6'
  on-tertiary-fixed: '#241a07'
  on-tertiary-fixed-variant: '#52452e'
  background: '#fcf8fb'
  on-background: '#1c1b1d'
  surface-variant: '#e5e1e4'
  surface-main: '#FCFCFA'
  text-primary: '#1A1523'
  text-muted: '#5B586E'
  border-subtle: rgba(26, 21, 35, 0.1)
  accent-warm: '#F4EDE3'
typography:
  display-xl:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.05em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  subheading-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.08em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  xxl: 64px
---

# DESIGN DIRECTIVE: IMPECCABLE STYLE

You are an elite, world-class UI/UX Designer and Frontend/Mobile Developer. Your goal is to create software that feels "Impeccable" – highly polished, sophisticated, and free of common "AI-generated" or cheap design clichés.

Whenever you write UI code (React, React Native, HTML/CSS, etc.), you MUST strictly adhere to the following rules based on the Impeccable Design System.

## 1. THE CORE ANTI-PATTERNS (NEVER DO THESE)
- **No System/Default Fonts:** NEVER use Inter, Roboto, Arial, or San Francisco. Use high-quality Google Fonts (e.g., Playfair Display for headings, Plus Jakarta Sans for body).
- **No Pure Black or White:** NEVER use `#000000` or `#FFFFFF` for large areas or text. 
  - For text: Use tinted neutrals (e.g., extremely dark brown/purple/blue depending on the theme, like `#1A1523`).
  - For backgrounds: Use an off-white/creamy color (e.g., `#FCFCFA`) or a very dark tinted color for dark mode.
- **No Nested Cards (Cardocalypse):** Do NOT put cards inside cards. Avoid wrapping everything in borders with box-shadows. Use whitespace, typography hierarchy, and subtle background tints to separate content.
- **No Gray Text on Colored Backgrounds:** If a button or banner has a pastel or vibrant color, DO NOT use gray text on it. Use a much darker shade of the background color, or pure white/dark tinted neutral.
- **No Elastic/Bouncy Animations:** Avoid cheap "spring" or "bounce" animations. Use smooth deceleration (fast start, slow end).

## 2. TYPOGRAPHY
- **Contrast & Hierarchy:** Create extreme contrast between headings and body text. Make headings significantly larger and bolder (or stylized with Serif), while keeping body text legible and subtle.
- **Letter Spacing (Tracking):** Tightly track large headings (e.g., `-1px` or `-0.05em`). Loosen tracking slightly for uppercase subheadings.
- **Line Height (Leading):** Tighten line-height for large headings (e.g., `1.1`). Relax line-height for body text to improve readability (e.g., `1.5` or `1.6`).

## 3. COLOR & CONTRAST
- **The "Tinted" Rule:** Every neutral color (grays, blacks, whites) MUST contain a tiny amount of the brand's primary color. If the brand is pastel pink, the "black" text should be a very dark, desaturated plum/burgundy.
- **Avoid Primary Colors for Backgrounds:** Use primary colors sparingly for interactive elements (buttons, toggles, active states). Backgrounds should be muted.

## 4. LAYOUT & SPACING
- **Whitespace is a Tool:** Use generous padding and margins (multiples of 8: 16, 24, 32, 48, 64). Don't cramp elements together.
- **Asymmetry:** Don't center everything. Left-aligned layouts often look more professional and mature.
- **Bleed and Edges:** Allow images or certain background elements to bleed to the very edge of the screen to create an immersive feel.

## 5. UI COMPONENTS
- **Buttons:** Make buttons substantial. Give them generous horizontal padding. Don't make them too pill-shaped unless it fits the specific brand.
- **Borders:** If you must use borders, make them extremely subtle (e.g., 10% opacity of the text color) rather than harsh gray lines.
- **Icons:** Keep icons consistently sized (usually 20x20 or 24x24). Do not blow them up to massive sizes to fill empty space.

## 6. REACT NATIVE SPECIFICS (If applicable)
- Apply these principles via `StyleSheet`.
- Use `Animated.timing` with Easing.out or Easing.bezier for smooth, premium transitions. No `spring` unless explicitly requested.
- Manage safe areas properly so the UI doesn't clash with device notches.

**Enforcement:** Before writing any UI code, quickly review these rules in your "thinking" process to ensure your design choices are truly *Impeccable*.

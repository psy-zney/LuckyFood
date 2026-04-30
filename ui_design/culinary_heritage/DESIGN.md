---
name: Culinary Heritage
colors:
  surface: '#fff8f7'
  surface-dim: '#e0d8d8'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2f1'
  surface-container: '#f4eceb'
  surface-container-high: '#eee6e6'
  surface-container-highest: '#e8e1e0'
  on-surface: '#1e1b1b'
  on-surface-variant: '#4f4444'
  inverse-surface: '#33302f'
  inverse-on-surface: '#f7efee'
  outline: '#817474'
  outline-variant: '#d3c3c2'
  surface-tint: '#735858'
  primary: '#735858'
  on-primary: '#ffffff'
  primary-container: '#f4d0d0'
  on-primary-container: '#725758'
  inverse-primary: '#e1bebe'
  secondary: '#6c5b50'
  on-secondary: '#ffffff'
  secondary-container: '#f5ded0'
  on-secondary-container: '#726156'
  tertiary: '#715858'
  on-tertiary: '#ffffff'
  tertiary-container: '#f2d1d1'
  on-tertiary-container: '#715858'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fedada'
  primary-fixed-dim: '#e1bebe'
  on-primary-fixed: '#2a1617'
  on-primary-fixed-variant: '#594041'
  secondary-fixed: '#f5ded0'
  secondary-fixed-dim: '#d8c2b5'
  on-secondary-fixed: '#251911'
  on-secondary-fixed-variant: '#53443a'
  tertiary-fixed: '#fddbda'
  tertiary-fixed-dim: '#dfbfbf'
  on-tertiary-fixed: '#291717'
  on-tertiary-fixed-variant: '#584141'
  background: '#fff8f7'
  on-background: '#1e1b1b'
  surface-variant: '#e8e1e0'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-margin: 32px
  gutter: 24px
---

## Brand & Style

The brand personality is a synthesis of traditional editorial elegance and modern functional minimalism. It targets a discerning audience that views cooking as an act of self-care and artistic expression. The UI must evoke a sense of calm, organized luxury, reminiscent of a high-end physical cookbook or a boutique culinary magazine.

The design style is **Minimalist Editorial**. It prioritizes extreme clarity and generous whitespace to allow food photography to remain the focal point. By avoiding pure blacks and whites, the interface achieves a "printed" quality that feels softer and more expensive. There is a total rejection of complex containers or nested cards; the hierarchy is instead established through masterful typography, subtle tonal shifts, and intentional negative space.

## Colors

This design system utilizes a warm, tinted palette to avoid the sterile feel of digital interfaces. 

*   **Backgrounds:** The primary canvas is a creamy off-white (#FCFCFA). It provides a soft foundation that complements food imagery without the harshness of pure white.
*   **Typography:** All text is set in a deeply tinted plum-brown (#1A1523). This provides high legibility while maintaining a sophisticated, organic warmth.
*   **Accents:** A palette of soft feminine pastels—Blush Pink, Peach, and Dusty Rose—is used sparingly for interactive elements, progress indicators, and categorical highlights. These are never used as heavy backgrounds, but rather as delicate washes or strokes.

## Typography

Typography is the primary structural element of this design system. 

*   **Headings:** Newsreader is utilized for its literary, high-end feel. It should be used for recipe titles, section headers, and quotes. Its italic variant is encouraged for secondary emphasis within titles.
*   **Body:** Plus Jakarta Sans provides a clean, modern counterpoint. Its open counters ensure readability during active cooking sessions.
*   **Labels:** Small caps or increased letter spacing should be applied to Plus Jakarta Sans when used for metadata (e.g., "PREP TIME," "CALORIES") to distinguish it from body text.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. The main content area respects a generous 32px side margin on mobile, expanding to a maximum readable width on larger screens. 

Spacing is strictly governed by a 4px/8px baseline grid. To achieve the "high-end" aesthetic, the design system mandates significantly larger vertical margins than traditional apps (e.g., 80px between major sections). Elements should feel like they have room to breathe, preventing the interface from feeling cluttered or utilitarian.

## Elevation & Depth

To maintain the minimalist and non-nested aesthetic, this design system avoids traditional box-shadows. Depth is achieved through **Tonal Layering** and **Soft Diffusion**.

*   **Tonal Layers:** Interactions (like a pressed state) are indicated by subtle shifts in background color (e.g., from Cream #FCFCFA to a very pale Peach #FDF5F0) rather than an elevation rise.
*   **Soft Outlines:** If a boundary is strictly necessary, use a 1px solid stroke in a color only 5% darker than the background.
*   **Image Depth:** Depth is primarily introduced through photography. Images should have slightly softened corners to match the UI language, but no drop shadows.

## Shapes

The shape language is "Rounded" to evoke a soft, organic, and approachable feel. 

*   **Containers/Images:** Use 1rem (16px) for standard images and large containers.
*   **Interactive Elements:** Buttons and input fields use a consistent 0.5rem (8px) radius. 
*   **Micro-elements:** Tags and chips use a full pill-shape (32px) to differentiate them from functional inputs.

## Components

*   **Buttons:** Primary buttons are solid Blush Pink with Dark Plum text. Secondary buttons are transparent with a thin Plum-tinted border. No heavy shadows; use a slight color darken on hover.
*   **Chips/Tags:** Used for dietary restrictions or cooking methods. Use a subtle Peach wash (#F8E1D3) with no border.
*   **Lists:** Recipe steps and ingredients should be separated by generous 24px vertical padding and a very faint horizontal rule (#F0EEE9). Avoid boxed list items.
*   **Input Fields:** Ghost-style inputs with only a bottom border or a very subtle tinted background fill. Focused states use a Dusty Rose bottom border (2px).
*   **Cards:** As nested cards are forbidden, "cards" in this system are defined by their content arrangement and whitespace. A recipe "card" is a full-bleed image followed by a headline and metadata, separated from the next item by a 48px gap.
*   **Measurement Toggle:** A custom component for switching between Metric and Imperial units, using a soft pill-shaped toggle with a pastel sliding indicator.
*   **Ingredients List:** Features a subtle "strikethrough" animation that changes the text color to a muted gray-plum when an item is checked.
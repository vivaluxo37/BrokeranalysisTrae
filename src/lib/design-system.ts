/**
 * Design System Constants and Utilities
 * 
 * This file contains TypeScript constants and utilities for the BrokerAnalysis
 * professional design system, ensuring consistent styling across all components.
 */

// =============================================================================
// DESIGN TOKENS
// =============================================================================

/**
 * Professional Color Palette
 * Based on the established monochromatic design system
 */
export const colors = {
  // Core Professional Colors
  professional: {
    black: '#000000',
    charcoal: '#1a1a1a',
    mediumGrey: '#404040',
    lightGrey: '#d1d5db',
    mutedText: '#9ca3af',
    pureWhite: '#ffffff',
    offWhite: '#f5f5f5',
    subtleAccent: '#e5e5e5',
  },
  
  // Semantic Colors
  semantic: {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#3b82f6',
  },
  
  // Interactive States
  interactive: {
    hover: 'rgba(255, 255, 255, 0.05)',
    focus: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(255, 255, 255, 0.15)',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Chart Colors (Monochromatic)
  chart: {
    primary: '#ffffff',
    secondary: '#d4d4d4',
    tertiary: '#a3a3a3',
    quaternary: '#737373',
    quinary: '#525252',
  },
} as const;

/**
 * Typography Scale
 * Responsive typography with clamp functions for fluid scaling
 */
export const typography = {
  // Font Families
  fonts: {
    primary: "'Inter', system-ui, -apple-system, sans-serif",
    heading: "'Space Grotesk', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  
  // Font Sizes (using clamp for responsive scaling)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    hero: 'clamp(3rem, 8vw, 5rem)',
    sectionTitle: 'clamp(2rem, 5vw, 3.5rem)',
    subtitle: 'clamp(1.125rem, 2vw, 1.25rem)',
  },
  
  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/**
 * Spacing Scale
 * Consistent spacing values based on 4px grid system
 */
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

/**
 * Border Radius Scale
 */
export const borderRadius = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

/**
 * Breakpoints for Responsive Design
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Z-Index Scale
 */
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

/**
 * Animation Durations and Easing
 */
export const animation = {
  durations: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ColorKey = keyof typeof colors.professional;
export type SemanticColorKey = keyof typeof colors.semantic;
export type TypographySizeKey = keyof typeof typography.sizes;
export type TypographyWeightKey = keyof typeof typography.weights;
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type BreakpointKey = keyof typeof breakpoints;
export type ZIndexKey = keyof typeof zIndex;

/**
 * Component Variant Types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type CardVariant = 'default' | 'featured' | 'compact' | 'interactive';
export type InputVariant = 'default' | 'error' | 'success';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get color value by key
 */
export function getColor(key: ColorKey): string {
  return colors.professional[key];
}

/**
 * Get semantic color value by key
 */
export function getSemanticColor(key: SemanticColorKey): string {
  return colors.semantic[key];
}

/**
 * Get spacing value by key
 */
export function getSpacing(key: SpacingKey): string {
  return spacing[key];
}

/**
 * Get typography size by key
 */
export function getTypographySize(key: TypographySizeKey): string {
  return typography.sizes[key];
}

/**
 * Create responsive breakpoint media query
 */
export function createMediaQuery(breakpoint: BreakpointKey): string {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
}

/**
 * Generate CSS custom properties for theme
 */
export function generateCSSCustomProperties(): Record<string, string> {
  const properties: Record<string, string> = {};
  
  // Add color properties
  Object.entries(colors.professional).forEach(([key, value]) => {
    properties[`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
  });
  
  // Add semantic color properties
  Object.entries(colors.semantic).forEach(([key, value]) => {
    properties[`--color-${key}`] = value;
  });
  
  // Add spacing properties
  Object.entries(spacing).forEach(([key, value]) => {
    properties[`--spacing-${key}`] = value;
  });
  
  return properties;
}

/**
 * Component Style Generators
 */
export const componentStyles = {
  /**
   * Generate button styles based on variant and size
   */
  button: (variant: ButtonVariant, size: ButtonSize) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      borderRadius: borderRadius.md,
      fontWeight: typography.weights.medium,
      transition: `all ${animation.durations.normal} ${animation.easing.easeOut}`,
      cursor: 'pointer',
      border: 'none',
      textDecoration: 'none',
      outline: 'none',
      userSelect: 'none',
    };
    
    const sizeStyles = {
      sm: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.sizes.sm,
        minHeight: spacing[8],
      },
      md: {
        padding: `${spacing[3]} ${spacing[6]}`,
        fontSize: typography.sizes.base,
        minHeight: spacing[10],
      },
      lg: {
        padding: `${spacing[4]} ${spacing[8]}`,
        fontSize: typography.sizes.lg,
        minHeight: spacing[12],
      },
    };
    
    const variantStyles = {
      primary: {
        backgroundColor: colors.professional.pureWhite,
        color: colors.professional.black,
        '&:hover': {
          backgroundColor: colors.professional.offWhite,
          transform: 'translateY(-1px)',
        },
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.interactive.focus}`,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.professional.pureWhite,
        border: `1px solid ${colors.professional.mediumGrey}`,
        '&:hover': {
          borderColor: colors.professional.pureWhite,
          backgroundColor: colors.interactive.hover,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.professional.pureWhite,
        border: `1px solid ${colors.professional.lightGrey}`,
        '&:hover': {
          backgroundColor: colors.professional.pureWhite,
          color: colors.professional.black,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.professional.lightGrey,
        '&:hover': {
          backgroundColor: colors.interactive.hover,
          color: colors.professional.pureWhite,
        },
      },
      destructive: {
        backgroundColor: colors.semantic.error,
        color: colors.professional.pureWhite,
        '&:hover': {
          backgroundColor: '#b91c1c',
        },
      },
    };
    
    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  },
  
  /**
   * Generate card styles based on variant
   */
  card: (variant: CardVariant) => {
    const baseStyles = {
      backgroundColor: colors.professional.charcoal,
      border: `1px solid ${colors.professional.mediumGrey}`,
      borderRadius: borderRadius.lg,
      transition: `all ${animation.durations.normal} ${animation.easing.easeOut}`,
      height: '100%',
    };
    
    const variantStyles = {
      default: {},
      featured: {
        border: `2px solid ${colors.professional.lightGrey}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      compact: {
        padding: spacing[4],
      },
      interactive: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#1f1f1f',
          borderColor: colors.professional.lightGrey,
          transform: 'translateY(-1px)',
        },
      },
    };
    
    return {
      ...baseStyles,
      ...variantStyles[variant],
    };
  },
  
  /**
   * Generate input styles based on variant
   */
  input: (variant: InputVariant = 'default') => {
    const baseStyles = {
      backgroundColor: colors.professional.charcoal,
      border: `1px solid ${colors.professional.mediumGrey}`,
      borderRadius: borderRadius.md,
      padding: `${spacing[3]} ${spacing[4]}`,
      color: colors.professional.pureWhite,
      fontSize: typography.sizes.base,
      transition: `all ${animation.durations.normal} ${animation.easing.easeOut}`,
      outline: 'none',
      '&::placeholder': {
        color: colors.professional.lightGrey,
      },
      '&:focus': {
        borderColor: colors.professional.pureWhite,
        boxShadow: `0 0 0 3px ${colors.interactive.focus}`,
      },
    };
    
    const variantStyles = {
      default: {},
      error: {
        borderColor: colors.semantic.error,
        '&:focus': {
          borderColor: colors.semantic.error,
          boxShadow: `0 0 0 3px rgba(220, 38, 38, 0.1)`,
        },
      },
      success: {
        borderColor: colors.semantic.success,
        '&:focus': {
          borderColor: colors.semantic.success,
          boxShadow: `0 0 0 3px rgba(16, 185, 129, 0.1)`,
        },
      },
    };
    
    return {
      ...baseStyles,
      ...variantStyles[variant],
    };
  },
};

/**
 * Layout utilities
 */
export const layout = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing[6]}`,
  },
  
  section: {
    padding: `${spacing[20]} 0`,
  },
  
  hero: {
    padding: `${spacing[32]} 0`,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
  },
  
  grid: {
    display: 'grid',
    gap: spacing[6],
    alignItems: 'stretch',
  },
} as const;

/**
 * Accessibility utilities
 */
export const a11y = {
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  },
  
  focusVisible: {
    '&:focus-visible': {
      outline: `2px solid ${colors.professional.pureWhite}`,
      outlineOffset: '2px',
    },
  },
} as const;
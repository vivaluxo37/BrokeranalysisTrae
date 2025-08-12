/**
 * Theme Configuration
 * 
 * Centralized theme configuration with TypeScript types for the BrokerAnalysis
 * design system. This file provides theme switching capabilities and type-safe
 * theme access throughout the application.
 */

import { colors, typography, spacing, borderRadius, animation } from './design-system';

// =============================================================================
// THEME TYPES
// =============================================================================

export interface Theme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    // Professional colors
    professional: typeof colors.professional;
    semantic: typeof colors.semantic;
    interactive: typeof colors.interactive;
    chart: typeof colors.chart;
  };
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  animation: typeof animation;
}

// =============================================================================
// THEME DEFINITIONS
// =============================================================================

/**
 * Professional Dark Theme (Default)
 * The primary theme for the BrokerAnalysis platform
 */
export const professionalDarkTheme: Theme = {
  name: 'professional-dark',
  colors: {
    // Shadcn/ui compatible colors
    background: colors.professional.black,
    foreground: colors.professional.pureWhite,
    card: colors.professional.charcoal,
    cardForeground: colors.professional.pureWhite,
    popover: colors.professional.charcoal,
    popoverForeground: colors.professional.pureWhite,
    primary: colors.professional.pureWhite,
    primaryForeground: colors.professional.black,
    secondary: colors.professional.charcoal,
    secondaryForeground: colors.professional.pureWhite,
    muted: colors.professional.mediumGrey,
    mutedForeground: colors.professional.mutedText,
    accent: colors.professional.pureWhite,
    accentForeground: colors.professional.black,
    destructive: colors.semantic.error,
    destructiveForeground: colors.professional.pureWhite,
    border: colors.professional.mediumGrey,
    input: colors.professional.charcoal,
    ring: colors.professional.pureWhite,
    // Professional color system
    professional: colors.professional,
    semantic: colors.semantic,
    interactive: colors.interactive,
    chart: colors.chart,
  },
  typography,
  spacing,
  borderRadius,
  animation,
};

/**
 * Professional Light Theme (Alternative)
 * Light variant for accessibility or user preference
 */
export const professionalLightTheme: Theme = {
  name: 'professional-light',
  colors: {
    // Shadcn/ui compatible colors (inverted)
    background: colors.professional.pureWhite,
    foreground: colors.professional.black,
    card: colors.professional.offWhite,
    cardForeground: colors.professional.black,
    popover: colors.professional.offWhite,
    popoverForeground: colors.professional.black,
    primary: colors.professional.black,
    primaryForeground: colors.professional.pureWhite,
    secondary: colors.professional.subtleAccent,
    secondaryForeground: colors.professional.black,
    muted: colors.professional.lightGrey,
    mutedForeground: colors.professional.mediumGrey,
    accent: colors.professional.black,
    accentForeground: colors.professional.pureWhite,
    destructive: colors.semantic.error,
    destructiveForeground: colors.professional.pureWhite,
    border: colors.professional.lightGrey,
    input: colors.professional.offWhite,
    ring: colors.professional.black,
    // Professional color system (adapted for light theme)
    professional: {
      black: colors.professional.pureWhite,
      charcoal: colors.professional.offWhite,
      mediumGrey: colors.professional.lightGrey,
      lightGrey: colors.professional.mediumGrey,
      mutedText: colors.professional.mediumGrey,
      pureWhite: colors.professional.black,
      offWhite: colors.professional.charcoal,
      subtleAccent: colors.professional.lightGrey,
    },
    semantic: colors.semantic,
    interactive: {
      hover: 'rgba(0, 0, 0, 0.05)',
      focus: 'rgba(0, 0, 0, 0.1)',
      active: 'rgba(0, 0, 0, 0.15)',
      disabled: 'rgba(0, 0, 0, 0.3)',
    },
    chart: {
      primary: colors.professional.black,
      secondary: '#404040',
      tertiary: '#737373',
      quaternary: '#a3a3a3',
      quinary: '#d4d4d4',
    },
  },
  typography,
  spacing,
  borderRadius,
  animation,
};

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Available themes
 */
export const themes = {
  'professional-dark': professionalDarkTheme,
  'professional-light': professionalLightTheme,
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Default theme
 */
export const defaultTheme = professionalDarkTheme;

/**
 * Get theme by name
 */
export function getTheme(name: ThemeName): Theme {
  return themes[name];
}

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(theme: Theme): Record<string, string> {
  return {
    // Shadcn/ui compatible properties
    '--background': theme.colors.background,
    '--foreground': theme.colors.foreground,
    '--card': theme.colors.card,
    '--card-foreground': theme.colors.cardForeground,
    '--popover': theme.colors.popover,
    '--popover-foreground': theme.colors.popoverForeground,
    '--primary': theme.colors.primary,
    '--primary-foreground': theme.colors.primaryForeground,
    '--secondary': theme.colors.secondary,
    '--secondary-foreground': theme.colors.secondaryForeground,
    '--muted': theme.colors.muted,
    '--muted-foreground': theme.colors.mutedForeground,
    '--accent': theme.colors.accent,
    '--accent-foreground': theme.colors.accentForeground,
    '--destructive': theme.colors.destructive,
    '--destructive-foreground': theme.colors.destructiveForeground,
    '--border': theme.colors.border,
    '--input': theme.colors.input,
    '--ring': theme.colors.ring,
    
    // Professional color properties
    '--professional-black': theme.colors.professional.black,
    '--charcoal-grey': theme.colors.professional.charcoal,
    '--medium-grey': theme.colors.professional.mediumGrey,
    '--light-grey': theme.colors.professional.lightGrey,
    '--muted-text': theme.colors.professional.mutedText,
    '--pure-white': theme.colors.professional.pureWhite,
    '--off-white': theme.colors.professional.offWhite,
    '--subtle-accent': theme.colors.professional.subtleAccent,
    
    // Semantic color properties
    '--color-primary': theme.colors.semantic.primary,
    '--color-success': theme.colors.semantic.success,
    '--color-warning': theme.colors.semantic.warning,
    '--color-error': theme.colors.semantic.error,
    '--color-info': theme.colors.semantic.info,
    
    // Interactive state properties
    '--interactive-hover': theme.colors.interactive.hover,
    '--interactive-focus': theme.colors.interactive.focus,
    '--interactive-active': theme.colors.interactive.active,
    '--interactive-disabled': theme.colors.interactive.disabled,
    
    // Chart color properties
    '--chart-1': theme.colors.chart.primary,
    '--chart-2': theme.colors.chart.secondary,
    '--chart-3': theme.colors.chart.tertiary,
    '--chart-4': theme.colors.chart.quaternary,
    '--chart-5': theme.colors.chart.quinary,
    
    // Border radius
    '--radius': '8px',
    '--radius-sm': 'calc(var(--radius) - 4px)',
    '--radius-md': 'calc(var(--radius) - 2px)',
    '--radius-lg': 'var(--radius)',
    '--radius-xl': 'calc(var(--radius) + 4px)',
  };
}

/**
 * Apply theme to document root
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const cssProperties = generateThemeCSS(theme);
  
  Object.entries(cssProperties).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Update data attribute for CSS selectors
  root.setAttribute('data-theme', theme.name);
}

/**
 * Theme context type for React context
 */
export interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
}

/**
 * Get system theme preference
 */
export function getSystemTheme(): ThemeName {
  if (typeof window === 'undefined') return 'professional-dark';
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  return mediaQuery.matches ? 'professional-light' : 'professional-dark';
}

/**
 * Get stored theme preference
 */
export function getStoredTheme(): ThemeName | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('broker-analysis-theme');
  return stored && stored in themes ? (stored as ThemeName) : null;
}

/**
 * Store theme preference
 */
export function storeTheme(name: ThemeName): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('broker-analysis-theme', name);
}

/**
 * Get initial theme (stored > system > default)
 */
export function getInitialTheme(): ThemeName {
  return getStoredTheme() || getSystemTheme();
}

// =============================================================================
// THEME VALIDATION
// =============================================================================

/**
 * Validate theme structure
 */
export function validateTheme(theme: unknown): theme is Theme {
  if (!theme || typeof theme !== 'object') return false;
  
  const t = theme as any;
  
  return (
    typeof t.name === 'string' &&
    t.colors &&
    typeof t.colors === 'object' &&
    t.typography &&
    typeof t.typography === 'object' &&
    t.spacing &&
    typeof t.spacing === 'object' &&
    t.borderRadius &&
    typeof t.borderRadius === 'object' &&
    t.animation &&
    typeof t.animation === 'object'
  );
}

/**
 * Ensure theme compatibility with current version
 */
export function ensureThemeCompatibility(theme: Theme): Theme {
  // Add any theme migration logic here if needed in the future
  return theme;
}

/**
 * Design System Type Declarations
 * 
 * TypeScript declarations for the BrokerAnalysis design system.
 * These types ensure type safety when using design system utilities
 * throughout the application.
 */

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

// Extend the global CSS custom properties interface
declare global {
  interface CSSStyleDeclaration {
    // Professional color properties
    '--professional-black': string;
    '--charcoal-grey': string;
    '--medium-grey': string;
    '--light-grey': string;
    '--muted-text': string;
    '--pure-white': string;
    '--off-white': string;
    '--subtle-accent': string;
    
    // Semantic color properties
    '--color-primary': string;
    '--color-success': string;
    '--color-warning': string;
    '--color-error': string;
    '--color-info': string;
    
    // Interactive state properties
    '--interactive-hover': string;
    '--interactive-focus': string;
    '--interactive-active': string;
    '--interactive-disabled': string;
    
    // Chart color properties
    '--chart-1': string;
    '--chart-2': string;
    '--chart-3': string;
    '--chart-4': string;
    '--chart-5': string;
    
    // Shadcn/ui compatible properties
    '--background': string;
    '--foreground': string;
    '--card': string;
    '--card-foreground': string;
    '--popover': string;
    '--popover-foreground': string;
    '--primary': string;
    '--primary-foreground': string;
    '--secondary': string;
    '--secondary-foreground': string;
    '--muted': string;
    '--muted-foreground': string;
    '--accent': string;
    '--accent-foreground': string;
    '--destructive': string;
    '--destructive-foreground': string;
    '--border': string;
    '--input': string;
    '--ring': string;
    
    // Border radius properties
    '--radius': string;
    '--radius-sm': string;
    '--radius-md': string;
    '--radius-lg': string;
    '--radius-xl': string;
  }
}

// Extend HTMLElement to include data attributes
declare global {
  interface HTMLElement {
    'data-theme'?: string;
    'data-variant'?: string;
    'data-size'?: string;
    'data-state'?: string;
  }
}

// CSS-in-JS style object type
export interface StyleObject {
  [key: string]: string | number | StyleObject;
}

// Component style props interface
export interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
}

// Responsive style configuration
export interface ResponsiveStyleConfig {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}

// Animation configuration
export interface AnimationConfig {
  duration?: string;
  easing?: string;
  delay?: string;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Theme-aware component props
export interface ThemeAwareProps {
  theme?: 'professional-dark' | 'professional-light';
  variant?: string;
  size?: string;
}

// Design token interfaces
export interface ColorToken {
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  950?: string;
}

export interface TypographyToken {
  fontSize: string;
  lineHeight: string;
  fontWeight?: string;
  letterSpacing?: string;
  fontFamily?: string;
}

export interface SpacingToken {
  [key: string]: string;
}

export interface BorderRadiusToken {
  [key: string]: string;
}

// Component variant interfaces
export interface ButtonVariants {
  variant: {
    primary: string;
    secondary: string;
    outline: string;
    ghost: string;
    destructive: string;
  };
  size: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface CardVariants {
  variant: {
    default: string;
    featured: string;
    compact: string;
    interactive: string;
  };
}

export interface InputVariants {
  variant: {
    default: string;
    error: string;
    success: string;
  };
}

// Utility function types
export type ClassNameValue = string | number | boolean | undefined | null;
export type ClassNameArray = ClassNameValue[];
export type ClassNameObject = Record<string, any>;
export type ClassNameInput = ClassNameValue | ClassNameArray | ClassNameObject;

// Style utility function types
export type StyleUtilityFunction<T = any> = (...args: T[]) => string;
export type ResponsiveUtilityFunction = (config: ResponsiveStyleConfig) => string;
export type VariantUtilityFunction<V = string> = (variant: V, className?: string) => string;

// CSS custom property helpers
export interface CSSCustomProperties {
  [key: `--${string}`]: string | number;
}

// Media query helpers
export type MediaQueryBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type MediaQueryDirection = 'up' | 'down' | 'only';

// Design system configuration
export interface DesignSystemConfig {
  colors: Record<string, ColorToken | string>;
  typography: Record<string, TypographyToken>;
  spacing: SpacingToken;
  borderRadius: BorderRadiusToken;
  breakpoints: Record<MediaQueryBreakpoint, string>;
  zIndex: Record<string, number>;
  animation: {
    durations: Record<string, string>;
    easing: Record<string, string>;
  };
}

// Component style configuration
export interface ComponentStyleConfig {
  base: string;
  variants?: Record<string, Record<string, string>>;
  sizes?: Record<string, string>;
  states?: Record<string, string>;
}

// Theme configuration
export interface ThemeConfiguration {
  name: string;
  colors: Record<string, string>;
  typography: Record<string, TypographyToken>;
  spacing: SpacingToken;
  borderRadius: BorderRadiusToken;
  animation: {
    durations: Record<string, string>;
    easing: Record<string, string>;
  };
}

export {};
/**
 * Global Styles and Design System Exports
 * 
 * Central export point for all styling utilities, theme configuration,
 * and design system constants used throughout the BrokerAnalysis platform.
 */

// Design System Exports
export * from '../lib/design-system';
export * from '../lib/theme';
export * from '../lib/style-utils';

// Re-export commonly used utilities
export { cn } from '../lib/utils';

// Type exports for external consumption
export type {
  Theme,
  ThemeName,
  ThemeContextType,
} from '../lib/theme';

export type {
  ColorKey,
  SemanticColorKey,
  TypographySizeKey,
  TypographyWeightKey,
  SpacingKey,
  BorderRadiusKey,
  BreakpointKey,
  ZIndexKey,
  ButtonVariant,
  ButtonSize,
  CardVariant,
  InputVariant,
} from '../lib/design-system';

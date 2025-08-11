# Design System Documentation

This directory contains the core design system utilities and configuration for the BrokerAnalysis platform. The design system ensures consistent styling, theming, and user experience across all components and pages.

## Files Overview

### `design-system.ts`
Core design system constants and utilities including:
- **Color Palette**: Professional monochromatic colors with semantic variants
- **Typography Scale**: Responsive typography with clamp functions
- **Spacing System**: Consistent spacing based on 4px grid
- **Component Styles**: Utility functions for generating component styles
- **Layout Utilities**: Container, section, and grid configurations

### `theme.ts`
Theme configuration and management:
- **Theme Definitions**: Professional dark and light themes
- **Theme Utilities**: Functions for theme switching and CSS generation
- **Theme Context**: TypeScript interfaces for React theme context
- **Storage Utilities**: Local storage and system preference handling

### `style-utils.ts`
Utility functions for consistent styling:
- **Class Name Utilities**: Enhanced `cn()` function with Tailwind merge
- **Component Generators**: Functions for button, card, input, and navigation styles
- **Layout Utilities**: Container, section, hero, and grid class generators
- **Animation Utilities**: Fade-in, slide-up, and scale-in animations
- **Accessibility Utilities**: Screen reader, focus, and skip link utilities

### `utils.ts`
Core utility functions:
- **Class Name Merging**: `cn()` function combining clsx and tailwind-merge

## Usage Examples

### Basic Component Styling

```typescript
import { cn, buttonClasses, cardClasses } from '@/lib/style-utils';

// Button with variant and size
const buttonClass = buttonClasses('primary', 'md', 'custom-class');

// Card with interactive variant
const cardClass = cardClasses('interactive', 'hover:shadow-lg');

// Custom class combination
const customClass = cn(
  'flex items-center',
  'text-pure-white',
  'bg-professional-black'
);
```

### Theme Usage

```typescript
import { useTheme, applyTheme, professionalDarkTheme } from '@/lib/theme';

// Apply theme programmatically
applyTheme(professionalDarkTheme);

// In a React component
const { theme, setTheme } = useTheme();
```

### Design System Constants

```typescript
import { colors, typography, spacing } from '@/lib/design-system';

// Access design tokens
const primaryColor = colors.professional.pureWhite;
const headingFont = typography.fonts.heading;
const mediumSpacing = spacing[6];
```

### Responsive Utilities

```typescript
import { responsive, gridClasses } from '@/lib/style-utils';

// Responsive classes
const responsiveText = responsive({
  base: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
});

// Responsive grid
const gridClass = gridClasses(3); // 1 col mobile, 2 col tablet, 3 col desktop
```

## Design Tokens

### Colors

The design system uses a professional monochromatic palette:

- **Professional Black** (`#000000`): Primary background
- **Charcoal Grey** (`#1a1a1a`): Card backgrounds and elevated surfaces
- **Medium Grey** (`#404040`): Borders and dividers
- **Light Grey** (`#d1d5db`): Secondary text and inactive elements
- **Pure White** (`#ffffff`): Primary text and interactive elements

### Typography

Two primary font families:
- **Inter**: Body text and UI elements
- **Space Grotesk**: Headings and display text

Responsive sizing using `clamp()` functions for fluid scaling.

### Spacing

Based on a 4px grid system with consistent spacing values from `0.25rem` to `24rem`.

## Component Variants

### Buttons
- **Primary**: White background, black text
- **Secondary**: Transparent with border
- **Outline**: Transparent with light border
- **Ghost**: Transparent, minimal styling
- **Destructive**: Red background for dangerous actions

### Cards
- **Default**: Standard card styling
- **Featured**: Enhanced with stronger border and shadow
- **Compact**: Reduced padding for dense layouts
- **Interactive**: Hover effects and cursor pointer

### Inputs
- **Default**: Standard input styling
- **Error**: Red border for validation errors
- **Success**: Green border for successful validation

## Accessibility

The design system includes comprehensive accessibility utilities:

- **Focus Management**: Proper focus indicators and skip links
- **Screen Reader Support**: Screen reader only classes
- **Color Contrast**: WCAG 2.1 AA compliant color combinations
- **Keyboard Navigation**: Full keyboard accessibility support

## Performance

- **Tree Shaking**: All utilities are tree-shakeable
- **CSS-in-JS**: Minimal runtime overhead
- **Tailwind Integration**: Leverages Tailwind's optimization
- **Type Safety**: Full TypeScript support with strict typing

## Best Practices

1. **Use Design Tokens**: Always use design system constants instead of hardcoded values
2. **Component Utilities**: Prefer component utility functions over manual class combinations
3. **Responsive Design**: Use responsive utilities for mobile-first design
4. **Accessibility**: Include accessibility utilities in all interactive components
5. **Theme Awareness**: Design components to work with both light and dark themes

## Migration Guide

When updating existing components to use the design system:

1. Replace hardcoded colors with design system colors
2. Use component utility functions instead of manual Tailwind classes
3. Apply consistent spacing using the spacing scale
4. Ensure accessibility utilities are included
5. Test with both light and dark themes

## Contributing

When adding new design system utilities:

1. Follow existing naming conventions
2. Include comprehensive TypeScript types
3. Add JSDoc documentation
4. Ensure accessibility compliance
5. Test with all theme variants
6. Update this documentation

For questions or contributions, please refer to the main project documentation.
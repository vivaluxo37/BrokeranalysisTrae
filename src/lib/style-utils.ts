/**
 * Style Utilities
 * 
 * Utility functions for consistent styling patterns across the BrokerAnalysis
 * platform. These functions help maintain design system consistency and
 * provide reusable styling logic.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  animation,
  type ButtonVariant,
  type ButtonSize,
  type CardVariant,
  type InputVariant,
  componentStyles
} from './design-system';

// =============================================================================
// CORE UTILITIES
// =============================================================================

/**
 * Enhanced className utility with Tailwind merge
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create responsive class names based on breakpoints
 */
export function responsive(classes: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  const classNames: string[] = [];
  
  if (classes.base) classNames.push(classes.base);
  if (classes.sm) classNames.push(`sm:${classes.sm}`);
  if (classes.md) classNames.push(`md:${classes.md}`);
  if (classes.lg) classNames.push(`lg:${classes.lg}`);
  if (classes.xl) classNames.push(`xl:${classes.xl}`);
  if (classes['2xl']) classNames.push(`2xl:${classes['2xl']}`);
  
  return classNames.join(' ');
}

/**
 * Create hover state classes
 */
export function hover(classes: string): string {
  return `hover:${classes}`;
}

/**
 * Create focus state classes
 */
export function focus(classes: string): string {
  return `focus:${classes}`;
}

/**
 * Create active state classes
 */
export function active(classes: string): string {
  return `active:${classes}`;
}

/**
 * Create disabled state classes
 */
export function disabled(classes: string): string {
  return `disabled:${classes}`;
}

// =============================================================================
// COMPONENT STYLE GENERATORS
// =============================================================================

/**
 * Generate button classes based on variant and size
 */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
): string {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-md',
    'font-medium',
    'transition-all',
    'duration-200',
    'ease-out',
    'cursor-pointer',
    'border-0',
    'no-underline',
    'outline-none',
    'select-none',
    'focus-visible:outline-2',
    'focus-visible:outline-white',
    'focus-visible:outline-offset-2',
  ];
  
  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm', 'min-h-8'],
    md: ['px-6', 'py-3', 'text-base', 'min-h-10'],
    lg: ['px-8', 'py-4', 'text-lg', 'min-h-12'],
  };
  
  const variantClasses = {
    primary: [
      'bg-pure-white',
      'text-professional-black',
      hover('bg-off-white'),
      hover('transform'),
      hover('-translate-y-0.5'),
    ],
    secondary: [
      'bg-transparent',
      'text-pure-white',
      'border',
      'border-medium-grey',
      hover('border-pure-white'),
      hover('bg-white/5'),
    ],
    outline: [
      'bg-transparent',
      'text-pure-white',
      'border',
      'border-light-grey',
      hover('bg-pure-white'),
      hover('text-professional-black'),
    ],
    ghost: [
      'bg-transparent',
      'text-light-grey',
      hover('bg-white/5'),
      hover('text-pure-white'),
    ],
    destructive: [
      'bg-red-600',
      'text-pure-white',
      hover('bg-red-700'),
    ],
  };
  
  return cn(
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    className
  );
}

/**
 * Generate card classes based on variant
 */
export function cardClasses(
  variant: CardVariant = 'default',
  className?: string
): string {
  const baseClasses = [
    'bg-charcoal-grey',
    'border',
    'border-medium-grey',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'ease-out',
    'h-full',
  ];
  
  const variantClasses = {
    default: [],
    featured: [
      'border-2',
      'border-light-grey',
      'shadow-lg',
    ],
    compact: [
      'p-4',
    ],
    interactive: [
      'cursor-pointer',
      hover('bg-zinc-800'),
      hover('border-light-grey'),
      hover('transform'),
      hover('-translate-y-0.5'),
    ],
  };
  
  return cn(
    ...baseClasses,
    ...variantClasses[variant],
    className
  );
}

/**
 * Generate input classes based on variant
 */
export function inputClasses(
  variant: InputVariant = 'default',
  className?: string
): string {
  const baseClasses = [
    'bg-charcoal-grey',
    'border',
    'border-medium-grey',
    'rounded-md',
    'px-4',
    'py-3',
    'text-pure-white',
    'text-base',
    'transition-all',
    'duration-200',
    'ease-out',
    'outline-none',
    'placeholder:text-light-grey',
    focus('border-pure-white'),
    focus('ring-2'),
    focus('ring-white/10'),
  ];
  
  const variantClasses = {
    default: [],
    error: [
      'border-red-500',
      focus('border-red-500'),
      focus('ring-red-500/10'),
    ],
    success: [
      'border-green-500',
      focus('border-green-500'),
      focus('ring-green-500/10'),
    ],
  };
  
  return cn(
    ...baseClasses,
    ...variantClasses[variant],
    className
  );
}

/**
 * Generate navigation item classes
 */
export function navItemClasses(
  isActive: boolean = false,
  className?: string
): string {
  const baseClasses = [
    'text-light-grey',
    'no-underline',
    'px-4',
    'py-2',
    'rounded',
    'font-medium',
    'text-sm',
    'transition-all',
    'duration-200',
    'ease-out',
    hover('text-pure-white'),
    hover('bg-white/5'),
  ];
  
  const activeClasses = [
    'text-pure-white',
    'bg-charcoal-grey',
  ];
  
  return cn(
    ...baseClasses,
    isActive && activeClasses,
    className
  );
}

// =============================================================================
// LAYOUT UTILITIES
// =============================================================================

/**
 * Generate container classes
 */
export function containerClasses(className?: string): string {
  return cn(
    'max-w-7xl',
    'mx-auto',
    'px-6',
    className
  );
}

/**
 * Generate section classes
 */
export function sectionClasses(className?: string): string {
  return cn(
    'py-20',
    className
  );
}

/**
 * Generate hero section classes
 */
export function heroClasses(className?: string): string {
  return cn(
    'py-32',
    'min-h-screen',
    'flex',
    'items-center',
    className
  );
}

/**
 * Generate grid classes
 */
export function gridClasses(
  columns: 1 | 2 | 3 | 4 = 3,
  className?: string
): string {
  const gridColumns = {
    1: 'grid-cols-1',
    2: responsive({
      base: 'grid-cols-1',
      md: 'grid-cols-2',
    }),
    3: responsive({
      base: 'grid-cols-1',
      md: 'grid-cols-2',
      lg: 'grid-cols-3',
    }),
    4: responsive({
      base: 'grid-cols-1',
      md: 'grid-cols-2',
      lg: 'grid-cols-4',
    }),
  };
  
  return cn(
    'grid',
    'gap-6',
    'items-stretch',
    gridColumns[columns],
    className
  );
}

// =============================================================================
// TYPOGRAPHY UTILITIES
// =============================================================================

/**
 * Generate heading classes
 */
export function headingClasses(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  className?: string
): string {
  const baseClasses = [
    'font-heading',
    'font-semibold',
    'text-pure-white',
    'tracking-tight',
  ];
  
  const levelClasses = {
    1: ['text-hero', 'leading-tight'],
    2: ['text-section-title', 'leading-snug'],
    3: ['text-3xl', 'leading-snug'],
    4: ['text-2xl', 'leading-snug'],
    5: ['text-xl', 'leading-snug'],
    6: ['text-lg', 'leading-snug'],
  };
  
  return cn(
    ...baseClasses,
    ...levelClasses[level],
    className
  );
}

/**
 * Generate body text classes
 */
export function bodyClasses(
  variant: 'default' | 'large' | 'small' | 'muted' = 'default',
  className?: string
): string {
  const baseClasses = [
    'font-primary',
    'leading-relaxed',
  ];
  
  const variantClasses = {
    default: ['text-base', 'text-pure-white'],
    large: ['text-lg', 'text-pure-white'],
    small: ['text-sm', 'text-pure-white'],
    muted: ['text-base', 'text-light-grey'],
  };
  
  return cn(
    ...baseClasses,
    ...variantClasses[variant],
    className
  );
}

// =============================================================================
// ANIMATION UTILITIES
// =============================================================================

/**
 * Generate fade-in animation classes
 */
export function fadeInClasses(
  delay: number = 0,
  className?: string
): string {
  const delayClass = delay > 0 ? `delay-${delay}` : '';
  
  return cn(
    'animate-fade-in',
    'opacity-0',
    delayClass,
    className
  );
}

/**
 * Generate slide-up animation classes
 */
export function slideUpClasses(
  delay: number = 0,
  className?: string
): string {
  const delayClass = delay > 0 ? `delay-${delay}` : '';
  
  return cn(
    'animate-slide-up',
    'opacity-0',
    'translate-y-4',
    delayClass,
    className
  );
}

/**
 * Generate scale-in animation classes
 */
export function scaleInClasses(
  delay: number = 0,
  className?: string
): string {
  const delayClass = delay > 0 ? `delay-${delay}` : '';
  
  return cn(
    'animate-scale-in',
    'opacity-0',
    'scale-95',
    delayClass,
    className
  );
}

// =============================================================================
// ACCESSIBILITY UTILITIES
// =============================================================================

/**
 * Screen reader only classes
 */
export function srOnlyClasses(): string {
  return 'sr-only';
}

/**
 * Focus visible classes
 */
export function focusVisibleClasses(className?: string): string {
  return cn(
    'focus-visible:outline-2',
    'focus-visible:outline-white',
    'focus-visible:outline-offset-2',
    className
  );
}

/**
 * Skip link classes
 */
export function skipLinkClasses(): string {
  return cn(
    'sr-only',
    'focus:not-sr-only',
    'absolute',
    'top-4',
    'left-4',
    'z-50',
    'bg-primary',
    'text-white',
    'px-4',
    'py-2',
    'rounded-md',
    'font-medium',
    'transition-all',
    'duration-200',
    focusVisibleClasses(),
    hover('bg-blue-700')
  );
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate color value
 */
export function isValidColor(color: string): boolean {
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return colorRegex.test(color) || color.startsWith('rgb') || color.startsWith('hsl');
}

/**
 * Validate spacing value
 */
export function isValidSpacing(value: string): boolean {
  const spacingRegex = /^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/;
  return spacingRegex.test(value) || value === '0';
}

/**
 * Convert spacing key to CSS value
 */
export function getSpacingValue(key: keyof typeof spacing): string {
  return spacing[key];
}

// =============================================================================
// DEBUGGING UTILITIES
// =============================================================================

/**
 * Add debug border (development only)
 */
export function debugBorder(color: string = 'red'): string {
  if (!import.meta.env.DEV) return '';
  
  const colorMap = {
    red: 'border-red-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
  };
  
  return cn('border-2', colorMap[color as keyof typeof colorMap] || 'border-red-500');
}

/**
 * Add debug background (development only)
 */
export function debugBackground(color: string = 'red'): string {
  if (!import.meta.env.DEV) return '';
  
  const colorMap = {
    red: 'bg-red-500/20',
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    yellow: 'bg-yellow-500/20',
    purple: 'bg-purple-500/20',
  };
  
  return colorMap[color as keyof typeof colorMap] || 'bg-red-500/20';
}

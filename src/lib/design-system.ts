// Design System Types and Constants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type CardVariant = 'default' | 'featured' | 'compact' | 'interactive'
export type InputVariant = 'default' | 'error' | 'success'

export const colors = {
  'professional-black': '#000000',
  'charcoal-grey': '#1a1a1a',
  'medium-grey': '#404040',
  'light-grey': '#d1d5db',
  'pure-white': '#ffffff',
  'off-white': '#f5f5f5',
  'accent-blue': '#3b82f6',
  'racing-red': '#dc2626',
}

export const typography = {
  fontFamily: {
    primary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    heading: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
  },
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
}

export const borderRadius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
}

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
}

export const componentStyles = {
  button: {
    base: 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200',
  },
  card: {
    base: 'rounded-lg border bg-charcoal-grey text-white shadow-sm transition-all duration-200',
  },
  input: {
    base: 'bg-charcoal-grey border border-medium-grey rounded-md px-4 py-3 text-pure-white',
  },
}
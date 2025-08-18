import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2, type LucideIcon } from 'lucide-react'

import { cn } from '../../lib/style-utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary: 'bg-white text-black hover:bg-gray-100 hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md',
        secondary: 'bg-transparent text-white border border-gray-600 hover:border-white hover:bg-white/5 active:bg-white/10',
        outline: 'bg-transparent text-white border border-gray-400 hover:bg-white hover:text-black active:bg-gray-100',
        ghost: 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10',
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md',
        link: 'text-white underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading
    
    const iconElement = loading ? (
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    ) : Icon ? (
      <Icon className="h-4 w-4" aria-hidden="true" />
    ) : null

    // When using asChild, we need to ensure Slot receives exactly one React element child
    if (asChild) {
      // For asChild, we clone the child element and add our props to it
      // The child element should handle its own content rendering
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    // For regular button rendering, we can have multiple children
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {iconElement && iconPosition === 'left' && iconElement}
        {loading && (
          <span className="sr-only">Loading...</span>
        )}
        {children}
        {iconElement && iconPosition === 'right' && iconElement}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
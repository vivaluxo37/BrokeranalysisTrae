import * as React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { AlertCircle, Eye, EyeOff, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/style-utils'

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-[#1a1a1a] px-3 py-2 text-sm text-white transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-600 hover:border-gray-400 focus-visible:border-white',
        error: 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
        success: 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20',
      },
      inputSize: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  error?: string
  success?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant, 
    inputSize,
    icon: Icon,
    iconPosition = 'left',
    error,
    success,
    helperText,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    
    const actualVariant = error ? 'error' : success ? 'success' : variant

    return (
      <div className="w-full">
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <Icon 
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" 
              aria-hidden="true"
            />
          )}
          
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant: actualVariant, inputSize, className }),
              Icon && iconPosition === 'left' && 'pl-10',
              (Icon && iconPosition === 'right') || isPassword ? 'pr-10' : '',
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${props.id}-error` : 
              success ? `${props.id}-success` : 
              helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />
          
          {Icon && iconPosition === 'right' && !isPassword && (
            <Icon 
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" 
              aria-hidden="true"
            />
          )}
          
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        
        {(error || success || helperText) && (
          <div className="mt-1 text-sm">
            {error && (
              <p 
                id={`${props.id}-error`}
                className="flex items-center gap-1 text-red-400"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {error}
              </p>
            )}
            {success && !error && (
              <p 
                id={`${props.id}-success`}
                className="text-green-400"
              >
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p 
                id={`${props.id}-helper`}
                className="text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }

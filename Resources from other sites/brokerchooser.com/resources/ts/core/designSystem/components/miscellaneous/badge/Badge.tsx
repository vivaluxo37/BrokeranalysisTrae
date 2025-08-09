import { BadgeVariant } from '@design-system/components/miscellaneous/badge/types';
import { ColorMode, SizeVariant } from '@design-system/types/coreTypes';
import classNames from 'classnames';
import React, { forwardRef } from 'react';

export const Badge = forwardRef<
    HTMLDivElement,
    {
        className?: string;
        text?: string;
        variant?: BadgeVariant;
        size?: SizeVariant;
        mode?: ColorMode;
    }
>(
    (
        { className, text, variant = 'primary', size = 'xs', mode = 'light' },
        ref,
    ) => (
        <div
            ref={ref}
            className={classNames(
                'inline-block py-0.5 font-semibold',
                {
                    'h-2 w-2 rounded-full': !text,
                    'rounded-lg px-2 text-2xs': size === 'xs' && text,
                    'rounded-xl px-2 text-xs': size === 'sm' && text,
                    'rounded-xl px-3 text-sm': size === 'md' && text,
                    'rounded-2xl px-4 text-base': size === 'lg' && text,
                    'bg-primary-500 text-slate-950': variant === 'primary',
                    'bg-blue-500 text-white': variant === 'secondary',
                },
                mode === 'light'
                    ? {
                          'border border-slate-200 text-slate-800':
                              variant === 'stroke',
                          'bg-slate-950 text-white': variant === 'monochrome',
                          'bg-slate-200 text-slate-600': variant === 'muted',
                      }
                    : {
                          'border border-slate-600 text-slate-200':
                              variant === 'stroke',
                          'bg-white text-slate-950': variant === 'monochrome',
                          'bg-slate-600 text-slate-200': variant === 'muted',
                      },
                className,
            )}
        >
            {text}
        </div>
    ),
);

Badge.displayName = 'Badge';

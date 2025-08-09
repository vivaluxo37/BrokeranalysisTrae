import classNames from 'classnames';
import React, { forwardRef, PropsWithChildren } from 'react';

export const Card = forwardRef<
    HTMLDivElement,
    PropsWithChildren<{
        className?: string;
        withShadow?: boolean;
        forcedShadow?: boolean;
        clickable?: boolean;
    }>
>(({ children, withShadow, forcedShadow, clickable, className }, ref) => (
    <div
        ref={ref}
        tabIndex={-1}
        className={classNames(
            'rounded-[12px] border border-slate-200 p-3 lg:p-6',
            {
                'transition-shadow duration-500 hover:shadow-card': withShadow,
                'shadow-card': forcedShadow,
                'cursor-pointer active:border-blue-500 active:shadow-bc':
                    clickable,
            },
            className,
        )}
    >
        {children}
    </div>
));

Card.displayName = 'Card';

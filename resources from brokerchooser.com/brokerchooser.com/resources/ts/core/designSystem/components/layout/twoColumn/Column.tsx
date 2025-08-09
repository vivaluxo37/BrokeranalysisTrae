import classNames from 'classnames';
import React, { forwardRef, PropsWithChildren } from 'react';

export const Column = forwardRef<
    HTMLDivElement,
    PropsWithChildren<{
        className?: string;
        type?: 'text' | 'default';
    }>
>(({ children, className, type = 'default' }, ref) => (
    <div
        ref={ref}
        className={classNames(
            'relative flex-1',
            {
                'lg:ms-8': type === 'text',
            },
            className,
        )}
    >
        {children}
    </div>
));

Column.displayName = 'Column';

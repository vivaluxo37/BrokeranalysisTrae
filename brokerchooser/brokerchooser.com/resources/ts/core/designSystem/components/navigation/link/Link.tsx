import { LinkProps } from '@design-system/components/navigation/link/types/LinkProps';
import classNames from 'classnames';
import React, { forwardRef } from 'react';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ children, mode = 'light', ...props }, ref) => (
        <a
            ref={ref}
            {...props}
            className={classNames(
                'underline decoration-dotted underline-offset-[3px]',
                {
                    'text-blue-500 decoration-blue-500 hover:text-blue-600 hover:decoration-blue-600':
                        mode === 'light',
                    'text-slate-400 decoration-slate-400 hover:text-slate-300 hover:decoration-slate-300':
                        mode === 'dark',
                },
                props.className,
            )}
        >
            {children}
        </a>
    ),
);

Link.displayName = 'Link';

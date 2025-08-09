import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const TwoColumn: FC<
    PropsWithChildren<{
        gap?: 0 | 5 | 8 | 16;
        invertedOnMobile?: boolean;
        className?: string;
    }>
> = ({ gap = 8, children, invertedOnMobile, className }) => (
    <div
        className={classNames(
            'flex flex-col md:flex-row',
            {
                'flex-col-reverse': invertedOnMobile,
                'gap-0': gap === 0,
                'gap-5': gap === 5,
                'gap-8': gap === 8,
                'gap-16': gap === 16,
            },
            className,
        )}
    >
        {children}
    </div>
);

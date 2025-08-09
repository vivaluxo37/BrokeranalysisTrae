import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const SectionTitle: FC<
    PropsWithChildren<{
        center?: boolean;
        className?: string;
        disableMargin?: boolean;
    }>
> = ({ center, disableMargin, className, children }) => (
    <h2
        className={classNames(
            className,
            `w-full text-center text-2xl font-bold sm:text-3xl`,
            !center && 'sm:text-left',
            !disableMargin && 'mb-4 sm:mb-6',
        )}
    >
        {children}
    </h2>
);

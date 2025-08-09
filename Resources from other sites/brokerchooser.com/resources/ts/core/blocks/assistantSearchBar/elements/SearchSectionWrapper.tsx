import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const SearchSectionWrapper: FC<
    PropsWithChildren<{
        variant?: 'white' | 'slate';
        wrapperClassName?: string;
        className?: string;
    }>
> = ({ children, variant = 'white', wrapperClassName, className }) => (
    <div
        className={classNames(
            'flex justify-center p-4 md:py-8',
            {
                'bg-white': variant === 'white',
                'bg-slate-50': variant === 'slate',
            },
            wrapperClassName,
        )}
    >
        <div className={classNames('w-full md:w-[60%]', className)}>
            {children}
        </div>
    </div>
);

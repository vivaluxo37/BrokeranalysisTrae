import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const SelectableIconWrapper: FC<
    PropsWithChildren<{
        isOpen: boolean;
        mode?: 'dark' | 'light';
        disabled?: boolean;
        className?: string;
    }>
> = ({ isOpen, children, mode = 'light', disabled, className }) => (
    <div
        className={classNames(
            'cursor-pointer rounded-lg p-3',
            isOpen ? 'outline outline-[2px]' : 'bg-transparent',
            {
                'bg-slate-100 outline-slate-300': isOpen && mode === 'light',
                'bg-slate-600 outline-slate-400': isOpen && mode === 'dark',
                'text-slate-600 hover:bg-slate-200':
                    mode === 'light' && !disabled,
                'text-white hover:bg-slate-700': mode === 'dark' && !disabled,
                'pointer-events-none text-slate-400': disabled,
            },
            className,
        )}
    >
        {children}
    </div>
);

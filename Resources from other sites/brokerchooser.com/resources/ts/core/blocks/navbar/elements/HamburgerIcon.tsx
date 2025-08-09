import classNames from 'classnames';
import React, { FC } from 'react';

export const HamburgerIcon: FC<{
    mode: 'dark' | 'light';
    open: boolean;
}> = ({ mode, open }) => (
    <div className="relative h-5 w-5 px-0.5">
        <div
            className={classNames(
                'relative top-1 h-[1px] w-full rounded transition-transform',
                mode === 'dark' ? 'bg-white' : 'bg-slate-950',
                {
                    'translate-y-[4px] -rotate-45': open,
                },
            )}
        />
        <div
            className={classNames(
                'relative top-2 h-[1px] w-full rounded transition-opacity',
                mode === 'dark' ? 'bg-white' : 'bg-slate-950',
                {
                    'opacity-0': open,
                },
            )}
        />
        <div
            className={classNames(
                'relative top-3 h-[1px] w-full rounded transition-transform',
                mode === 'dark' ? 'bg-white' : 'bg-slate-950',
                {
                    '-translate-y-[6px] rotate-45': open,
                },
            )}
        />
    </div>
);

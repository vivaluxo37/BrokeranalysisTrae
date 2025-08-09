import { ColorMode } from '@design-system/types/coreTypes';
import { CheckIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import React, { FC } from 'react';

export const Chips: FC<{
    mode?: ColorMode;
    selected: boolean;
    label: string;
    value: string;
    onClick: (value: string) => void;
}> = ({ mode = 'light', selected, label, value, onClick }) => (
    <button
        className={classNames(
            'flex items-center gap-1 rounded-lg border px-2 py-1 pe-7 text-base transition-colors',
            {
                'border-slate-300 ps-7 text-slate-950 hover:bg-slate-100':
                    mode === 'light' && !selected,
                'bg-slate-500 text-white': mode === 'light' && selected,
                'border-slate-500 ps-7 text-white hover:bg-slate-700':
                    mode === 'dark' && !selected,
                'bg-slate-300 text-slate-950': mode === 'dark' && selected,
            },
        )}
        type="button"
        onClick={() => onClick(value)}
    >
        {selected && <CheckIcon className="size-4" />}
        {label}
    </button>
);

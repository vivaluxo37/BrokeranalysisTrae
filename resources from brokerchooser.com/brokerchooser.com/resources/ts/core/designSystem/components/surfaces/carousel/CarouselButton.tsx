import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';

export const CarouselButton: FC<{
    onClick: () => void;
    right?: boolean;
}> = ({ onClick, right }) => (
    <button
        aria-label="right"
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 text-slate-500 transition-colors hover:bg-slate-600 hover:text-white"
        onClick={onClick}
    >
        {right ? (
            <ArrowRightIcon className="h-5 w-5 rtl:rotate-180" />
        ) : (
            <ArrowLeftIcon className="h-5 w-5 rtl:rotate-180" />
        )}
    </button>
);

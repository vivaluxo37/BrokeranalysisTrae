import classNames from 'classnames';
import React, { FC } from 'react';
import { SpinnerIcon } from '../../components/tailwind/atom/icons/SpinnerIcon';

export const Spinner: FC<{
    className?: string;
    size: 'small' | 'medium' | 'large';
}> = ({ className, size }) => (
    <SpinnerIcon
        className={classNames(className, 'animate-spin text-secondary-500', {
            'h-20 w-20': size === 'large',
            'h-10 w-10': size === 'medium',
            'h-5 w-5': size === 'small',
        })}
    />
);

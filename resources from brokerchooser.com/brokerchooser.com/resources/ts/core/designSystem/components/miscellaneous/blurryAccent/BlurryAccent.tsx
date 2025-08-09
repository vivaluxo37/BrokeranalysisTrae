import classNames from 'classnames';
import React, { FC } from 'react';

export type BlurryAccentProps = {
    className?: string;
};

export const BlurryAccent: FC<BlurryAccentProps> = ({ className }) => (
    <div
        className={classNames('absolute z-10 rounded-full blur-3xl', className)}
    />
);

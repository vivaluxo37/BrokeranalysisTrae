import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

export const DialogFrame: React.FC<
    PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
    <div
        className={classNames(
            'max-w-xs rounded-lg bg-white p-6 md:max-w-lg',
            className,
        )}
    >
        {children}
    </div>
);

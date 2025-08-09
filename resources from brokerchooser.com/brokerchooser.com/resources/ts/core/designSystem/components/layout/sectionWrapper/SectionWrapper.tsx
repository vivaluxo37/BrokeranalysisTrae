import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const SectionWrapper: FC<
    PropsWithChildren<{
        outerClassName?: string;
        innerClassName?: string;
        id?: string;
    }>
> = ({ children, outerClassName, innerClassName, id }) => (
    <div
        id={id}
        className={classNames(outerClassName, 'relative overflow-hidden')}
    >
        <div
            className={classNames(
                'mx-auto max-w-7xl px-4 md:px-10 xl:px-4',
                innerClassName,
            )}
        >
            {children}
        </div>
    </div>
);

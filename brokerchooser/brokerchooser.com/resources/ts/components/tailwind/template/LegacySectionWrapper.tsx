import classNames from 'classnames';
import React, { FC, PropsWithChildren, ReactElement } from 'react';

export const LegacySectionWrapper: FC<
    PropsWithChildren<{
        outerClassName?: string;
        innerClassName?: string;
        outerPaddingClassName?: string;
        innerWidth?: string;
        subSection?: boolean;
        id?: string;
        backgroundElement?: ReactElement<any, any>;
    }>
> = ({
    subSection,
    outerClassName,
    outerPaddingClassName,
    backgroundElement,
    children,
    innerWidth,
    id,
    innerClassName,
}) => (
    <div
        className={classNames(
            'relative w-full text-sm sm:text-base',
            subSection && 'py-10',
            !subSection && (outerPaddingClassName || 'py-10 sm:py-14'),
            outerClassName,
        )}
    >
        {backgroundElement}
        <span className="relative -top-20" id={id} />
        <div
            className={classNames(
                'relative w-full px-3 px-4 sm:mx-auto sm:px-6',
                innerWidth || 'max-w-[1000px]',
                innerClassName,
            )}
        >
            {children}
        </div>
    </div>
);

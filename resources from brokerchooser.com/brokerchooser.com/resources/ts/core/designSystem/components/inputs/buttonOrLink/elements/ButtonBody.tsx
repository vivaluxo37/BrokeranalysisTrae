import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const ButtonBody: FC<
    PropsWithChildren<{
        text?: string;
        withRightArrow?: boolean;
        IconRight?: React.ComponentType<React.ComponentProps<any>>;
        withLeftArrow?: boolean;
        IconLeft?: React.ComponentType<React.ComponentProps<any>>;
        iconClassName?: string;
        className?: string;
    }>
> = ({
    children,
    text,
    withRightArrow,
    IconRight,
    withLeftArrow,
    IconLeft,
    iconClassName,
    className,
}) => (
    <>
        {IconLeft && <IconLeft className={iconClassName} />}
        {withLeftArrow && (
            <ArrowLeftIcon
                className={classNames(
                    'ms-1 h-4 w-4 rtl:rotate-180',
                    iconClassName,
                )}
                strokeWidth={3}
            />
        )}
        {(children || text) && (
            <div className={classNames('px-3 text-center', className)}>
                {children || text}
            </div>
        )}
        {withRightArrow && (
            <ArrowRightIcon
                className={classNames(
                    'me-1 h-4 w-4 rtl:rotate-180',
                    iconClassName,
                )}
                strokeWidth={3}
            />
        )}
        {IconRight && <IconRight className={iconClassName} />}
    </>
);

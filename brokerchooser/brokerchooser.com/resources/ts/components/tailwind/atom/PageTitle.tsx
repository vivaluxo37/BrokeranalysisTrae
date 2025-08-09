import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

type PageTitleProps = PropsWithChildren<{
    className?: string;
    disableMargin?: boolean;
}>;

export const PageTitle: React.FunctionComponent<PageTitleProps> = ({
    children,
    disableMargin,
    className,
}) => (
    <h1
        className={classNames(
            className,
            'w-full text-4xl font-bold lg:text-5xl',
            !disableMargin && 'mb-6 sm:mb-8',
        )}
    >
        {children}
    </h1>
);

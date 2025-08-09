import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

type PageWrapperProps = PropsWithChildren<{
    className?: string;
}>;

export const ArticleWrapper: React.FunctionComponent<PageWrapperProps> = ({
    className,
    children,
}) => (
    <div className={classNames('w-full overflow-x-hidden', className)}>
        {children}
    </div>
);

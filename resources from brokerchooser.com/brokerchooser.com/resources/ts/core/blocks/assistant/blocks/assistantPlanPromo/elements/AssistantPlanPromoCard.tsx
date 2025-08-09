import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const AssistantPlanPromoCard: FC<
    PropsWithChildren<{
        className?: string;
    }>
> = ({ children, className }) => (
    <div
        className={classNames(
            'flex min-w-80 max-w-96 flex-col gap-4 rounded-xl p-6 md:gap-6 md:p-8',
            className,
        )}
    >
        {children}
    </div>
);

import classNames from 'classnames';
import React, { FC } from 'react';

export const AssistantChatBubbleBadge: FC<{
    counter: number;
    className?: string;
}> = ({ counter, className }) => (
    <div
        className={classNames(
            'flex size-5 items-center justify-center rounded-full bg-danger-700 text-xs text-white md:size-6',
            className,
        )}
    >
        {counter}
    </div>
);

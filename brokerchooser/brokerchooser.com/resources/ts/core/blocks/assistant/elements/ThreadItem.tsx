import { Badge } from '@design-system/components/miscellaneous/badge/Badge';
import classNames from 'classnames';
import React, { FC, useCallback } from 'react';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { Thread } from '../types/Thread';

export const ThreadItem: FC<{
    thread: Thread;
    onClick: (threadId: number) => void;
}> = ({ thread, onClick }) => {
    const currentThreadId = useGlobalStore(
        (state) => state.assistant.chat.currentThreadId,
    );
    const isGenerating = useGlobalStore(
        (state) => state.assistant.common.isGenerating,
    );

    const handleClick = useCallback(() => {
        onClick(thread.id);
    }, [onClick, thread.id]);

    return (
        <button
            type="button"
            className="group flex w-full max-w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg pe-1 transition-colors duration-300 hover:bg-blue-50"
            key={thread.id}
            disabled={currentThreadId === thread.id || isGenerating}
            onClick={handleClick}
        >
            <p
                className={classNames(
                    'font-regular flex-1 shrink-0 cursor-pointer truncate p-2 text-start transition-colors duration-300 group-hover:text-blue-500',
                    {
                        'text-blue-500': thread.id === currentThreadId,
                    },
                )}
            >
                {thread.title}
            </p>
            {thread.nrOfUnreadMessages > 0 && (
                <Badge text={`${thread.nrOfUnreadMessages}`} variant="stroke" />
            )}
        </button>
    );
};

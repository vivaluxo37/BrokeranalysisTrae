import classNames from 'classnames';
import React, { ComponentProps, ComponentType, FC } from 'react';
import { Thread } from '../types/Thread';
import { ThreadItem } from './ThreadItem';

export const ThreadListSection: FC<{
    threads: Thread[];
    onThreadItemClick: (threadId: number) => void;
    Icon: ComponentType<ComponentProps<any>>;
    title: string;
    className?: string;
}> = ({ threads, onThreadItemClick, title, Icon, className }) => (
    <div
        className={classNames(
            'flex flex-col gap-y-2 overflow-hidden',
            className,
        )}
    >
        <div className="flex items-center gap-x-1 font-semibold">
            <Icon className="size-6 stroke-slate-500" />
            <p className="text-sm text-slate-500">{title}</p>
        </div>
        <div className="min-h-12 overflow-auto overscroll-none">
            {threads.map((thread) => (
                <ThreadItem
                    key={thread.id}
                    thread={thread}
                    onClick={onThreadItemClick}
                />
            ))}
        </div>
    </div>
);

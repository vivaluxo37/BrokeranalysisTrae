import { SparklesIcon } from '@heroicons/react/24/solid';
import React, { PropsWithChildren } from 'react';

export const AssistantChatMessageComponentBody: React.FC<PropsWithChildren> = ({
    children,
}) => (
    <div className="flex w-full gap-2 gap-y-[18px] lg:gap-x-[18px] lg:pe-28">
        <div className="shrink-0 self-start rounded-lg bg-secondary-50 p-2 lg:p-3">
            <SparklesIcon className="size-4 fill-secondary-500 lg:size-6" />
        </div>
        <div className="flex w-full flex-col gap-y-1 lg:gap-y-2">
            {children}
        </div>
    </div>
);

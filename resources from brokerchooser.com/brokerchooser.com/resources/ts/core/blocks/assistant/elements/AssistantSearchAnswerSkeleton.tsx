import React, { FC } from 'react';

export const AssistantSearchAnswerSkeleton: FC = () => (
    <div className="flex w-full animate-pulse flex-col gap-y-2 *:h-4 *:animate-grow-reset *:rounded *:bg-gray-200">
        <div className="max-w-full" />
        <div className="max-w-[80%]" />
        <div className="max-w-[90%]" />
        <div className="max-w-[50%]" />
        <div className="mt-4 !h-12 w-1/4 max-w-[25%] animate-grow-reset !rounded-lg" />
    </div>
);

import { SparklesIcon } from '@heroicons/react/16/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';

export const AssistantSearchIcon = () => (
    <div className="relative">
        <SparklesIcon className="absolute left-[4.5px] top-[5px] size-2" />
        <MagnifyingGlassIcon className="size-5" />
    </div>
);

import React, { FC } from 'react';
import { ImageAsBackground } from '../../../../components/tailwind/atom/ImageAsBackground';

export const AssistantAnswerSkeleton: FC = () => (
    <>
        <ImageAsBackground
            className="hidden h-20 w-full animate-pulse !bg-left-top md:inline-block rtl:scale-x-[-1]"
            imageSrc="/images/assistant/assistant-skeleton.svg"
        />
        <ImageAsBackground
            className="inline-block h-20 w-full animate-pulse !bg-left-top md:hidden rtl:scale-x-[-1]"
            imageSrc="/images/assistant/assistant-skeleton-mobile.svg"
        />
    </>
);

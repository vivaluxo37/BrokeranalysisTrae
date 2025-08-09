import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import React, { PropsWithChildren } from 'react';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';
import { MinimizeAssistantButton } from './MinimizeAssistantButton';

export const AssistantFullWidthView: React.FC<PropsWithChildren> = ({
    children,
}) => {
    const { onOpenWithActiveChat } = useAssistantInteractions();

    return (
        <div className="lg:flex-column align-content-start absolute right-0 top-0 z-20 flex h-full w-full flex-row flex-wrap content-start rounded-xl bg-white p-4 lg:flex-nowrap lg:gap-10 lg:p-8">
            <div className="order-1 flex h-fit w-1/2 items-start justify-start lg:w-10 lg:justify-center">
                <ButtonOrLink
                    text="Back"
                    mode="light"
                    variant="tertiary"
                    className="d-block bg-white !p-3.5"
                    bodyClassName="!p-0"
                    onClick={() => onOpenWithActiveChat()}
                >
                    <ChevronLeftIcon className="size-5 shrink-0 rtl:scale-x-[-1]" />
                </ButtonOrLink>
            </div>
            <div className="order-3 flex h-full flex-grow flex-col lg:order-2">
                {children}
            </div>
            <div className="order-2 flex h-fit w-1/2 items-start justify-end lg:order-3 lg:w-10 lg:justify-center">
                <MinimizeAssistantButton className="-ml-2" />
            </div>
        </div>
    );
};

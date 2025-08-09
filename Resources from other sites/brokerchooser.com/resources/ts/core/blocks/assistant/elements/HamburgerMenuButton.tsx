import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { Bars2Icon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import React, { FC } from 'react';
import { AssistantChatBubbleBadge } from './AssistantChatBubbleBadge';
import { AssistantName } from './AssistantName';
import { MinimizeAssistantButton } from './MinimizeAssistantButton';

export const HamburgerMenuButton: FC<{
    onClick: () => void;
    Icon?: React.ComponentType<React.ComponentProps<any>>;
    className?: string;
    totalUnreadMessages: number;
}> = ({ onClick, Icon, className, totalUnreadMessages }) => (
    <div
        className={classNames(
            'flex items-center justify-between p-4 lg:hidden',
            className,
        )}
    >
        <ButtonOrLink
            text="Close"
            variant="tertiary"
            className="relative bg-white"
            bodyClassName="!px-0"
            onClick={onClick}
        >
            {Icon ? (
                <Icon className="size-5" />
            ) : (
                <Bars2Icon className="size-5" />
            )}
            {totalUnreadMessages > 0 && (
                <AssistantChatBubbleBadge
                    counter={totalUnreadMessages}
                    className="absolute -end-2 -top-2"
                />
            )}
        </ButtonOrLink>
        <AssistantName />
        <MinimizeAssistantButton />
    </div>
);

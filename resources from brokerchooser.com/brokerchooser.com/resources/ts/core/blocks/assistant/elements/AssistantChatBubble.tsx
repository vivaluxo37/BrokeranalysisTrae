import classNames from 'classnames';
import React, { FC } from 'react';
import { Image } from '../../../elements/Image';
import ChatBubbleIcon from '../assets/nuri-chat-bubble-icon.svg';
import { useAssistantChatBubble } from '../hooks/useAssistantChatBubble';
import { useAssistantUnreadMessageHandling } from '../hooks/useAssistantUnreadMessageHandling';
import { AssistantChatBubbleBadge } from './AssistantChatBubbleBadge';

export const AssistantChatBubble: FC<{
    totalUnreadMessages: number;
}> = ({ totalUnreadMessages: initialNrOfUnreadMessages }) => {
    const { bottomOffsetClassName, onClick } = useAssistantChatBubble();
    const { totalUnreadMessages } = useAssistantUnreadMessageHandling({
        initialNrOfUnreadMessages,
    });

    return (
        <div
            className={classNames(
                'fixed end-5 z-50 mx-auto w-fit',
                bottomOffsetClassName,
            )}
        >
            <button
                type="button"
                aria-label="open-chat"
                onClick={onClick}
                className="drop-shadow-md"
            >
                {totalUnreadMessages > 0 && (
                    <AssistantChatBubbleBadge
                        counter={totalUnreadMessages || 1}
                        className="absolute -end-2 -top-2"
                    />
                )}
                <Image
                    imageSrc={ChatBubbleIcon}
                    alt="nuri"
                    className="size-12 sm:size-16"
                    style={{ borderRadius: '8px' }}
                />
                <div className="absolute bottom-0 start-0 size-3 rounded-full border border-white bg-emerald-500" />
            </button>
        </div>
    );
};

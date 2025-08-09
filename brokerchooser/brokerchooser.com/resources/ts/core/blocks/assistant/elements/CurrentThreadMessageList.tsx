import React, { memo } from 'react';
import { AssistantSystemMessageComponent } from '../blocks/assistantSystemMessage/AssistantSystemMessageComponent';
import { MessageAuthor } from '../consts/MessageAuthor';
import { ChatMessage } from '../types/ChatMessageTypes';
import { AssistantChatMessageComponent } from './AssistantChatMessageComponent';
import { UserChatMessageComponent } from './UserChatMessageComponent';

export const CurrentThreadMessageList = memo(
    ({ currentThreadMessages }: { currentThreadMessages: ChatMessage[] }) => (
        <>
            {currentThreadMessages.map((message) => {
                switch (message.author) {
                    case MessageAuthor.USER:
                        return (
                            <UserChatMessageComponent
                                key={message.id}
                                message={message}
                            />
                        );
                    case MessageAuthor.ASSISTANT:
                        return (
                            <AssistantChatMessageComponent
                                key={message.id}
                                message={message}
                            />
                        );
                    case MessageAuthor.SYSTEM:
                        return (
                            <AssistantSystemMessageComponent
                                key={message.id}
                                message={message}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    ),
);

CurrentThreadMessageList.displayName = 'CurrentThreadMessageList';

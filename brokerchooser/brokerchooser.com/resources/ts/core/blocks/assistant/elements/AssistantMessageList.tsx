import React, { useCallback, useEffect, useRef } from 'react';
import { isServer } from '../../../../util/isServer';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { AssistantChatMessageComponent } from './AssistantChatMessageComponent';
import { CurrentThreadMessageList } from './CurrentThreadMessageList';

export const AssistantMessageList: React.FC = () => {
    const currentThreadMessages = useGlobalStore(
        (state) => state.assistant.chat.messageStore.currentThreadMessages,
    );
    const currentThreadId = useGlobalStore(
        (state) => state.assistant.chat.currentThreadId,
    );
    const updateThreadById = useGlobalStore(
        (state) => state.assistant.chat.actions.updateThreadById,
    );
    const incomingMessage = useGlobalStore(
        (state) => state.assistant.chat.messageBuffer.incomingMessage,
    );

    const anchorRef = useRef<HTMLDivElement>(null);

    const markThreadRead = useCallback(
        async (threadId: number) => {
            await window.BCAssistantApi.markThreadAsRead(threadId);
            updateThreadById(threadId, {
                nrOfUnreadMessages: 0,
            });
        },
        [updateThreadById],
    );

    useEffect(() => {
        if (isServer() || !currentThreadId) {
            return;
        }
        markThreadRead(currentThreadId);
    }, [currentThreadId, markThreadRead]);

    const isFirstRender = useRef(true);
    useEffect(() => {
        anchorRef.current?.scrollIntoView({
            behavior: isFirstRender.current ? 'instant' : 'smooth',
        });
        isFirstRender.current = false;
    }, [incomingMessage, currentThreadMessages]);

    return (
        <div className="z-10 size-full self-center overflow-y-auto overscroll-none px-4 lg:mt-8 lg:w-full lg:p-0 lg:pe-8">
            <div className="flex flex-col gap-y-6">
                <CurrentThreadMessageList
                    currentThreadMessages={currentThreadMessages}
                />
                {incomingMessage && (
                    <AssistantChatMessageComponent message={incomingMessage} />
                )}
                <div className="invisible -mt-6" ref={anchorRef} />
            </div>
        </div>
    );
};

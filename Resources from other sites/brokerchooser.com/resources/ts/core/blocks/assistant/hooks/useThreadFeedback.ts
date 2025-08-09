import { RefObject, useEffect } from 'react';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { MessageAuthor } from '../consts/MessageAuthor';
import { SystemMessageType } from '../consts/SystemMessageType';
import feedbackSystemMessageHandlerInstance from '../functions/FeedbackSystemMessageHandler';
import { AssistantSystemMessage } from '../types/ChatMessageTypes';

// Time until we start sending feedback system messages
const FEEDBACK_TIMEOUT = 90000; // 90 sec

export const useThreadFeedback = (
    assistantModalBodyRef: RefObject<HTMLDivElement>,
) => {
    const isGenerating = useGlobalStore(
        (state) => state.assistant.common.isGenerating,
    );
    const view = useGlobalStore((state) => state.assistant.common.view);
    const currentThreadId = useGlobalStore(
        (state) => state.assistant.chat.currentThreadId,
    );
    const threads = useGlobalStore((state) => state.assistant.chat.threads);
    const currentThreadMessages = useGlobalStore(
        (state) => state.assistant.chat.messageStore.currentThreadMessages,
    );

    // Start feedback system message sending logic if:
    useEffect(() => {
        // Is not generating and
        if (isGenerating) {
            return () => {};
        }

        // Selected thread has no rating and
        const currentThread = threads.find(({ id }) => id === currentThreadId);
        if (!currentThread || !!currentThread.rating) {
            return () => {};
        }

        // Selected thread has at least two messages (one question and one answer) and
        if (currentThreadMessages.length < 2) {
            return () => {};
        }

        // Has no feedback system message (need to check to avoid infinite loop).
        const systemMessage = currentThreadMessages.find(
            ({ author }) => author === MessageAuthor.SYSTEM,
        ) as AssistantSystemMessage | undefined;
        if (
            systemMessage &&
            systemMessage.type === SystemMessageType.FEEDBACK
        ) {
            return () => {};
        }

        feedbackSystemMessageHandlerInstance.setModalBodyRef(
            assistantModalBodyRef,
        );

        const timeout = setTimeout(() => {
            feedbackSystemMessageHandlerInstance.startListeningForInactivity();
        }, FEEDBACK_TIMEOUT);

        return () => {
            clearTimeout(timeout);
            feedbackSystemMessageHandlerInstance.stopListeningForInactivity();
            feedbackSystemMessageHandlerInstance.removeModalBodyRef();
        };
    }, [
        view,
        threads,
        currentThreadId,
        currentThreadMessages,
        assistantModalBodyRef,
        isGenerating,
    ]);
};

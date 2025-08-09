import { useCallback, useState } from 'react';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { AssistantMessage } from '../types/ChatMessageTypes';

const HIDE_FORUM_LINK_AFTER_MS = 15000;

export const useAssistantMessageFeedback = (message: AssistantMessage) => {
    const [isForumLinkVisible, setIsForumLinkVisible] = useState(false);

    const giveMessageFeedback = useGlobalStore(
        (state) => state.assistant.chat.actions.giveMessageFeedback,
    );

    const submitFeedback = useCallback(
        (rating: boolean) => {
            if (message.rating !== undefined) {
                return;
            }

            giveMessageFeedback(message.id, rating);

            if (rating) {
                return;
            }

            setIsForumLinkVisible(true);

            setTimeout(
                () => setIsForumLinkVisible(false),
                HIDE_FORUM_LINK_AFTER_MS,
            );
        },
        [message.rating, message.id, giveMessageFeedback],
    );

    return {
        isForumLinkVisible,
        submitFeedback,
    };
};

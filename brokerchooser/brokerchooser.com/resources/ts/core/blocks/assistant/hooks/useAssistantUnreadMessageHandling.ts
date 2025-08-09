import { useMemo } from 'react';
import { useGlobalStore } from '../../../globalStore/globalStore';

export const useAssistantUnreadMessageHandling = ({
    initialNrOfUnreadMessages,
}: {
    initialNrOfUnreadMessages: number;
}) => {
    const threads = useGlobalStore((state) => state.assistant.chat.threads);

    const totalUnreadMessages = useMemo(() => {
        if (threads.length === 0) {
            return initialNrOfUnreadMessages;
        }
        return threads.reduce(
            (previousValue, { nrOfUnreadMessages }) =>
                previousValue + nrOfUnreadMessages,
            0,
        );
    }, [initialNrOfUnreadMessages, threads]);

    return {
        totalUnreadMessages,
    };
};

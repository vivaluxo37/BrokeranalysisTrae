import axios from 'axios';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isServer } from '../../../../util/isServer';
import { Event } from '../../../../util/measurement/eventTypes';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import {
    getLocalStorageItem,
    removeLocalStorageItem,
    setLocalStorageItem,
} from '../../../functions/localStorage';
import { runByConsent } from '../../../functions/runByConsent';
import { sendHotJarEvent } from '../../../functions/sendHotJarEvent';
import { globalStore, useGlobalStore } from '../../../globalStore/globalStore';
import { ConsentLevel } from '../../../types/ConsentLevel';
import { useUserHandling } from '../../navbar/hooks/useUserHandling';
import { MINIMIZED_MESSAGE_STORAGE_KEY } from '../blocks/assistantMinimizedModal/consts/minimizedMessageLocalStorageKey';
import {
    ASSISTANT_CONTEXT_ON_CLOSE,
    ASSISTANT_CONTEXT_ON_MINIMIZE,
    ASSISTANT_ELEMENT_ID,
    ASSISTANT_MEASUREMENT_LIST_ID,
} from '../consts/measurementIds';
import { MessageAuthor } from '../consts/MessageAuthor';
import { ModalViewType } from '../consts/ModalViewType';
import { initializeAssistantApi } from '../functions/initializeAssistantApi';

export const useAssistantInteractions = () => {
    const fetchThreads = useGlobalStore(
        (state) => state.assistant.chat.actions.fetchThreads,
    );
    const { user } = useUserHandling();

    const [queryError, setQueryError] = useState<string>();

    const initializeModal = useCallback(async () => {
        if (isServer() || window.BCAssistantApi !== undefined) {
            return;
        }
        await initializeAssistantApi();
        await fetchThreads();
    }, [fetchThreads]);

    const executeInteraction = useCallback(
        async (action: () => Promise<void> | void, event?: Event) => {
            await initializeModal();
            const result = action();
            if (result && typeof result.then === 'function') {
                await result;
            }
            if (event) {
                await sendGA4Event(event);
            }
        },
        [initializeModal],
    );

    const onMinimize = useCallback(
        async () =>
            executeInteraction(
                () => {
                    const {
                        common: {
                            actions: { setView },
                        },
                        chat: {
                            messageStore: { currentThreadMessages },
                        },
                    } = globalStore.getState().assistant;

                    const latestUserMessageInThread =
                        currentThreadMessages.findLast(
                            (message) => message.author === MessageAuthor.USER,
                        );

                    if (latestUserMessageInThread !== undefined) {
                        runByConsent(
                            () =>
                                setLocalStorageItem({
                                    key: MINIMIZED_MESSAGE_STORAGE_KEY,
                                    value: latestUserMessageInThread.text,
                                }),
                            ConsentLevel.Experience,
                        );
                    }

                    const latestUserMessageFromStorage = getLocalStorageItem(
                        MINIMIZED_MESSAGE_STORAGE_KEY,
                    );

                    setView(
                        latestUserMessageFromStorage !== null
                            ? ModalViewType.MINIMIZED
                            : ModalViewType.CLOSED,
                    );
                },
                getGeneralElementClickEventData({
                    measurementListId: ASSISTANT_MEASUREMENT_LIST_ID,
                    elementId: ASSISTANT_ELEMENT_ID,
                    context: ASSISTANT_CONTEXT_ON_MINIMIZE,
                }),
            ),
        [executeInteraction],
    );

    const onClose = useCallback(
        async () =>
            executeInteraction(
                () => {
                    const { setView } =
                        globalStore.getState().assistant.common.actions;

                    removeLocalStorageItem(MINIMIZED_MESSAGE_STORAGE_KEY);

                    setView(ModalViewType.CLOSED);
                },
                getGeneralElementClickEventData({
                    measurementListId: ASSISTANT_MEASUREMENT_LIST_ID,
                    elementId: ASSISTANT_ELEMENT_ID,
                    context: ASSISTANT_CONTEXT_ON_CLOSE,
                }),
            ),
        [executeInteraction],
    );

    const { t } = useTranslation();

    const handleQueryError = useCallback(
        (error: any) => {
            if (axios.isAxiosError(error)) {
                if (
                    error.response?.data.message ===
                    'The message field must not be greater than 255 characters.'
                ) {
                    setQueryError(
                        t(
                            'I love details, but your message is too long. Can you shorten it?',
                        ),
                    );
                }
            }
        },
        [t],
    );

    const onContinueChat = useCallback(
        async (message: string) =>
            executeInteraction(async () => {
                const { submitQuery } =
                    globalStore.getState().assistant.chat.actions;

                try {
                    setQueryError(undefined);
                    await submitQuery(message);
                } catch (e) {
                    handleQueryError(e);
                }
            }),
        [executeInteraction, handleQueryError],
    );

    const onDiscoverClick = useCallback(
        async (event?: Event) =>
            executeInteraction(() => {
                const {
                    common: {
                        actions: { setView },
                    },
                    chat: {
                        actions: { clearCurrentThread },
                    },
                } = globalStore.getState().assistant;

                setView(ModalViewType.DISCOVER);
                clearCurrentThread();
            }, event),
        [executeInteraction],
    );

    const onOpenWithNewChat = useCallback(
        async (message?: string, event?: Event) =>
            executeInteraction(async () => {
                const {
                    chat: {
                        actions: { clearCurrentThread, submitQuery },
                    },
                    common: {
                        actions: { setView },
                    },
                } = globalStore.getState().assistant;

                setView(ModalViewType.NEW_CHAT);
                clearCurrentThread();

                if (message) {
                    try {
                        setQueryError(undefined);
                        await submitQuery(message);
                    } catch (e) {
                        handleQueryError(e);
                    }
                }
            }, event),
        [executeInteraction, handleQueryError],
    );

    const onOpen = useCallback(
        async (threadId?: number, event?: Event) =>
            executeInteraction(async () => {
                const {
                    chat: {
                        currentThreadId,
                        activeThreadId,
                        threads,
                        actions: { setCurrentThreadById },
                    },
                    common: {
                        actions: { setView },
                    },
                } = globalStore.getState().assistant;

                if (!threadId) {
                    threadId = currentThreadId;
                }

                setCurrentThreadById(threadId);

                if (!threadId) {
                    await onOpenWithNewChat();
                    return;
                }

                const isUnregisteredUserWithArchivedThread =
                    !user &&
                    threads.findIndex(
                        (thread) =>
                            thread.id === threadId &&
                            thread.id !== activeThreadId,
                    ) >= 0;

                if (isUnregisteredUserWithArchivedThread) {
                    setView(ModalViewType.REGISTER);
                } else {
                    setView(ModalViewType.CHAT);
                }
            }, event).then(() => {
                // TODO: make onOpen only cause one render, and move this out from then
                const {
                    isFirstTimeOpeningModal,
                    actions: { setIsFirstTimeOpeningModal },
                } = globalStore.getState().assistant.chat;

                if (isFirstTimeOpeningModal) {
                    setIsFirstTimeOpeningModal(false);
                }
            }),
        [executeInteraction, onOpenWithNewChat, user],
    );

    const onOpenWithActiveChat = useCallback(
        async (event?: Event) =>
            executeInteraction(async () => {
                const { activeThreadId } =
                    globalStore.getState().assistant.chat;

                await onOpen(activeThreadId);
            }, event),
        [executeInteraction, onOpen],
    );

    const onSearchOpen = useCallback(
        async (event?: Event) =>
            executeInteraction(() => {
                sendHotJarEvent('assistant search opened');
            }, event),
        [executeInteraction],
    );

    const onSearchClose = useCallback(
        async (event?: Event) =>
            executeInteraction(() => {
                const {
                    search: {
                        actions: { clearSearch },
                    },
                    common: { isGenerating },
                } = globalStore.getState().assistant;

                if (isGenerating) {
                    return;
                }

                clearSearch();
            }, event),
        [executeInteraction],
    );

    const onSearchQuerySubmit = useCallback(
        async (query: string, event?: Event) =>
            executeInteraction(async () => {
                const { submitSearchQuery } =
                    globalStore.getState().assistant.search.actions;

                await submitSearchQuery(query);
            }, event),
        [executeInteraction],
    );

    return {
        queryError,
        onClose,
        onContinueChat,
        onDiscoverClick,
        onMinimize,
        onOpen,
        onOpenWithActiveChat,
        onOpenWithNewChat,
        onSearchClose,
        onSearchOpen,
        onSearchQuerySubmit,
    };
};

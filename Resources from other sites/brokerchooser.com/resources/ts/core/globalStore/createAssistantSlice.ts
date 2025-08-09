import { StateCreator } from 'zustand';
import { FakeDoorVariant } from '../blocks/assistant/blocks/assistantFakeDoor/types/FakeDoorVariant';
import { MINIMIZED_MESSAGE_STORAGE_KEY } from '../blocks/assistant/blocks/assistantMinimizedModal/consts/minimizedMessageLocalStorageKey';
import { MessageAuthor } from '../blocks/assistant/consts/MessageAuthor';
import {
    CLOSED_VIEWS,
    ModalViewType,
    OPEN_VIEWS,
} from '../blocks/assistant/consts/ModalViewType';
import { SystemMessageType } from '../blocks/assistant/consts/SystemMessageType';
import { WebSocketConnectionStatus } from '../blocks/assistant/consts/WebSocketConnectionStatus';
import { AnswerSource } from '../blocks/assistant/types/AnswerSource';
import {
    AssistantSystemMessage,
    ChatMessage,
    UserMessage,
} from '../blocks/assistant/types/ChatMessageTypes';
import { DiscoverQuestion } from '../blocks/assistant/types/DiscoverQuestion';
import { Thread } from '../blocks/assistant/types/Thread';
import { getLocalStorageItem } from '../functions/localStorage';
import { sendHotJarEvent } from '../functions/sendHotJarEvent';
import { AssistantSlice } from './types/AssistantSlice';
import { GlobalState } from './types/GlobalState';

/*
 System messages are not sent to the server
 They live on the frontend only and they have negative index
 */
let systemMessageId = 0;

export const createAssistantSlice: StateCreator<
    GlobalState,
    [['zustand/immer', never]],
    [],
    AssistantSlice
> = (set, get) => {
    const setView = (view: ModalViewType) =>
        set((prevState) => {
            const isModalOpening =
                CLOSED_VIEWS.has(prevState.assistant.common.view) &&
                OPEN_VIEWS.has(view);

            if (isModalOpening) {
                sendHotJarEvent('assistant modal opened');
            }

            prevState.assistant.common.view = view;
        });

    const setCurrentThreadById = (id?: number) =>
        set((prevState) => {
            prevState.assistant.chat.currentThreadId = id;
        });

    const setFakeDoorModalVariantToDisplay = (variant?: FakeDoorVariant) =>
        set((prevState) => {
            prevState.assistant.common.fakeDoorModalVariant = variant;
        });

    const setIsGenerating = (value: boolean) =>
        set((prevState) => {
            prevState.assistant.common.isGenerating = value;
        });

    const clearSearch = () =>
        set((prevState) => {
            prevState.assistant.search.searchAnswer = '';
            prevState.assistant.search.searchResults = undefined;
        });

    const setConnectionStatus = (status: WebSocketConnectionStatus) =>
        set((prevState) => {
            prevState.assistant.common.connectionStatus = status;
        });

    const receiveMessageSegment = (segment: string) =>
        set((prevState) => {
            if (
                !segment ||
                prevState.assistant.chat.messageBuffer.incomingMessage === null
            ) {
                return;
            }

            prevState.assistant.chat.messageBuffer.incomingMessage.text +=
                segment;
        });

    const receiveSearchResult = (result: AnswerSource) =>
        set((prevState) => {
            if (!prevState.assistant.search.searchResults) {
                prevState.assistant.search.searchResults = [];
            }
            prevState.assistant.search.searchResults.push(result);
        });

    const receiveSearchSegment = (segment: string) =>
        set((prevState) => {
            if (!segment) {
                return;
            }
            prevState.assistant.search.searchAnswer += segment;
        });

    const receiveSource = (source: AnswerSource) =>
        set((prevState) => {
            if (
                prevState.assistant.chat.messageBuffer.incomingMessage === null
            ) {
                return;
            }

            prevState.assistant.chat.messageBuffer.incomingMessage.sources?.push(
                source,
            );
        });

    const appendNewAssistantMessage = (messageId: number) =>
        set((prevState) => {
            if (!prevState.assistant.chat.currentThreadId) {
                throw new Error('Current thread is not set.');
            }

            prevState.assistant.chat.messageBuffer.incomingMessage = {
                id: messageId,
                threadId: prevState.assistant.chat.currentThreadId,
                author: MessageAuthor.ASSISTANT,
                text: '',
                sources: [],
                rating: undefined,
                isGenerationFinished: false,
            };
        });

    const appendNewSystemMessage = (type: SystemMessageType) =>
        set((prevState) => {
            if (!prevState.assistant.chat.currentThreadId) {
                throw new Error('Current thread is not set.');
            }

            systemMessageId -= 1;

            const { threads, currentThreadId } = prevState.assistant.chat;

            const systemMessage: AssistantSystemMessage = {
                id: systemMessageId,
                author: MessageAuthor.SYSTEM,
                threadId: currentThreadId,
                text: '',
                type,
            };

            prevState.assistant.chat.messageStore.currentThreadMessages.push(
                systemMessage,
            );

            if (prevState.assistant.common.view !== ModalViewType.CHAT) {
                const thread = threads.find(({ id }) => id === currentThreadId);
                if (thread) {
                    thread.nrOfUnreadMessages += 1;
                }
            }
        });

    const appendNewUserMessage = (
        messageId: number,
        text: string,
        threadId: number,
    ) =>
        set((prevState) => {
            const newUserMessage: UserMessage = {
                id: messageId,
                threadId,
                author: MessageAuthor.USER,
                text,
            };

            prevState.assistant.chat.messageStore.currentThreadMessages.push(
                newUserMessage,
            );
        });

    const updateThreadById = (id: number, update: Partial<Thread>) =>
        set((prevState) => {
            const thread = prevState.assistant.chat.threads.find(
                ({ id: threadId }) => threadId === id,
            );
            if (thread) {
                Object.assign(thread, update);
            }
        });

    const handleGenerationEnd = () =>
        set((prevState) => {
            const { threads, currentThreadId } = prevState.assistant.chat;

            const newlyGeneratedMessage = {
                ...prevState.assistant.chat.messageBuffer.incomingMessage!,
                isGenerationFinished: true,
            };

            prevState.assistant.chat.messageStore.currentThreadMessages.push(
                newlyGeneratedMessage,
            );

            prevState.assistant.chat.messageBuffer.incomingMessage = null;

            if (prevState.assistant.common.view !== ModalViewType.CHAT) {
                const thread = threads.find(({ id }) => id === currentThreadId);
                if (thread) {
                    thread.nrOfUnreadMessages += 1;
                }
            }
        });

    const setThreads = (threads: Thread[]) =>
        set((prevState) => {
            prevState.assistant.chat.threads = threads;
        });

    const fetchMessagesForThread = async (threadId: number) => {
        const fetchedThreadMessaged =
            await window.BCAssistantApi.getThreadMessages(threadId);

        set((prevState) => {
            // Making sure that system messages are kept if it's the same thread and feedback wasn't sent
            let systemMessages: ChatMessage[] = [];
            const currentThread = get().assistant.chat.threads.find(
                ({ id }) => id === threadId,
            );
            if (currentThread && !currentThread.rating) {
                systemMessages =
                    get().assistant.chat.messageStore.currentThreadMessages.filter(
                        ({ author, threadId: messageThreadId }) =>
                            author === MessageAuthor.SYSTEM &&
                            messageThreadId === threadId,
                    );
            }

            prevState.assistant.chat.messageStore.currentThreadMessages = [
                ...fetchedThreadMessaged,
                ...systemMessages,
            ];
        });
    };

    const fetchMessagesForCurrentThread = async () => {
        const { currentThreadId } = get().assistant.chat;

        if (!currentThreadId) {
            return;
        }

        await fetchMessagesForThread(currentThreadId);
    };

    const fetchThreads = async () => {
        const { threads, latestThreadMessages } =
            await window.BCAssistantApi.getThreads();

        const activeThreadId = threads.length > 0 ? threads[0].id : undefined;

        set((prevState) => {
            prevState.assistant.chat.messageStore.currentThreadMessages =
                latestThreadMessages;
            prevState.assistant.chat.threads = threads;
            prevState.assistant.chat.currentThreadId = activeThreadId;
            prevState.assistant.chat.activeThreadId = activeThreadId;
        });
    };

    const createNewThread = (thread: Thread) =>
        set((prevState) => {
            prevState.assistant.chat.threads.unshift(thread);
            prevState.assistant.chat.currentThreadId = thread.id;
            prevState.assistant.chat.activeThreadId = thread.id;
            prevState.assistant.chat.messageStore.currentThreadMessages = [];
        });

    const submitQuery = async (query: string) => {
        const {
            common: { isGenerating, connectionStatus },
            chat: { currentThreadId },
        } = get().assistant;

        if (
            isGenerating ||
            query.length === 0 ||
            connectionStatus !== WebSocketConnectionStatus.CONNECTED
        ) {
            return;
        }

        let response;
        try {
            setIsGenerating(true);
            response = await window.BCAssistantApi.submitQuery(
                query,
                currentThreadId,
            );
            const isNewThread = currentThreadId === undefined;
            if (isNewThread) {
                const thread: Thread = {
                    id: response.threadId,
                    title: query,
                    nrOfUnreadMessages: 0,
                };
                createNewThread(thread);
                // Transition from ModalViewType.NEW_CHAT
                setView(ModalViewType.CHAT);
            }
        } catch (error) {
            // TODO: display some kind of error to the user.
            setIsGenerating(false);
            throw error;
        }
        appendNewUserMessage(response.messageId, query, response.threadId);
    };

    const submitSearchQuery = async (query: string) => {
        const { isGenerating, connectionStatus } = get().assistant.common;

        if (
            isGenerating ||
            query.length === 0 ||
            connectionStatus !== WebSocketConnectionStatus.CONNECTED
        ) {
            return;
        }

        try {
            clearSearch();
            setIsGenerating(true);
            await window.BCAssistantApi.submitSearchQuery(query);
        } catch (error) {
            // TODO: display some kind of error to the user.
            setIsGenerating(false);
            throw error;
        }
    };

    const setDiscoverQuestions = (discoverQuestions: DiscoverQuestion[]) =>
        set((prevState) => {
            prevState.assistant.chat.discoverQuestions = discoverQuestions;
        });

    const clearCurrentThread = () =>
        set((prevState) => {
            prevState.assistant.chat.currentThreadId = undefined;
            prevState.assistant.chat.messageStore.currentThreadMessages = [];
        });

    const fetchDiscoverQuestions = async () => {
        const { discoverQuestions } = get().assistant.chat;

        if (discoverQuestions.length > 0) {
            return;
        }

        const questions = await window.BCAssistantApi.getQuestions();
        setDiscoverQuestions(questions);
    };

    const incrementDiscoverQuestionClicks = async (questionId: number) => {
        await window.BCAssistantApi.incrementQuestionClick(questionId);
    };
    const giveMessageFeedback = async (messageId: number, rating: boolean) => {
        await window.BCAssistantApi.giveFeedback(messageId, rating);

        set((prevState) => {
            prevState.assistant.chat.messageStore.currentThreadMessages.forEach(
                (message) =>
                    message.id === messageId ? { ...message, rating } : message,
            );
        });
    };

    const handleCloseAssistantPlanPromoModal = () =>
        set((prevState) => {
            prevState.assistant.chat.isAssistantPlanPromoModalOpen = false;
        });

    const handleOpenPlanRegistrationPushButtonClick = () =>
        set((prevState) => {
            prevState.assistant.chat.isAssistantPlanPromoModalOpen = true;
        });

    const defaultView =
        getLocalStorageItem(MINIMIZED_MESSAGE_STORAGE_KEY) !== null
            ? ModalViewType.MINIMIZED
            : ModalViewType.CLOSED;

    const setIsFirstTimeOpeningModal = (value: boolean) => {
        set((prevState) => {
            prevState.assistant.chat.isFirstTimeOpeningModal = value;
        });
    };

    return {
        search: {
            searchAnswer: '',
            searchResults: undefined,
            actions: {
                clearSearch,
                receiveSearchResult,
                receiveSearchSegment,
                submitSearchQuery,
            },
        },
        chat: {
            activeThreadId: undefined,
            currentThreadId: undefined,
            discoverQuestions: [],
            isAssistantPlanPromoModalOpen: false,
            threads: [],
            isFirstTimeOpeningModal: true,
            messageStore: {
                currentThreadMessages: [],
            },
            messageBuffer: {
                incomingMessage: null,
            },
            actions: {
                appendNewAssistantMessage,
                appendNewSystemMessage,
                appendNewUserMessage,
                clearCurrentThread,
                fetchDiscoverQuestions,
                fetchMessagesForCurrentThread,
                fetchMessagesForThread,
                fetchThreads,
                giveMessageFeedback,
                handleCloseAssistantPlanPromoModal,
                handleOpenPlanRegistrationPushButtonClick,
                incrementDiscoverQuestionClicks,
                receiveMessageSegment,
                receiveSource,
                setCurrentThreadById,
                setThreads,
                submitQuery,
                updateThreadById,
                setIsFirstTimeOpeningModal,
            },
        },
        common: {
            connectionStatus: WebSocketConnectionStatus.NOT_ATTEMPTED,
            isGenerating: false,
            fakeDoorModalVariant: undefined,
            view: defaultView,
            actions: {
                handleGenerationEnd,
                setConnectionStatus,
                setFakeDoorModalVariantToDisplay,
                setIsGenerating,
                setView,
            },
        },
    };
};

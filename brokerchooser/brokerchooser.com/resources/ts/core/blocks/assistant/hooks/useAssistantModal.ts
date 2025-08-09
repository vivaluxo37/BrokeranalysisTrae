import { useCallback, useEffect, useMemo, useState } from 'react';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { ModalViewType, OPEN_VIEWS } from '../consts/ModalViewType';
import { WebSocketConnectionStatus } from '../consts/WebSocketConnectionStatus';
import { useAssistantInteractions } from './useAssistantInteractions';

export const useAssistantModal = (shouldOpenAutomatically: boolean) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const currentThreadId = useGlobalStore(
        (state) => state.assistant.chat.currentThreadId,
    );
    const connectionStatus = useGlobalStore(
        (state) => state.assistant.common.connectionStatus,
    );
    const isGenerating = useGlobalStore(
        (state) => state.assistant.common.isGenerating,
    );
    const view = useGlobalStore((state) => state.assistant.common.view);
    const fetchDiscoverQuestions = useGlobalStore(
        (state) => state.assistant.chat.actions.fetchDiscoverQuestions,
    );
    const fetchMessagesForThread = useGlobalStore(
        (state) => state.assistant.chat.actions.fetchMessagesForThread,
    );

    const { onOpen } = useAssistantInteractions();

    useEffect(() => {
        if (shouldOpenAutomatically) {
            onOpen().then();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (view === ModalViewType.DISCOVER) {
            fetchDiscoverQuestions().then();
            return;
        }

        if (view !== ModalViewType.CHAT) {
            return;
        }

        const isSwitchToAnotherThread =
            !isGenerating && currentThreadId !== undefined;
        if (isSwitchToAnotherThread) {
            // TODO: only fetch if we don't have it
            fetchMessagesForThread(currentThreadId).then();
        }
        // currentThreadId is intentionally added to deps as we want to trigger
        // this code every time the user clicks on an archived thread.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, currentThreadId]);

    useEffect(() => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
        // Close the sidebar anytime the view or the thread changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, currentThreadId]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prevState) => !prevState);
        const event = getGeneralElementClickEventData({
            measurementListId: 'assistant sidebar toggle',
            elementId: isSidebarOpen ? 'close' : 'open',
        });

        sendGA4Event(event);
    }, [isSidebarOpen]);

    const isOpen = useMemo(() => OPEN_VIEWS.has(view), [view]);

    const shouldDisplayMinimizedModal = useMemo(
        () => view === ModalViewType.MINIMIZED,
        [view],
    );

    const shouldShowConnectionError = useMemo(
        () => connectionStatus === WebSocketConnectionStatus.FAILED,
        [connectionStatus],
    );

    const isFullWidthView: boolean = useMemo(
        () => view === ModalViewType.DISCOVER,
        [view],
    );

    return {
        isOpen,
        shouldDisplayMinimizedModal,
        isSidebarOpen,
        shouldShowConnectionError,
        toggleSidebar,
        isFullWidthView,
    };
};

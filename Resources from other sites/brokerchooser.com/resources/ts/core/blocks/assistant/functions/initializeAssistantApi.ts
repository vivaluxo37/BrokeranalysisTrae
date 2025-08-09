import { isServer } from '../../../../util/isServer';
import { globalStore } from '../../../globalStore/globalStore';

export const initializeAssistantApi = async () => {
    if (isServer()) {
        return;
    }

    if (
        import.meta.env.MODE === 'development' &&
        import.meta.env.VITE_NURI_DEV_TESTING === 'true'
    ) {
        const { AssistantTestingApi } = await import(
            '../api/AssistantTestingApi'
        );
        window.BCAssistantApi = new AssistantTestingApi();
    } else {
        const { AssistantApi } = await import('../api/AssistantApi');
        window.BCAssistantApi = new AssistantApi();
    }

    const {
        search: {
            actions: { receiveSearchResult, receiveSearchSegment },
        },
        chat: {
            actions: {
                appendNewAssistantMessage,
                fetchMessagesForCurrentThread,
                receiveMessageSegment,
                receiveSource,
            },
        },
        common: {
            actions: {
                setIsGenerating,
                handleGenerationEnd,
                setConnectionStatus,
            },
        },
    } = globalStore.getState().assistant;

    window.BCAssistantApi.initialize({
        getIsGenerating: () =>
            globalStore.getState().assistant.common.isGenerating,
        onMessageEnd: handleGenerationEnd,
        onMessageSegmentReceived: receiveMessageSegment,
        onMessageStart: appendNewAssistantMessage,
        onReconnect: fetchMessagesForCurrentThread,
        onSearchResultReceived: receiveSearchResult,
        onSearchSegmentReceived: receiveSearchSegment,
        onSourceReceived: receiveSource,
        setConnectionStatus,
        setIsGenerating,
    });
};

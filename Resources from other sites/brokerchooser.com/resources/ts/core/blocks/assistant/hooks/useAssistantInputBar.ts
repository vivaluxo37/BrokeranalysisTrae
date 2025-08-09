import { useMemo, useState } from 'react';
import { isServer } from '../../../../util/isServer';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { OPEN_VIEWS } from '../consts/ModalViewType';
import { WebSocketConnectionStatus } from '../consts/WebSocketConnectionStatus';

export const useAssistantInputBar = () => {
    const isGenerating = useGlobalStore(
        (state) => state.assistant.common.isGenerating,
    );
    const view = useGlobalStore((state) => state.assistant.common.view);
    const connectionStatus = useGlobalStore(
        (state) => state.assistant.common.connectionStatus,
    );

    const [input, setInput] = useState<string>('');

    const isWebSocketConnected = useMemo(
        () =>
            !isServer() &&
            (import.meta.env.VITE_NURI_DEV_TESTING === 'true' ||
                connectionStatus === WebSocketConnectionStatus.CONNECTED),
        [connectionStatus],
    );

    const isInputDisabled = useMemo(
        () => OPEN_VIEWS.has(view) && (isGenerating || !isWebSocketConnected),
        [isGenerating, isWebSocketConnected, view],
    );

    return { input, isInputDisabled, setInput };
};

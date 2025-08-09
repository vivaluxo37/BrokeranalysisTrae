import React, { FC, useMemo } from 'react';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { ModalViewType } from '../consts/ModalViewType';
import { AssistantLandingView } from './AssistantLandingView';
import { AssistantMessageList } from './AssistantMessageList';
import { AssistantRegisterPopup } from './AssistantRegisterPopup';
import { DiscoverFeed } from './DiscoverFeed';

export const AssistantViewSwitcher: FC = () => {
    const view = useGlobalStore((state) => state.assistant.common.view);

    return useMemo(() => {
        switch (view) {
            case ModalViewType.CHAT:
                return <AssistantMessageList />;
            case ModalViewType.NEW_CHAT:
                return <AssistantLandingView />;
            case ModalViewType.DISCOVER:
                return <DiscoverFeed />;
            case ModalViewType.REGISTER:
                return <AssistantRegisterPopup />;
            default:
                return null;
        }
    }, [view]);
};

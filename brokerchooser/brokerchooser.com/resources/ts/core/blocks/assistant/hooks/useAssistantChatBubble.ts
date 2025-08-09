import { useCallback, useMemo } from 'react';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { useGlobalStore } from '../../../globalStore/globalStore';
import {
    ASSISTANT_CONTEXT_ON_OPEN,
    ASSISTANT_ELEMENT_ID,
    ASSISTANT_MEASUREMENT_LIST_ID,
} from '../consts/measurementIds';
import { ModalViewType } from '../consts/ModalViewType';
import { useAssistantBottomOffset } from './useAssistantBottomOffset';
import { useAssistantInteractions } from './useAssistantInteractions';

export const useAssistantChatBubble = () => {
    const view = useGlobalStore((state) => state.assistant.common.view);

    const { onOpen } = useAssistantInteractions();

    const bottomOffsetClassName = useAssistantBottomOffset();

    const shouldHide = useMemo(() => view !== ModalViewType.CLOSED, [view]);

    const onClick = useCallback(async () => {
        const event = getGeneralElementClickEventData({
            measurementListId: ASSISTANT_MEASUREMENT_LIST_ID,
            elementId: ASSISTANT_ELEMENT_ID,
            context: ASSISTANT_CONTEXT_ON_OPEN,
        });

        await onOpen(undefined, event);
    }, [onOpen]);

    return {
        bottomOffsetClassName,
        onClick,
        shouldHide,
    };
};

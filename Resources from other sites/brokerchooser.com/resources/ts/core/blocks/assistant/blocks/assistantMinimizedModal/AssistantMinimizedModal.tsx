import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getGeneralElementClickEventData } from '../../../../../util/measurement/functions/eventCreatorFunctions';
import { getLocalStorageItem } from '../../../../functions/localStorage';
import {
    ASSISTANT_ELEMENT_ID,
    ASSISTANT_MINIMIZED_MEASUREMENT_LIST_ID,
} from '../../consts/measurementIds';
import { AssistantChatBubbleBadge } from '../../elements/AssistantChatBubbleBadge';
import { EnlargeIcon } from '../../elements/icons/EnlargeIcon';
import { useAssistantBottomOffset } from '../../hooks/useAssistantBottomOffset';
import { useAssistantInteractions } from '../../hooks/useAssistantInteractions';
import { MINIMIZED_MESSAGE_STORAGE_KEY } from './consts/minimizedMessageLocalStorageKey';

export const AssistantMinimizedModal: FC<{
    totalUnreadMessages: number;
}> = ({ totalUnreadMessages }) => {
    const { t } = useTranslation();
    const { onOpen, onClose } = useAssistantInteractions();
    const bottomOffsetClassName = useAssistantBottomOffset();

    const latestUserMessage = useMemo(
        () => getLocalStorageItem(MINIMIZED_MESSAGE_STORAGE_KEY),
        [],
    );

    const handleOpen = useCallback(() => {
        const eventOnOpen = getGeneralElementClickEventData({
            measurementListId: ASSISTANT_MINIMIZED_MEASUREMENT_LIST_ID,
            elementId: ASSISTANT_ELEMENT_ID,
        });

        onOpen(undefined, eventOnOpen);
    }, [onOpen]);

    if (latestUserMessage === null) {
        return null;
    }

    return (
        <div
            className={classNames(
                bottomOffsetClassName,
                'fixed end-4 z-50 flex w-full max-w-72 gap-x-2 md:max-w-xs rtl:flex-row',
            )}
        >
            <ButtonOrLink
                text=""
                variant="tertiary"
                className="size-8 shrink-0 bg-white drop-shadow-md"
                onClick={onClose}
            >
                <XMarkIcon className="size-4 stroke-slate-950" />
            </ButtonOrLink>
            <button
                type="button"
                onClick={handleOpen}
                className="flex w-full flex-col gap-y-2 overflow-clip rounded-lg bg-white shadow-md"
            >
                <div className="flex w-full items-center justify-between bg-nuri-gradient">
                    <span className="px-2 text-xs font-semibold leading-none text-white">
                        Nuri AI
                    </span>
                    <EnlargeIcon className="m-2 size-4 rtl:scale-x-[-1]" />
                </div>
                <div className="flex flex-col gap-y-1 px-2 pb-2 text-start leading-3.5">
                    <span className="text-2xs font-normal text-slate-500">
                        {t('Last topic')}
                    </span>
                    <p className="line-clamp-2 text-xs font-normal text-slate-950">
                        {latestUserMessage}
                    </p>
                </div>
                {totalUnreadMessages > 0 && (
                    <AssistantChatBubbleBadge
                        counter={totalUnreadMessages}
                        className="absolute -end-2 -top-2"
                    />
                )}
            </button>
        </div>
    );
};

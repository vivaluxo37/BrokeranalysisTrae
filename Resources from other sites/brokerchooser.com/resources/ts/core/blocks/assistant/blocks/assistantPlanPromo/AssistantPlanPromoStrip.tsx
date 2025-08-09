import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { FC, useCallback } from 'react';
import { Trans } from 'react-i18next';
import { getGeneralElementClickEventData } from '../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../util/measurement/functions/sendGA4Event';
import { useGlobalStore } from '../../../../globalStore/globalStore';
import { ModalViewType } from '../../consts/ModalViewType';
import { SparklesIconColored } from '../../elements/icons/SparklesIconColored';

export const AssistantPlanPromoStrip: FC<{ onClose: () => void }> = ({
    onClose,
}) => {
    const handleOpenPlanRegistrationPushButtonClick = useGlobalStore(
        (state) =>
            state.assistant.chat.actions
                .handleOpenPlanRegistrationPushButtonClick,
    );

    const handleClick = useCallback(() => {
        const event = getGeneralElementClickEventData({
            measurementListId: 'assistant landing view plan registration push',
        });
        sendGA4Event(event);
        handleOpenPlanRegistrationPushButtonClick();
    }, [handleOpenPlanRegistrationPushButtonClick]);

    const view = useGlobalStore((state) => state.assistant.common.view);

    if (view !== ModalViewType.NEW_CHAT && view !== ModalViewType.CHAT) {
        return null;
    }

    return (
        <ButtonOrLink
            text="nuri plans"
            variant="tertiary"
            className="mb-4 !p-0 focus:rounded-sm focus:outline-blue-800"
            bodyClassName="!p-0 !text-start w-full"
            onClick={handleClick}
        >
            <div className="relative flex items-center gap-2 bg-blue-500 px-4 py-2 lg:hidden">
                <div className="animate absolute left-0 z-10 h-full w-full animate-assistant-promo-strip-ping rounded-sm bg-blue-500 opacity-75" />
                <div className="z-10 flex rounded-lg bg-white p-2">
                    <SparklesIconColored className="m-auto size-6" />
                </div>
                <div className="z-10 text-sm font-semibold text-white">
                    {/* prettier-ignore */}
                    <Trans i18nKey="Unlock <1>Nuri Plus</1> - Get Personalized Insights for FREE!">
                    Unlock <span className="underline">Nuri Plus</span> - Get Personalized Insights for FREE!
                </Trans>
                </div>
                <XMarkIcon
                    className="z-10 ms-auto size-10 rounded-md p-3 text-white hover:bg-blue-400"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                />
            </div>
        </ButtonOrLink>
    );
};

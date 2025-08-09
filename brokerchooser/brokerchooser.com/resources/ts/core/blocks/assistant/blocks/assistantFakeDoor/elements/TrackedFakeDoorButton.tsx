import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { Tooltip } from '@design-system/components/surfaces/tooltip/Tooltip';
import {
    DocumentDuplicateIcon,
    MicrophoneIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../../../../globalStore/globalStore';
import { FakeDoorVariant } from '../types/FakeDoorVariant';

export const TrackedFakeDoorButton: FC<{ variant?: FakeDoorVariant }> = ({
    variant = FakeDoorVariant.VOICE_MESSAGE,
}) => {
    const { t } = useTranslation();

    const setFakeDoorModalVariantToDisplay = useGlobalStore(
        (state) =>
            state.assistant.common.actions.setFakeDoorModalVariantToDisplay,
    );

    const fakeDoorButtonTooltip = (
        {
            [FakeDoorVariant.VOICE_MESSAGE]: t('Switch to voice conversation'),
            [FakeDoorVariant.COPY_RESPONSE]: t('Copy this response'),
            [FakeDoorVariant.EDIT_QUESTION]: t('Edit or refine the question'),
        } as Record<FakeDoorVariant, string>
    )[variant];

    return (
        <Tooltip
            content={fakeDoorButtonTooltip}
            trackingProps={{
                measurementListId: 'assistant fake door button tooltip',
            }}
        >
            <TrackedButtonOrLink
                text=""
                variant="tertiary"
                className="w-min !p-2"
                bodyClassName="!px-0"
                onClick={() => setFakeDoorModalVariantToDisplay(variant)}
                measurementListId="assistant fake door button"
                elementId={variant}
            >
                {variant === FakeDoorVariant.VOICE_MESSAGE && (
                    <MicrophoneIcon className="size-5 stroke-slate-400" />
                )}
                {variant === FakeDoorVariant.EDIT_QUESTION && (
                    <PencilIcon className="size-5 stroke-slate-400" />
                )}
                {variant === FakeDoorVariant.COPY_RESPONSE && (
                    <DocumentDuplicateIcon className="size-5 stroke-slate-400" />
                )}
            </TrackedButtonOrLink>
        </Tooltip>
    );
};

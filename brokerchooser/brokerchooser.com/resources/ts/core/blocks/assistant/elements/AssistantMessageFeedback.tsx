import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { TrackedLink } from '@design-system/components/navigation/link/TrackedLink';
import {
    HandThumbDownIcon,
    HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIsAssistantCopyFakeDoorAbTestRunning } from '../../../hooks/abTest/specific/useIsAssistantCopyFakeDoorAbTestRunning';
import { TrackedFakeDoorButton } from '../blocks/assistantFakeDoor/elements/TrackedFakeDoorButton';
import { FakeDoorVariant } from '../blocks/assistantFakeDoor/types/FakeDoorVariant';
import { ASSISTANT_FEEDBACK_MEASUREMENT_LIST_ID } from '../consts/measurementIds';
import { useAssistantMessageFeedback } from '../hooks/useAssistantMessageFeedback';
import { AssistantMessage } from '../types/ChatMessageTypes';

export const AssistantMessageFeedback: React.FC<{
    message: AssistantMessage;
}> = ({ message }) => {
    const { t } = useTranslation();

    const { isForumLinkVisible, submitFeedback } =
        useAssistantMessageFeedback(message);

    const shouldShowCopyResponseFakeDoor =
        useIsAssistantCopyFakeDoorAbTestRunning();

    return (
        <div className="flex flex-wrap items-center gap-1">
            <TrackedButtonOrLink
                text=""
                disabled={message.rating !== undefined}
                variant="tertiary"
                className="!p-2"
                bodyClassName="!px-0"
                measurementListId={ASSISTANT_FEEDBACK_MEASUREMENT_LIST_ID}
                elementId="like button"
                onClick={() => submitFeedback(true)}
            >
                <HandThumbUpIcon
                    className={classNames(
                        'size-5 stroke-slate-400',
                        message.rating === true && '!stroke-secondary-500',
                    )}
                />
            </TrackedButtonOrLink>
            <TrackedButtonOrLink
                text=""
                disabled={message.rating !== undefined}
                variant="tertiary"
                className="!p-2"
                bodyClassName="!px-0"
                measurementListId={ASSISTANT_FEEDBACK_MEASUREMENT_LIST_ID}
                elementId="dislike button"
                onClick={() => submitFeedback(false)}
            >
                <HandThumbDownIcon
                    className={classNames(
                        'size-5 stroke-slate-400',
                        message.rating === false && '!stroke-secondary-500',
                    )}
                />
            </TrackedButtonOrLink>
            {shouldShowCopyResponseFakeDoor && (
                <TrackedFakeDoorButton
                    variant={FakeDoorVariant.COPY_RESPONSE}
                />
            )}
            {isForumLinkVisible && (
                <div className="flex flex-col text-xs text-slate-500">
                    {t(
                        'We are sorry that you were not happy with the response.',
                    )}
                    <TrackedLink
                        href="https://community.brokerchooser.com/"
                        target="_blank"
                        className="font-xs !ps-0 font-light text-slate-500 underline !decoration-slate-500 !decoration-solid"
                        measurementListId={
                            ASSISTANT_FEEDBACK_MEASUREMENT_LIST_ID
                        }
                        elementId="dislike button forum link"
                    >
                        {t(
                            'You can ask our analyst team for help on our forum.',
                        )}
                    </TrackedLink>
                </div>
            )}
        </div>
    );
};

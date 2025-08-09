import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    getGeneralElementClickEventData,
    getGenericEventData,
} from '../../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../../util/measurement/functions/sendGA4Event';
import { useGlobalStore } from '../../../../../globalStore/globalStore';
import { ASSISTANT_FEEDBACK_MEASUREMENT_ID } from '../../../consts/measurementIds';
import { SystemMessageType } from '../../../consts/SystemMessageType';
import { AssistantChatMessageComponentBody } from '../../../elements/AssistantChatMessageComponentBody';
import { FeedbackSmile1 } from './icons/FeedbackSmile1';
import { FeedbackSmile2 } from './icons/FeedbackSmile2';
import { FeedbackSmile3 } from './icons/FeedbackSmile3';
import { FeedbackSmile4 } from './icons/FeedbackSmile4';
import { FeedbackSmile5 } from './icons/FeedbackSmile5';

const feedBackMessages = [
    {
        value: 1,
        icon: FeedbackSmile1,
    },
    {
        value: 2,
        icon: FeedbackSmile2,
    },
    {
        value: 3,
        icon: FeedbackSmile3,
    },
    {
        value: 4,
        icon: FeedbackSmile4,
    },
    {
        value: 5,
        icon: FeedbackSmile5,
    },
];

export const AssistantSystemFeedbackMessageComponent: FC = () => {
    const { t } = useTranslation();

    const [selectedFeedback, setSelectedFeedback] = useState<number | null>(
        null,
    );

    const handleFeedBack = useCallback((feedback: number) => {
        const clickEvent = getGeneralElementClickEventData({
            measurementListId: ASSISTANT_FEEDBACK_MEASUREMENT_ID,
            context: 'click',
            elementId: feedback.toString(),
        });
        sendGA4Event(clickEvent);
        setSelectedFeedback(feedback);
    }, []);

    const currentThreadId = useGlobalStore(
        (state) => state.assistant.chat.currentThreadId,
    );
    const updateThreadById = useGlobalStore(
        (state) => state.assistant.chat.actions.updateThreadById,
    );
    const appendNewSystemMessage = useGlobalStore(
        (state) => state.assistant.chat.actions.appendNewSystemMessage,
    );

    const [feedbackSent, setFeedbackSent] = useState(false);
    useEffect(() => {
        if (!currentThreadId || selectedFeedback === null) {
            return () => {};
        }
        const timeout = setTimeout(async () => {
            await window.BCAssistantApi.giveFeedbackOnThread(
                currentThreadId,
                selectedFeedback,
            );

            setFeedbackSent(true);
            updateThreadById(currentThreadId, {
                rating: selectedFeedback,
            });
            appendNewSystemMessage(SystemMessageType.FEEDBACK_FOLLOW_UP);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [
        appendNewSystemMessage,
        currentThreadId,
        selectedFeedback,
        updateThreadById,
    ]);

    useEffect(() => {
        const event = getGenericEventData({
            measurementListId: ASSISTANT_FEEDBACK_MEASUREMENT_ID,
            context: 'appeared',
        });
        sendGA4Event(event);
    }, []);

    return (
        <AssistantChatMessageComponentBody>
            <div className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-xl border border-slate-300 p-4 pb-2 shadow">
                {feedbackSent ? (
                    <>
                        <CheckCircleIcon className="mx-auto size-8 text-success-500" />
                        <p className="text-center text-sm leading-tight text-slate-950">
                            {t('Got it! Thanks for your response!')}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-center text-sm leading-tight text-slate-950">
                            {t(
                                'How am I doing so far? Let me know by tapping one of these!',
                            )}
                        </p>
                        <div className="flex justify-center gap-2">
                            {feedBackMessages.map(({ value, icon: Icon }) => (
                                <ButtonOrLink
                                    key={value}
                                    text="give feedback"
                                    variant="tertiary"
                                    size="sm"
                                    className="!px-0 !py-0"
                                    bodyClassName="!p-0"
                                    onClick={() => handleFeedBack(value)}
                                >
                                    <Icon
                                        key={value}
                                        className={classNames('size-10', {
                                            'fill-slate-500':
                                                selectedFeedback === null,
                                            'fill-slate-300':
                                                selectedFeedback !== null &&
                                                selectedFeedback !== value,
                                            'fill-blue-500':
                                                selectedFeedback === value,
                                        })}
                                    />
                                </ButtonOrLink>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </AssistantChatMessageComponentBody>
    );
};

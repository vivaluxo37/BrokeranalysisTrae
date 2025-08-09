import { Chips } from '@design-system/components/inputs/chips/Chips';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    getGeneralElementClickEventData,
    getGenericEventData,
} from '../../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../../util/measurement/functions/sendGA4Event';
import { sendHotJarEvent } from '../../../../../functions/sendHotJarEvent';
import { useGlobalStore } from '../../../../../globalStore/globalStore';
import { ASSISTANT_FEEDBACK_FOLLOW_UP_MEASUREMENT_ID } from '../../../consts/measurementIds';
import { AssistantChatMessageComponentBody } from '../../../elements/AssistantChatMessageComponentBody';

export const AssistantSystemFeedbackFollowUpMessageComponent: FC = () => {
    const { t } = useTranslation();

    const [selectedResponses, setSelectedResponses] = useState<string[] | null>(
        null,
    );
    const [responseSent, setResponseSent] = useState(false);

    const currentThreadId = useGlobalStore(
        (state) => state.assistant.chat.currentThreadId,
    );

    const threads = useGlobalStore((state) => state.assistant.chat.threads);

    const feedBackType = useMemo(() => {
        const thread = threads.find(({ id }) => id === currentThreadId);
        if (!thread) {
            return null;
        }
        if (thread.rating === undefined || thread.rating === null) {
            return null;
        }
        if (thread.rating > 3) {
            return 'positive';
        }
        if (thread.rating < 3) {
            return 'negative';
        }
        return null;
    }, [currentThreadId, threads]);

    const followUpItems = useMemo(
        () => ({
            negative: [
                {
                    value: '1',
                    label: t('Doesn’t answer my questions'),
                },
                {
                    value: '2',
                    label: t('Incorrect answers'),
                },
                {
                    value: '3',
                    label: t('Too generic, not personalized'),
                },
                {
                    value: '4',
                    label: t('Too complicated'),
                },
                {
                    value: '5',
                    label: t('Confusing interface'),
                },
                {
                    value: '6',
                    label: t('Feels too robotic and unnatural'),
                },
            ],
            positive: [
                {
                    value: '7',
                    label: t('Answers are accurate and helpful'),
                },
                {
                    value: '8',
                    label: t('Personalized and relevant'),
                },
                {
                    value: '9',
                    label: t('Clear and easy to understand'),
                },
                {
                    value: '10',
                    label: t('User-friendly interface'),
                },
                {
                    value: '11',
                    label: t('Feels natural and engaging'),
                },
            ],
        }),
        [t],
    );

    const handleResponseSelection = useCallback((response: string) => {
        setSelectedResponses((prev) => {
            const clickEvent = getGeneralElementClickEventData({
                measurementListId: ASSISTANT_FEEDBACK_FOLLOW_UP_MEASUREMENT_ID,
                context: 'click',
                elementId: response,
            });
            sendGA4Event(clickEvent);

            const newState = prev ?? [];

            if (newState.includes(response)) {
                return newState.filter((r) => r !== response);
            }
            return [...newState, response];
        });
    }, []);

    useEffect(() => {
        if (!currentThreadId || selectedResponses === null) {
            return () => {};
        }
        setResponseSent(false);
        const timeout = setTimeout(async () => {
            await window.BCAssistantApi.giveFollowUpAnswerOnThread(
                currentThreadId,
                selectedResponses.map((response) => parseInt(response, 10)),
            );
            setResponseSent(true);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [currentThreadId, selectedResponses]);

    useEffect(() => {
        sendHotJarEvent(ASSISTANT_FEEDBACK_FOLLOW_UP_MEASUREMENT_ID);
        const event = getGenericEventData({
            measurementListId: ASSISTANT_FEEDBACK_FOLLOW_UP_MEASUREMENT_ID,
            context: 'appeared',
        });
        sendGA4Event(event);
    }, []);

    if (!feedBackType) {
        return null;
    }

    return (
        <AssistantChatMessageComponentBody>
            <p className="text-center md:text-start">
                {t(
                    'Which options best describe your experience? Please select all that apply.',
                )}
            </p>
            <div className="mt-4 flex flex-col justify-center gap-4 md:flex-row md:flex-wrap">
                {followUpItems[feedBackType].map(({ label, value }) => (
                    <Chips
                        key={value}
                        selected={
                            selectedResponses !== null &&
                            selectedResponses.includes(value)
                        }
                        label={label}
                        value={value}
                        onClick={handleResponseSelection}
                    />
                ))}
            </div>
            {responseSent ? (
                <p className="mt-4 text-center text-sm font-semibold text-slate-500">
                    {t('Noted! Thanks for helping me improve!')}
                </p>
            ) : (
                <div className="mt-4 h-5" />
            )}
        </AssistantChatMessageComponentBody>
    );
};

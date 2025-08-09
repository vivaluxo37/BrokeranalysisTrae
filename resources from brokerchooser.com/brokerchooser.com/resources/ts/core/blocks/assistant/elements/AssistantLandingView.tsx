import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isServer } from '../../../../util/isServer';
import { Event } from '../../../../util/measurement/eventTypes';
import { runByConsent } from '../../../functions/runByConsent';
import {
    getSessionStorageItem,
    setSessionStorageItem,
} from '../../../functions/sessionStorage';
import { ConsentLevel } from '../../../types/ConsentLevel';
import { ASSISTANT_DISCOVER_ASSISTANT_LANDING_MEASUREMENT_LIST_ID } from '../consts/measurementIds';
import { MessageAuthor } from '../consts/MessageAuthor';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';
import { useSuggestedQueries } from '../hooks/useSuggestedQueries';
import { useTypewriterEffectOnText } from '../hooks/useTypewriterEffectOnText';
import { AssistantChatMessageComponent } from './AssistantChatMessageComponent';
import { SuggestedQueries } from './SuggestedQueries';

const NURI_INTRODUCTION_MESSAGE_WAS_ANIMATED =
    'nuri_introduction_message_was_animated';

export const AssistantLandingView: FC = () => {
    const { t } = useTranslation();
    const { onDiscoverClick } = useAssistantInteractions();
    const { suggestedQueries } = useSuggestedQueries();

    const discoverClickEvent: Event = {
        measurementListId:
            ASSISTANT_DISCOVER_ASSISTANT_LANDING_MEASUREMENT_LIST_ID,
        eventName: 'click',
        elementId: 'search',
        context: 'sessionId',
    };

    const initialNuriMessage = useMemo(() => {
        const text1 = t(
            "Hey there! \uD83D\uDC4B I'm Nuri, your personal AI assistant. Think of me as your shortcut to all things investing and brokerage. I'm here to help you find your perfect broker or answer any questions you have.",
        );
        const text2 = t(
            'How can I help you today? You can ask me anything or check out these popular questions:',
        );

        return `${text1}<br><br>${text2}`;
    }, [t]);

    const wasAnimated = useMemo(() => {
        if (isServer()) {
            return false;
        }
        return !!getSessionStorageItem(NURI_INTRODUCTION_MESSAGE_WAS_ANIMATED);
    }, []);

    const handleTextAnimationFinish = useCallback(() => {
        runByConsent(
            () =>
                setSessionStorageItem({
                    key: NURI_INTRODUCTION_MESSAGE_WAS_ANIMATED,
                    value: 'true',
                }),
            ConsentLevel.Experience,
        );
    }, []);

    const { animatedText, isAnimationFinished } = useTypewriterEffectOnText({
        text: initialNuriMessage,
        onAnimationFinished: handleTextAnimationFinish,
        animationOff: wasAnimated,
    });

    return (
        <div className="z-10 size-full self-center overflow-y-auto px-4 lg:mt-8 lg:w-full lg:p-0">
            <AssistantChatMessageComponent
                showFeedback={false}
                message={{
                    author: MessageAuthor.ASSISTANT,
                    isGenerationFinished: true,
                    threadId: -1,
                    id: -1,
                    text: animatedText,
                }}
            />

            {isAnimationFinished && (
                <div className="mt-4 flex flex-col items-center gap-y-6 lg:px-28">
                    <SuggestedQueries queries={suggestedQueries} />
                    <ButtonOrLink
                        variant="tertiary"
                        text={t('Discover more topics')}
                        onClick={() => onDiscoverClick(discoverClickEvent)}
                    />
                </div>
            )}
        </div>
    );
};

import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import classNames from 'classnames';
import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { DiscoverQuestionType } from '../consts/DiscoverQuestionType';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';
import { DiscoverQuestion } from '../types/DiscoverQuestion';
import { AssistantFullWidthView } from './AssistantFullWidthView';
import { DiscoverCard } from './DiscoverCard';

export const DiscoverFeed: FC = () => {
    const discoverQuestions = useGlobalStore(
        (state) => state.assistant.chat.discoverQuestions,
    );
    const incrementDiscoverQuestionClicks = useGlobalStore(
        (state) => state.assistant.chat.actions.incrementDiscoverQuestionClicks,
    );
    const { t } = useTranslation();
    const { onOpenWithNewChat } = useAssistantInteractions();
    const discoverFeedRef = useRef<HTMLDivElement | null>(null);

    const [filter, setFilter] = useState<DiscoverQuestionType>(
        DiscoverQuestionType.ALL,
    );

    const handleClick = async (question: string, questionId: number) => {
        await onOpenWithNewChat(question);
        await incrementDiscoverQuestionClicks(questionId);
    };

    const handleFilterClick = (selectedFilter: DiscoverQuestionType) => {
        setFilter((currentFilter: DiscoverQuestionType) =>
            currentFilter === selectedFilter
                ? DiscoverQuestionType.ALL
                : selectedFilter,
        );

        discoverFeedRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const filteredQuestions = discoverQuestions.filter((question) => {
        switch (filter) {
            case DiscoverQuestionType.NEW:
                return question.is_new;
            case DiscoverQuestionType.POPULAR:
                return question.is_popular;
            default:
                return true; // 'all'
        }
    });

    const getButtonClassNames = (buttonFilter: DiscoverQuestionType) =>
        classNames('border border-slate-300 !p-2 !font-normal', {
            'bg-slate-500 !font-medium text-white hover:bg-slate-700 hover:text-white':
                filter === buttonFilter,
        });

    return (
        <AssistantFullWidthView>
            <div className="mb-4 mt-2 text-left md:mb-6 md:mt-0">
                <p className="title-4 md:title-5 text-medium mb-1 text-slate-950 md:mb-3">
                    {t('Ask Nuri about new and hot topics')}
                </p>
                <p>
                    {t(
                        'Choose from predefined questions and take your investment to the next level with the power of AI',
                    )}
                </p>
            </div>
            <div className="flex flex-row gap-2">
                <ButtonOrLink
                    text={t('All')}
                    variant="tertiary"
                    className={getButtonClassNames(DiscoverQuestionType.ALL)}
                    onClick={() => handleFilterClick(DiscoverQuestionType.ALL)}
                />
                <ButtonOrLink
                    text={t('New')}
                    variant="tertiary"
                    className={getButtonClassNames(DiscoverQuestionType.NEW)}
                    onClick={() => handleFilterClick(DiscoverQuestionType.NEW)}
                />
                <ButtonOrLink
                    text={t('Popular')}
                    variant="tertiary"
                    className={getButtonClassNames(
                        DiscoverQuestionType.POPULAR,
                    )}
                    onClick={() =>
                        handleFilterClick(DiscoverQuestionType.POPULAR)
                    }
                />
            </div>
            <div
                ref={discoverFeedRef}
                className="bottom-8 mb-14 mt-8 overflow-y-scroll lg:mb-0"
            >
                <div className="columns-1 gap-4 pb-4 md:columns-2 xl:columns-3">
                    {filteredQuestions.map((question: DiscoverQuestion) => (
                        <DiscoverCard
                            key={question.id}
                            discoverQuestion={question}
                            onClick={() =>
                                handleClick(question.question, question.id)
                            }
                            className="inline-block break-inside-avoid [&:not(:first-child)]:mt-4"
                        />
                    ))}
                </div>
            </div>
        </AssistantFullWidthView>
    );
};

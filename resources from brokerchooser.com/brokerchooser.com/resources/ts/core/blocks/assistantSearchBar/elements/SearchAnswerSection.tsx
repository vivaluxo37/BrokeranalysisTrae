import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SparklesIcon } from '@heroicons/react/24/solid';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkdownText } from '../../../elements/MarkdownText';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { AssistantSearchAnswerSkeleton } from '../../assistant/elements/AssistantSearchAnswerSkeleton';
import { useAssistantInteractions } from '../../assistant/hooks/useAssistantInteractions';
import { ASSISTANT_SEARCH_BAR_MEASUREMENT_LIST_ID } from '../consts/measurementIds';
import { AssistantSearchBarProps } from '../types/AssistantSearchBarProps';
import { OverviewByNuri } from './OverviewByNuri';
import { SearchSectionWrapper } from './SearchSectionWrapper';

export const SearchAnswerSection: FC<{
    onClose: AssistantSearchBarProps['onClose'];
}> = ({ onClose }) => {
    const { t } = useTranslation();

    const { onOpenWithNewChat } = useAssistantInteractions();

    const searchAnswer = useGlobalStore(
        (state) => state.assistant.search.searchAnswer,
    );
    const isGenerating = useGlobalStore(
        (state) => state.assistant.common.isGenerating,
    );

    const onButtonClick = () => {
        onOpenWithNewChat().then(onClose);
    };

    if (!isGenerating && searchAnswer === '') {
        return null;
    }

    return (
        <SearchSectionWrapper
            variant="white"
            wrapperClassName="!py-0"
            className="relative flex flex-col gap-y-4 rounded-2xl bg-gradient-to-br from-primary-500/10 to-35% p-6 *:z-10 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-bl before:from-blue-500/10 before:to-35%"
        >
            <OverviewByNuri />
            {searchAnswer === '' ? (
                <AssistantSearchAnswerSkeleton />
            ) : (
                <MarkdownText content={searchAnswer} />
            )}
            {!isGenerating && (
                <TrackedButtonOrLink
                    className="self-start"
                    text={t('Ask a follow up')}
                    variant="stroke"
                    IconLeft={SparklesIcon}
                    iconClassName="size-5"
                    onClick={onButtonClick}
                    measurementListId={ASSISTANT_SEARCH_BAR_MEASUREMENT_LIST_ID}
                    elementId="new search ui follow up button"
                />
            )}
        </SearchSectionWrapper>
    );
};

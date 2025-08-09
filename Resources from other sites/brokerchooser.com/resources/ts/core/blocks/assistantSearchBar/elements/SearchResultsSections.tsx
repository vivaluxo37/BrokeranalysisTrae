import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { HighlightedSearchResultCard } from './HighlightedSearchResultCard';
import { SearchResultCard } from './SearchResultCard';
import { SearchSectionWrapper } from './SearchSectionWrapper';

export const SearchResultsSections: FC = () => {
    const { t } = useTranslation();
    const searchResults = useGlobalStore(
        (state) => state.assistant.search.searchResults,
    );
    const isGenerating = useGlobalStore(
        (state) => state.assistant.common.isGenerating,
    );

    if (searchResults === undefined || isGenerating) {
        return null;
    }

    const highlightedResults = searchResults.slice(0, 2);
    const otherResults = searchResults.slice(2);

    return (
        <>
            <SearchSectionWrapper
                variant="white"
                className="flex flex-col gap-6 md:flex-row"
            >
                {highlightedResults.map((result) => (
                    <HighlightedSearchResultCard
                        key={result.title}
                        result={result}
                    />
                ))}
            </SearchSectionWrapper>
            <SearchSectionWrapper
                variant="white"
                className="flex flex-col gap-y-4"
            >
                {otherResults.length > 0 && (
                    <span className="text-2xl font-semibold">
                        {t('Other results')} {`(${otherResults.length})`}
                    </span>
                )}
                {otherResults.map((result, index) => (
                    <SearchResultCard
                        key={result.title}
                        index={index}
                        result={result}
                    />
                ))}
            </SearchSectionWrapper>
        </>
    );
};

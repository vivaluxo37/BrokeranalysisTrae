import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleWrapper } from '../components/tailwind/template/ArticleWrapper';
import { RecommendedBrokersSection } from '../core/blocks/brokerCardsSection/elements/RecommendedBrokersSection';

import { SaveToWatchlistContextWrapper } from '../core/blocks/saveFavoriteBrokerButton/elements/SaveToWatchlistContextWrapper';
import { BrokerReviewListContext } from './context/BrokerReviewListContext';
import { TitleSection } from './elements/TitleSection';
import { useFilterActions } from './hooks/useFilterActions';

export const BrokerReviewListPageContainer: React.FunctionComponent = () => {
    const { t } = useTranslation();

    const {
        state: {
            providers,
            filterOptions,
            searchInput,
            isLoading,
            currentCountry,
        },
    } = useContext(BrokerReviewListContext);

    const { onSearchChange, onFilterChange } = useFilterActions();

    return (
        <SaveToWatchlistContextWrapper>
            <ArticleWrapper>
                <TitleSection
                    searchString={searchInput}
                    onSearchChange={onSearchChange}
                    onFilterChange={onFilterChange}
                    checkBoxes={filterOptions.map((option) => ({
                        id: option.slug,
                        checked: option.isSelected,
                        text: option.name,
                    }))}
                />
                <RecommendedBrokersSection
                    brokers={providers}
                    countryInTheName={currentCountry?.translatedInTheCountry}
                    isLoading={isLoading}
                    title={t('Brokers available')}
                    emptyListLabel={t(
                        "We couldn't find any brokers based on your search.",
                    )}
                    outerClassName="bg-secondary-50 bg-opacity-60"
                    visitBrokerButtonMeasurementListId="broker-listpage-visit-broker-button"
                    visitBrokerLogoMeasurementListId="broker-listpage-visit-broker-button-logo"
                    visitBrokerNameLinkMeasurementListId="broker-listpage-visit-broker-button-name-link"
                    readReviewLinkMeasurementListId="broker-listpage-read-review-link"
                />
            </ArticleWrapper>
        </SaveToWatchlistContextWrapper>
    );
};

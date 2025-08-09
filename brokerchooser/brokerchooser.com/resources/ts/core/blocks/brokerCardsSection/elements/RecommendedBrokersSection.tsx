import React from 'react';
import { LegacySectionWrapper } from '../../../../components/tailwind/template/LegacySectionWrapper';
import { Spinner } from '../../../elements/Spinner';
import { BrokerCardWithParams } from '../../brokerCardWithParams/elements/BrokerCardWithParams';
import { RecommendationSectionTitle } from '../../recommendationSectionTitle/RecommendationSectionTitle';
import { BrokerProps } from '../types/types';

type RecommendedBrokersSectionProps = {
    brokers: BrokerProps[];
    countryInTheName?: string;
    isLoading?: boolean;
    title: string;
    emptyListLabel?: string;
    outerClassName?: string;
    backgroundElement?: React.ReactElement;
    visitBrokerButtonMeasurementListId: string;
    visitBrokerLogoMeasurementListId: string;
    visitBrokerNameLinkMeasurementListId: string;
    readReviewLinkMeasurementListId: string;
};

export const RecommendedBrokersSection: React.FunctionComponent<
    RecommendedBrokersSectionProps
> = (props: RecommendedBrokersSectionProps) => {
    const {
        brokers,
        countryInTheName,
        isLoading,
        title,
        emptyListLabel,
        outerClassName,
        backgroundElement,
        visitBrokerButtonMeasurementListId,
        visitBrokerLogoMeasurementListId,
        visitBrokerNameLinkMeasurementListId,
        readReviewLinkMeasurementListId,
    } = props;

    return (
        <LegacySectionWrapper
            innerWidth="max-w-[1200px]"
            outerPaddingClassName="py-2 sm:py-10"
            backgroundElement={backgroundElement}
            outerClassName={outerClassName}
            innerClassName="flex flex-col justify-center items-center"
        >
            <RecommendationSectionTitle
                sectionTitle={title}
                countryInTheName={countryInTheName}
            />
            {isLoading && <Spinner size="large" />}
            <ul className="custom-html-disabled mt-8 grid list-none grid-cols-1 gap-6 lg:grid-cols-3">
                {!isLoading &&
                    brokers.length > 0 &&
                    brokers.map((broker, index) => (
                        <li key={broker.id}>
                            <BrokerCardWithParams
                                broker={broker}
                                index={index}
                                showSaveBroker
                                logoMeasurementListId={
                                    visitBrokerLogoMeasurementListId
                                }
                                nameLinkMeasurementListId={
                                    visitBrokerNameLinkMeasurementListId
                                }
                                visitBrokerButtonMeasurementListId={
                                    visitBrokerButtonMeasurementListId
                                }
                                readReviewLinkMeasurementListId={
                                    readReviewLinkMeasurementListId
                                }
                            />
                        </li>
                    ))}

                {!isLoading && brokers.length === 0 && (
                    <div>{emptyListLabel}</div>
                )}
            </ul>
        </LegacySectionWrapper>
    );
};

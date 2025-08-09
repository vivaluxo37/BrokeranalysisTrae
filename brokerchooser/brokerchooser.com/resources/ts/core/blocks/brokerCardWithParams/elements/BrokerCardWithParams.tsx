import { XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageAsBackground } from '../../../../components/tailwind/atom/ImageAsBackground';
import { InfoIcon } from '../../../../components/tailwind/atom/icons/InfoIcon';
import { ReadReviewLink } from '../../../../components/tailwind/molecules/ReadReviewLink';
import { BrokerProps } from '../../../../personalPage/types/types';
import { BCTooltip } from '../../../elements/BCTooltip';
import { BrokerLogoStarScoreHeader } from '../../../elements/BrokerLogoStarScoreHeader';
import { getScoreColorClasses } from '../../../functions/getScoreColorTextClass';
import { getFmbHighlightForBroker } from '../../../functions/helpers';
import { SaveFavoriteBrokerButton } from '../../saveFavoriteBrokerButton/elements/SaveFavoriteBrokerButton';
import { VisitBrokerButton } from '../../visitBrokerButton/VisitBrokerButton';
import { BrokerFmbHighlight } from './BrokerFmbHighlight';

export const BrokerCardWithParams: FC<{
    broker: BrokerProps;
    index?: number;
    showSaveBroker?: boolean;
    handleRemoveClick?: (args: {
        brokerId: number;
        brokerName: string;
    }) => void;
    logoMeasurementListId: string;
    nameLinkMeasurementListId: string;
    visitBrokerButtonMeasurementListId: string;
    readReviewLinkMeasurementListId: string;
    onSaveSuccess?: () => void;
    compareCheckBox?: React.ReactNode;
}> = ({
    broker,
    index,
    showSaveBroker,
    handleRemoveClick,
    logoMeasurementListId,
    nameLinkMeasurementListId,
    visitBrokerButtonMeasurementListId,
    readReviewLinkMeasurementListId,
    onSaveSuccess,
    compareCheckBox,
}) => {
    const { t } = useTranslation();

    const paramsData = useMemo(
        () => [
            {
                name: t('Fee level'),
                value: broker.feeLevel,
                score: broker.feeLevelScore,
            },
            {
                name: t('Inactivity fee'),
                value: broker.inactivityFee ? t('Yes') : t('No'),
            },
            {
                name: t('Investor protection'),
                value: broker.investorProtection ? t('Yes') : t('No'),
            },
            {
                name: t('Mobile platform'),
                value: broker.mobilePlatformScore ? t('Yes') : t('No'),
                score: broker.mobilePlatformScore,
            },
        ],
        [broker, t],
    );

    const brokerFmbHighlight = useMemo(
        () => getFmbHighlightForBroker(broker.highlights),
        [broker, getFmbHighlightForBroker],
    );

    return (
        <div
            className={classNames(
                'relative flex h-full w-full flex-shrink-0 flex-grow-0 flex-col justify-between gap-4 rounded-lg bg-white px-6 pb-6 pt-6 shadow-lg',
                brokerFmbHighlight && 'border-2 border-success-500 pt-6',
            )}
        >
            {brokerFmbHighlight && (
                <BrokerFmbHighlight brokerHighlight={brokerFmbHighlight} />
            )}

            {handleRemoveClick && (
                <div className="absolute right-4 top-4">
                    <XMarkIcon
                        className="h-4 w-4 cursor-pointer text-gray-900"
                        onClick={() =>
                            handleRemoveClick({
                                brokerId: broker.id,
                                brokerName: broker.name,
                            })
                        }
                    />
                </div>
            )}
            <div className="flex flex-col gap-4">
                <div className="flex items-center self-start">
                    <BrokerLogoStarScoreHeader
                        broker={broker}
                        logoMeasurementListId={logoMeasurementListId}
                        nameLinkMeasurementListId={nameLinkMeasurementListId}
                        index={index}
                        award={broker.award}
                    />
                </div>
                <div className="flex items-center gap-x-1 border-y border-slate-200 py-2 text-sm leading-normal text-slate-600">
                    <ImageAsBackground
                        imageSrc="images/icons/blue_people.svg"
                        className="mb-1 h-4 w-4"
                    />
                    <div className="font-semibold">
                        {broker.popularity?.toLocaleString()}
                    </div>{' '}
                    {t('people chose this broker')}
                    <BCTooltip
                        position="top"
                        content={t(
                            'Number of people who visited the broker’s page from BrokerChooser in the last 6 months',
                        )}
                    >
                        <InfoIcon className="h-4 w-4 text-secondary-500" />
                    </BCTooltip>
                </div>
                <div>
                    {paramsData.map((param, paramIndex) => (
                        <div
                            className="grid grid-cols-2 text-sm"
                            key={paramIndex}
                        >
                            <div className="text-slate-600">{param.name}:</div>
                            <div className="me-4 flex">
                                {param.value}{' '}
                                {param.score && (
                                    <div className="ms-2 text-slate-400">
                                        <span
                                            className={classNames(
                                                getScoreColorClasses(
                                                    parseFloat(param.score),
                                                ).textClass,
                                                'font-semibold',
                                            )}
                                        >
                                            {param.score}
                                        </span>
                                        /5
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <VisitBrokerButton
                    className="w-full sm:h-max sm:w-full sm:py-2.5"
                    rootClassName="min-[0px]:w-full"
                    broker={broker}
                    measurementListId={visitBrokerButtonMeasurementListId}
                    positionIndex={index !== undefined ? index + 1 : undefined}
                />
            </div>
            {showSaveBroker && (
                <SaveFavoriteBrokerButton
                    brokerId={broker.id}
                    brokerName={broker.name}
                    onSaveSuccess={onSaveSuccess}
                />
            )}
            {compareCheckBox}
            <div className="flex justify-center">
                <ReadReviewLink
                    broker={broker}
                    measurementListId={readReviewLinkMeasurementListId}
                />
            </div>
        </div>
    );
};

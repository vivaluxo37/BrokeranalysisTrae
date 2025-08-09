import classNames from 'classnames';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageAsBackground } from '../../components/tailwind/atom/ImageAsBackground';
import { VisitBrokerLink } from '../../components/tailwind/molecules/VisitBrokerLink';
import { getGeneralElementClickEventData } from '../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../util/measurement/functions/sendGA4Event';
import { BrokerAwardBadge } from '../blocks/brokerCardWithParams/elements/BrokerAwardBadge';
import { getScoreColorClasses } from '../functions/getScoreColorTextClass';
import { BrokerLogoStarScoreHeaderProps } from '../types/BrokerLogoStarScoreHeaderProps';
import { Image } from './Image';

export const BrokerLogoStarScoreHeader: FC<BrokerLogoStarScoreHeaderProps> = ({
    broker,
    className,
    headerTextClassName,
    hideScore = false,
    logoMeasurementListId,
    nameLinkMeasurementListId,
    index,
    award,
}) => {
    const { t } = useTranslation();
    const onAwardBadgeClick = useCallback(() => {
        const event = getGeneralElementClickEventData({
            measurementListId: 'broker card award badge',
            elementId: broker.name,
        });

        sendGA4Event(event);
    }, []);
    const positionIndex = useMemo(
        () => (index !== undefined ? index + 1 : undefined),
        [index],
    );

    return (
        <div className={classNames('flex items-center gap-x-4', className)}>
            <VisitBrokerLink
                broker={broker}
                measurementListId={logoMeasurementListId}
                positionIndex={positionIndex}
            >
                <Image
                    alt={broker.name}
                    imageSrc={broker.logoPath}
                    className="h-12 w-12 rounded-md drop-shadow-md"
                />
            </VisitBrokerLink>
            <div className="flex flex-col justify-center gap-1 text-left">
                <VisitBrokerLink
                    broker={broker}
                    measurementListId={nameLinkMeasurementListId}
                    className={classNames(
                        'text-[22px] font-bold hover:text-primary-500',
                        headerTextClassName,
                    )}
                    positionIndex={positionIndex}
                >
                    {broker.name}
                </VisitBrokerLink>
                {!hideScore && (
                    <div className="flex flex-row items-center gap-x-1 text-sm text-slate-500">
                        <div className="font-medium">{t('Score:')}</div>
                        {broker.overallScore > 4.1 && (
                            <ImageAsBackground
                                imageSrc="/images/icons/green_star.svg"
                                className="inline-block h-3 w-3 shrink-0"
                            />
                        )}
                        <div>
                            <span
                                className={classNames(
                                    'font-medium',
                                    getScoreColorClasses(broker.overallScore)
                                        .textClass,
                                )}
                            >
                                {broker.overallScore.toFixed(1)}
                            </span>
                            <span className="text-slate-400">/5</span>
                        </div>
                        {award && (
                            <BrokerAwardBadge
                                award={award}
                                onClick={onAwardBadgeClick}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import classNames from 'classnames';
import React, { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VisitBrokerLink } from '../../../../components/tailwind/molecules/VisitBrokerLink';
import { AwardsLogo } from '../../../assets/AwardsLogo';
import { BrokerLogo } from '../../../elements/BrokerLogo';
import { AwardsWinnerCardProps } from '../types/AwardsWinnerCardProps';

export const AwardsWinnerCard = forwardRef<
    HTMLDivElement,
    AwardsWinnerCardProps
>(
    (
        {
            data: { broker, category, categoryLink, showReadReviewButton },
            highlightOpacity,
            isMobile,
            compact = false,
            measurementListId,
            positionIndex,
            onVisitBrokerButtonClick,
        },
        ref,
    ) => {
        const { t } = useTranslation();

        const buttonClassName = useMemo(
            () =>
                classNames(
                    'w-full sm:group-hover:bg-primary-500 sm:group-hover:text-slate-950 sm:group-hover:hover:bg-primary-400 sm:group-hover:focus:outline-primary-200 sm:group-hover:active:bg-primary-400 sm:group-hover:active:outline-primary-200',
                    {
                        '!transition-none focus:outline-primary-200 active:bg-primary-400 active:outline-primary-200 sm:hover:bg-primary-400':
                            highlightOpacity !== undefined,
                    },
                ),
            [highlightOpacity],
        );

        const buttonStyle = useMemo(
            () => ({
                backgroundColor: highlightOpacity
                    ? `rgb(253 173 0 / ${highlightOpacity})`
                    : undefined,
            }),
            [highlightOpacity],
        );

        return (
            <div
                ref={ref}
                className={classNames(
                    'group relative z-10 flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-700 p-5 backdrop-blur transition-all md:p-8',
                    compact ? 'gap-4' : 'min-h-60 gap-8 md:min-h-80',
                )}
            >
                <div
                    className={classNames(
                        'absolute inset-0 z-0 bg-gradient-to-r from-white/5 via-white/[0.01] to-white/5 opacity-100 group-hover:opacity-0',
                        {
                            'transition-opacity duration-300':
                                highlightOpacity === undefined,
                        },
                    )}
                    style={{
                        opacity:
                            highlightOpacity !== undefined
                                ? 1 - highlightOpacity
                                : undefined,
                    }}
                />
                <div
                    className={classNames(
                        'absolute inset-0 z-0 bg-card-radial-glow opacity-0 group-hover:opacity-100',
                        {
                            'transition-opacity duration-300':
                                highlightOpacity === undefined,
                        },
                    )}
                    style={{
                        opacity:
                            highlightOpacity !== undefined
                                ? highlightOpacity
                                : undefined,
                    }}
                />
                <div className="z-10 flex flex-col gap-4">
                    {!compact && (
                        <AwardsLogo
                            className="h-5 w-10"
                            withHoverEffect={!isMobile}
                            highlightOpacity={highlightOpacity}
                        />
                    )}
                    <p className="title-4 font-medium text-slate-200">
                        {category}
                    </p>
                </div>
                <div className="z-10 flex flex-col gap-5">
                    <div
                        className={classNames(
                            'flex items-center gap-3 text-lg',
                            compact ? 'font-semibold' : 'font-normal',
                        )}
                    >
                        <BrokerLogo broker={broker} />
                        {broker.name}
                    </div>
                    <div className="flex w-full gap-4">
                        {categoryLink && (
                            <TrackedButtonOrLink
                                href={`${categoryLink}?showUnfilteredList=true`}
                                measurementListId="best-broker-awards-list"
                                text={t('See toplist')}
                                size="sm"
                                variant="stroke"
                                mode="dark"
                                className="flex-1 px-[unset]"
                            />
                        )}
                        <div className="relative flex-1">
                            {showReadReviewButton ? (
                                <TrackedButtonOrLink
                                    href={broker.brokerReviewUrl}
                                    measurementListId={measurementListId}
                                    context="read review button"
                                    elementId={broker.name}
                                    positionIndex={positionIndex}
                                    onClick={onVisitBrokerButtonClick}
                                    text={t('Read review')}
                                    size="sm"
                                    variant="stroke"
                                    mode="dark"
                                    className={buttonClassName}
                                    style={buttonStyle}
                                />
                            ) : (
                                <>
                                    <VisitBrokerLink
                                        broker={broker}
                                        measurementListId={measurementListId}
                                        measurementContext="visit broker button"
                                        positionIndex={positionIndex}
                                        onClick={onVisitBrokerButtonClick}
                                    >
                                        <ButtonOrLink
                                            tabIndex={-1}
                                            text={t('Visit broker')}
                                            size="sm"
                                            variant="stroke"
                                            mode="dark"
                                            className={buttonClassName}
                                            style={buttonStyle}
                                        />
                                    </VisitBrokerLink>
                                    <p
                                        className={classNames(
                                            'absolute mt-1 w-full text-center text-2xs opacity-100 sm:group-hover:opacity-100 md:opacity-0',
                                            {
                                                'transition-opacity duration-300':
                                                    highlightOpacity ===
                                                    undefined,
                                            },
                                        )}
                                        style={{
                                            opacity:
                                                highlightOpacity !== undefined
                                                    ? highlightOpacity
                                                    : undefined,
                                        }}
                                    >
                                        {broker.cfdWarning}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);

AwardsWinnerCard.displayName = 'AwardsWinnerCard';

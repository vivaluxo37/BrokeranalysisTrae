import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import {
    ArrowsRightLeftIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import React, { FC, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { VisitBrokerLink } from '../../../../components/tailwind/molecules/VisitBrokerLink';
import { createTop2Link } from '../../../../top2Page/functions/createTop2Link';
import { BrokerLogo } from '../../../elements/BrokerLogo';
import { ScoreWithStarAndDecimal } from '../../../elements/ScoreWithStarAndDecimal';
import { VisitBrokerButton } from '../../visitBrokerButton/VisitBrokerButton';
import { GeoAlternativeModalData } from '../types/types';

export const GeoAlternativeModalContent: FC<GeoAlternativeModalData> = ({
    broker,
    alternativeBroker,
    countryTranslatedTheName,
}) => {
    const { t } = useTranslation();
    const { href: compareLink } = useMemo(
        () => createTop2Link(broker, alternativeBroker),
        [alternativeBroker, broker],
    );
    const ctaContext = useMemo(
        () => `originalBroker: ${broker.name}`,
        [broker.name],
    );

    const visitBrokerLinkClassName =
        'underline decoration-dotted underline-offset-[3px] text-blue-500 decoration-blue-500 hover:text-blue-600 hover:decoration-blue-600';

    return (
        <div className="flex flex-col items-center gap-4 p-4 sm:p-6">
            <h1 className="title-3 mx-10 text-center">
                {t(
                    '[brokerName] isn’t available in [countryTranslatedTheName]',
                    {
                        brokerName: broker.name,
                        countryTranslatedTheName,
                    },
                )}
            </h1>
            <div className="flex flex-col items-center gap-0.5 text-center">
                <div className="font-semibold">
                    {/* prettier-ignore */}
                    <Trans i18nKey="Best alternative for you: <1>[alternativeBrokerName]</1>" values={{ alternativeBrokerName: alternativeBroker.name }}>
                        Best alternative for you: <VisitBrokerLink broker={alternativeBroker} measurementListId="geo alternative modal visit alternative name link in description" measurementContext={ctaContext} className={visitBrokerLinkClassName}>{alternativeBroker.name}</VisitBrokerLink>
                    </Trans>
                </div>
                <div>
                    {t(
                        'Check out this top available option or compare the two side by side!',
                    )}
                </div>
            </div>
            <div className="w-full rounded-lg bg-white p-4">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4">
                        <BrokerLogo broker={broker} className="size-9" />
                        <ChevronDoubleRightIcon className="size-8" />
                        <VisitBrokerLink
                            broker={alternativeBroker}
                            measurementListId="geo alternative modal visit alternative logo link"
                            measurementContext={ctaContext}
                        >
                            <BrokerLogo
                                broker={alternativeBroker}
                                logoSizeClassName="size-14"
                            />
                        </VisitBrokerLink>
                    </div>
                    <VisitBrokerLink
                        broker={alternativeBroker}
                        measurementListId="geo alternative modal visit alternative name link"
                        measurementContext={ctaContext}
                        className="mt-2 block text-lg font-semibold"
                    >
                        {alternativeBroker.name}
                    </VisitBrokerLink>
                    <ScoreWithStarAndDecimal
                        score={alternativeBroker.overallScore}
                        scoreTextOverride={t('Score')}
                    />
                </div>
                <div className="mt-4 flex justify-center">
                    <div className="w-full sm:w-max">
                        <TrackedButtonOrLink
                            text={t('Compare')}
                            measurementListId="geo alternative modal compare button"
                            href={compareLink}
                            context={JSON.stringify({
                                brokerId: broker.id,
                                alternativeBrokerId: alternativeBroker.id,
                            })}
                            variant="stroke"
                            IconRight={ArrowsRightLeftIcon}
                            iconClassName="size-5"
                            size="md"
                            className="max-h-8 w-full sm:max-h-10"
                        />
                        <div className="mt-2 w-full sm:w-max">
                            <VisitBrokerButton
                                broker={alternativeBroker}
                                buttonText={t('Visit alternative')}
                                measurementListId="geo alternative modal visit alternative button"
                                measurementContext={ctaContext}
                                className="w-full"
                                rootClassName="!w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

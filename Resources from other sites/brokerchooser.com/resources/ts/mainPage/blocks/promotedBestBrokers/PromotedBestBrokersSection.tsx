import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AwardsLogo } from '../../../core/assets/AwardsLogo';
import { LeavesVector } from '../../../core/assets/LeavesVector';
import { AwardsWinnerCardWithHighlightEffect } from '../../../core/blocks/awards/elements/AwardsWinnerCardWithHighlightEffect';
import { sendHotJarEvent } from '../../../core/functions/sendHotJarEvent';
import { useIsMobile } from '../../../core/hooks/useIsMobile';
import { MainPageProps } from '../../types/MainPageProps';

export const PromotedBestBrokersSection: FC<{
    winners: MainPageProps['promotedBestBrokers'];
}> = ({ winners }) => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const onVisitBrokerButtonClick = useCallback(() => {
        sendHotJarEvent('promoted broker card clicked');
    }, []);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const cardsRef = useRef<HTMLHeadingElement>(null);
    const cardsAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    return (
        <SectionWrapper outerClassName="bg-gradient-to-br from-secondary-400 via-slate-950 to-secondary-400 via-[percentage:35%_65%] py-20 relative">
            <LeavesVector className="absolute left-1/2 top-32 md:top-1/2" />
            <div
                className={classNames(
                    'flex flex-col items-start gap-4 text-white md:flex-row md:items-center',
                    titleAnimationClass,
                )}
                ref={titleRef}
            >
                <AwardsLogo />
                <h2 className="hero">
                    {t('Leading brokers of [year]', {
                        year: new Date().getFullYear(),
                    })}
                </h2>
            </div>
            <div
                className={classNames(
                    'mt-8 grid w-full grid-cols-1 gap-6 text-white md:grid-cols-2 xl:grid-cols-3',
                    cardsAnimationClass,
                )}
                ref={cardsRef}
            >
                {winners.map((winner, index) => (
                    <AwardsWinnerCardWithHighlightEffect
                        key={winner.broker.id}
                        data={winner}
                        isMobile={isMobile}
                        compact
                        measurementListId="promoted awards broker card"
                        positionIndex={index + 1}
                        onVisitBrokerButtonClick={onVisitBrokerButtonClick}
                    />
                ))}
            </div>
        </SectionWrapper>
    );
};

import { BrokerCell } from '@design-system/components/dataDisplay/brokerCell/BrokerCell';
import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import {
    useAnimationOnViewportEnter,
    useListAnimationOnViewportEnter,
} from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { sendHotJarEvent } from '../../../core/functions/sendHotJarEvent';
import { MainPageProps } from '../../types/MainPageProps';

export const BestBrokersSection: FC<{
    country?: string;
    topCountryBrokers: MainPageProps['topCountryBrokers'];
}> = ({ country, topCountryBrokers }) => {
    const { t } = useTranslation();

    const onBestBrokerCardClick = useCallback(() => {
        sendHotJarEvent('best brokers section item clicked');
    }, []);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const desktopButtonRef = useRef<HTMLHeadingElement>(null);
    const desktopButtonAnimationClass = useAnimationOnViewportEnter({
        element: desktopButtonRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const mobileButtonRef = useRef<HTMLHeadingElement>(null);
    const mobileButtonAnimationClass = useAnimationOnViewportEnter({
        element: mobileButtonRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const brokerListRef = useRef<HTMLElement[]>([]);
    const listAnimationClasses = useListAnimationOnViewportEnter({
        elements: brokerListRef,
        animationClassName:
            'animate-fade-in-move-left rtl:animate-fade-in-move-right',
        delay: 50,
    });

    return (
        <SectionWrapper outerClassName="bg-white py-20">
            <TwoColumn>
                <Column className="flex flex-col justify-center">
                    <h2
                        ref={titleRef}
                        className={classNames(
                            'title-1 font-medium text-slate-800',
                            titleAnimationClass,
                        )}
                    >
                        {country
                            ? t(
                                  'Check out our top broker recommendations in [theCountryName]',
                                  {
                                      theCountryName: country,
                                  },
                              )
                            : t('Check out our top broker recommendations')}
                    </h2>
                    <div
                        ref={desktopButtonRef}
                        className={desktopButtonAnimationClass}
                    >
                        <TrackedButtonOrLink
                            href="/broker-reviews"
                            className="mt-8 hidden md:inline-flex"
                            bodyClassName="ps-0"
                            withRightArrow
                            size="lg"
                            variant="underlined-secondary"
                            text={t('See all brokers')}
                            measurementListId="best brokers section see all brokers"
                        />
                    </div>
                </Column>
                <Column type="text" className="flex flex-col gap-2 md:gap-4">
                    {topCountryBrokers.map((broker, index) => (
                        <BrokerCell
                            onClick={onBestBrokerCardClick}
                            ref={(cell) => {
                                if (cell) {
                                    brokerListRef.current[index] = cell;
                                }
                            }}
                            key={broker.id}
                            broker={broker}
                            measurementListId="front-page-visit-broker-button"
                            className={listAnimationClasses[index]}
                            index={index}
                        />
                    ))}
                    <div className="mt-8 flex justify-center md:hidden">
                        <div
                            ref={mobileButtonRef}
                            className={mobileButtonAnimationClass}
                        >
                            <TrackedButtonOrLink
                                size="lg"
                                href="/broker-reviews"
                                withRightArrow
                                variant="underlined-secondary"
                                text={t('See all brokers')}
                                measurementListId="best brokers section see all brokers"
                            />
                        </div>
                    </div>
                </Column>
            </TwoColumn>
        </SectionWrapper>
    );
};

import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import { BlurryAccent } from '@design-system/components/miscellaneous/blurryAccent/BlurryAccent';
import { SectionBlurryAccent } from '@design-system/components/miscellaneous/blurryAccent/SectionBlurryAccent';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getOptimisedImages } from '../../../core/assets/getOptimisedImages';
import { Image } from '../../../core/elements/Image';

const compareBrokerLaptopImage = getOptimisedImages(
    'compare-broker-laptop.png',
);

export const CompareSection: FC = () => {
    const { t } = useTranslation();

    const titleRef = useRef<HTMLHeadingElement>(null);
    const animatedClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const linkRef = useRef<HTMLDivElement>(null);
    const linkAnimationClass = useAnimationOnViewportEnter({
        element: linkRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    return (
        <SectionWrapper outerClassName="bg-slate-900">
            <TwoColumn invertedOnMobile className="py-20">
                <Column className="flex items-center">
                    <BlurryAccent className="right-1/2 top-1/2 h-[95%] w-[95%] -translate-y-1/2 translate-x-1/2 bg-secondary-600/25" />
                    <Image
                        loading="lazy"
                        className="z-20"
                        imageSrc={compareBrokerLaptopImage}
                        alt="Compare brokers"
                    />
                </Column>
                <Column type="text" className="flex items-center">
                    <div>
                        <h2
                            ref={titleRef}
                            className={classNames(
                                'title-1 font-medium text-white',
                                animatedClass,
                            )}
                        >
                            {t('Filter and compare 100+ trusted brokers')}
                        </h2>
                        <div ref={linkRef} className={linkAnimationClass}>
                            <TrackedButtonOrLink
                                href="/compare"
                                withRightArrow
                                variant="underlined-secondary"
                                mode="dark"
                                size="lg"
                                text={t('Start your comparison')}
                                className="mt-8"
                                bodyClassName="ps-0"
                                measurementListId="tools section card"
                                elementId="compare brokers"
                            />
                        </div>
                    </div>
                </Column>
            </TwoColumn>
            <SectionBlurryAccent />
        </SectionWrapper>
    );
};

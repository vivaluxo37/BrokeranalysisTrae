import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import { BlurryAccent } from '@design-system/components/miscellaneous/blurryAccent/BlurryAccent';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getOptimisedImages } from '../../../core/assets/getOptimisedImages';
import { Image } from '../../../core/elements/Image';
import { AnimatedHeroText } from './elements/AnimatedHeroText';

const heroSectionImages = getOptimisedImages('hero-section-image.png');
export const HeroSection: FC = () => {
    const { t } = useTranslation();

    const buttonRef = useRef<HTMLParagraphElement>(null);
    const buttonAnimationClass = useAnimationOnViewportEnter({
        element: buttonRef,
        animationClassName: 'animate-fade-in-move-up',
        delay: 400,
    });
    return (
        <SectionWrapper outerClassName="bg-blue-50">
            <TwoColumn gap={0} className="md:gap-8">
                <Column className="flex flex-col items-center justify-center pb-0 pt-20 md:items-baseline md:pt-28 lg:pb-16 xl:pt-40">
                    <AnimatedHeroText />
                    <div ref={buttonRef} className={buttonAnimationClass}>
                        <TrackedButtonOrLink
                            variant="primary"
                            withRightArrow
                            text={t('Match me')}
                            href="/find-my-broker"
                            className="my-6 w-full justify-center md:my-12 md:w-auto md:justify-start"
                            measurementListId="title section FMB button"
                        />
                    </div>
                </Column>
                <Column className="flex flex-col justify-end">
                    <BlurryAccent className="start-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-[30%] rotate-45 bg-primary-100 lg:h-[65%] rtl:translate-x-1/2" />
                    <Image
                        className="z-20"
                        alt="Get matched with online brokers"
                        imageSrc={heroSectionImages}
                    />
                </Column>
            </TwoColumn>
        </SectionWrapper>
    );
};

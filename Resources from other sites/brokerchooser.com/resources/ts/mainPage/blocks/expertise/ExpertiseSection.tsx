import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import { BlurryAccent } from '@design-system/components/miscellaneous/blurryAccent/BlurryAccent';
import { SectionBlurryAccent } from '@design-system/components/miscellaneous/blurryAccent/SectionBlurryAccent';
import { Card } from '@design-system/components/surfaces/card/Card';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getOptimisedImages } from '../../../core/assets/getOptimisedImages';
import { Image } from '../../../core/elements/Image';
import { getFormattedNumberValue } from '../../../core/functions/getFormattedNumberValue';

const expertiseSectionImage = getOptimisedImages('expertise-section.png');

export const ExpertiseSection: FC<{
    accountOpens: number;
}> = ({ accountOpens }) => {
    const { t } = useTranslation();

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const buttonRef = useRef<HTMLDivElement>(null);
    const buttonAnimationClass = useAnimationOnViewportEnter({
        element: buttonRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const card1Ref = useRef<HTMLDivElement>(null);
    const card1AnimationClass = useAnimationOnViewportEnter({
        element: buttonRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const card2Ref = useRef<HTMLDivElement>(null);
    const card2AnimationClass = useAnimationOnViewportEnter({
        element: buttonRef,
        animationClassName: 'animate-fade-in-move-up',
        delay: 300,
    });

    return (
        <SectionWrapper outerClassName="bg-slate-900">
            <TwoColumn invertedOnMobile>
                <Column className="flex items-end">
                    <BlurryAccent className="bottom-[22%] left-[55%] h-1/4 w-1/2 -translate-x-1/2 translate-y-1/2 bg-primary-500/25" />
                    <BlurryAccent className="bottom-[52%] left-[35%] h-[70%] w-[70%] -translate-x-1/2 translate-y-1/2 bg-secondary-600/15" />
                    <Image
                        loading="lazy"
                        className="z-20"
                        imageSrc={expertiseSectionImage}
                        alt="Globally acknowledged expertise"
                    />
                </Column>
                <Column
                    type="text"
                    className="flex flex-col justify-center gap-4 pb-0 pt-20 md:pb-20"
                >
                    <h2
                        ref={titleRef}
                        className={classNames(
                            'title-1 font-medium text-white',
                            titleAnimationClass,
                        )}
                    >
                        {t('Globally acknowledged expertise')}
                    </h2>
                    <div
                        ref={buttonRef}
                        className={classNames(
                            'my-0 lg:my-8',
                            buttonAnimationClass,
                        )}
                    >
                        <TrackedButtonOrLink
                            withRightArrow
                            text={t('Check our press highlights')}
                            bodyClassName="ps-0"
                            size="lg"
                            mode="dark"
                            variant="underlined-secondary"
                            href="/education/news/media-mentions"
                            measurementListId="expertise section media mentions link"
                        />
                    </div>
                    <div className="flex flex-col gap-6 pt-0 md:flex-row md:pt-10">
                        <Card
                            ref={card1Ref}
                            className={classNames(
                                'flex-1 border-slate-700 bg-card-gradient p-6 backdrop-blur lg:px-10 lg:py-8',
                                card1AnimationClass,
                            )}
                        >
                            <div className="text-4xl font-semibold text-white">
                                {t('[number]+ years', {
                                    number: new Date().getFullYear() - 2016,
                                })}
                            </div>
                            <div className="pt-4 text-base font-normal text-white">
                                {t('in matching people with trusted brokers')}
                            </div>
                        </Card>
                        <Card
                            ref={card2Ref}
                            className={classNames(
                                'flex-1 border-slate-700 bg-card-gradient p-6 backdrop-blur lg:px-10 lg:py-8',
                                card2AnimationClass,
                            )}
                        >
                            <div className="text-4xl font-semibold text-white">
                                {getFormattedNumberValue(accountOpens)}
                            </div>
                            <div className="pt-4 text-base font-normal text-white">
                                {t('matches made in the last 6 months')}
                            </div>
                        </Card>
                    </div>
                </Column>
            </TwoColumn>
            <SectionBlurryAccent />
        </SectionWrapper>
    );
};

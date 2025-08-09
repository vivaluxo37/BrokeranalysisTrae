import { UnorderedList } from '@design-system/components/dataDisplay/unorderedList/UnorderedList';
import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Column } from '@design-system/components/layout/twoColumn/Column';
import { TwoColumn } from '@design-system/components/layout/twoColumn/TwoColumn';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getOptimisedImages } from '../../../core/assets/getOptimisedImages';
import { Image } from '../../../core/elements/Image';

const ourApproachSectionImage = getOptimisedImages('our-approach-section.png');

export const OurApproachSection: FC = () => {
    const { t } = useTranslation();

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const listRef = useRef<HTMLUListElement>(null);
    const listAnimationClass = useAnimationOnViewportEnter({
        element: listRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const linkRef = useRef<HTMLDivElement>(null);
    const linkAnimationClass = useAnimationOnViewportEnter({
        element: linkRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    return (
        <SectionWrapper outerClassName="bg-white">
            <TwoColumn>
                <Column className="flex flex-col justify-center">
                    <div className="mb-0 mt-20 md:mb-20">
                        <h2
                            ref={titleRef}
                            className={classNames(
                                'title-1 font-medium text-slate-800',
                                titleAnimationClass,
                            )}
                        >
                            {t('We match you with brokers we trust')}
                        </h2>
                        <UnorderedList
                            ref={listRef}
                            className={classNames('py-8', listAnimationClass)}
                            bulletImagePath="/images/icons/outlined-check.svg"
                            size="xl"
                            items={[
                                {
                                    id: 1,
                                    text: (
                                        <>
                                            {t(
                                                'All the recommended brokers are regulated',
                                            )}
                                        </>
                                    ),
                                },
                                {
                                    id: 2,
                                    text: (
                                        <>{t('We test them with our money')}</>
                                    ),
                                },
                                {
                                    id: 3,
                                    text: (
                                        <>
                                            {t(
                                                'We analyze 600+ data points per broker',
                                            )}
                                        </>
                                    ),
                                },
                            ]}
                        />
                        <div ref={linkRef} className={linkAnimationClass}>
                            <TrackedButtonOrLink
                                withRightArrow
                                variant="underlined-secondary"
                                size="lg"
                                href="/methodology"
                                bodyClassName="ps-0"
                                text={t('Learn more about our approach')}
                                measurementListId="our approach section methodology link"
                            />
                        </div>
                    </div>
                </Column>
                <Column className="flex flex-col justify-end">
                    <Image
                        loading="lazy"
                        className="mt-0 lg:mt-20"
                        imageSrc={ourApproachSectionImage}
                        alt="Our approach section"
                    />
                </Column>
            </TwoColumn>
        </SectionWrapper>
    );
};

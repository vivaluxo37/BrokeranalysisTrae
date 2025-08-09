import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { PaginationBullets } from '@design-system/components/navigation/paginationBullets/PaginationBullets';
import { Carousel } from '@design-system/components/surfaces/carousel/Carousel';
import { CarouselButton } from '@design-system/components/surfaces/carousel/CarouselButton';
import { CarouselRefType } from '@design-system/components/surfaces/carousel/types';
import { useAnimationOnViewportEnter } from '@design-system/hooks/useAnimationOnViewportEnter';
import classNames from 'classnames';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsRtl } from '../../../core/hooks/useIsRtl';
import { Testimonial } from '../../../core/types/commonTypes';
import { TestimonialCard } from './elements/TestimonialCard';

export const SuccessStories: FC<{
    testimonials: Testimonial[];
}> = ({ testimonials }) => {
    const { t } = useTranslation();

    const [carouselIndex, setCarouselIndex] = useState(0);

    const carouselRef = useRef<CarouselRefType>(null);

    const handleLeftClick = useCallback(() => {
        carouselRef.current?.handlePreviousClick();
    }, []);

    const handleRightClick = useCallback(() => {
        carouselRef.current?.handleNextClick();
    }, []);

    const isRtl = useIsRtl();
    const handleScrollEnd = useCallback(
        (scrollIndex: number) => {
            if (isRtl) {
                setCarouselIndex(testimonials.length - scrollIndex - 1);
                return;
            }
            setCarouselIndex(scrollIndex);
        },
        [isRtl, testimonials.length],
    );

    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleAnimationClass = useAnimationOnViewportEnter({
        element: titleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const mobileTitleRef = useRef<HTMLHeadingElement>(null);
    const mobileTitleAnimationClass = useAnimationOnViewportEnter({
        element: mobileTitleRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const buttonRef = useRef<HTMLDivElement>(null);
    const buttonAnimationClass = useAnimationOnViewportEnter({
        element: buttonRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    const mobileButtonRef = useRef<HTMLDivElement>(null);
    const mobileButtonAnimationClass = useAnimationOnViewportEnter({
        element: mobileButtonRef,
        animationClassName: 'animate-fade-in-move-up',
    });

    return (
        <SectionWrapper
            outerClassName="bg-white"
            innerClassName="py-20 md:py-32"
        >
            <h2
                ref={mobileTitleRef}
                className={classNames(
                    'title-1 mb-8 block font-medium text-slate-800 md:hidden',
                    mobileTitleAnimationClass,
                )}
            >
                {t('Success stories')}
            </h2>
            <div className="flex gap-8">
                <div className="hidden flex-1 py-8 md:block">
                    <h2
                        ref={titleRef}
                        className={classNames(
                            'title-1 me-8 font-medium text-slate-800',
                            titleAnimationClass,
                        )}
                    >
                        {t('Success stories')}
                    </h2>
                    <div
                        ref={buttonRef}
                        className={classNames(
                            'mt-20 flex gap-4',
                            buttonAnimationClass,
                        )}
                    >
                        <CarouselButton onClick={handleLeftClick} />
                        <CarouselButton onClick={handleRightClick} right />
                    </div>
                </div>
                <Carousel
                    ref={carouselRef}
                    options={{
                        align: 'start',
                        loop: true,
                        startIndex: isRtl ? testimonials.length - 1 : 0,
                    }}
                    onScrollEnd={handleScrollEnd}
                    className="flex-[2]"
                >
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                        />
                    ))}
                </Carousel>
            </div>
            <div className="flex gap-8 pt-8">
                <div className="hidden flex-1 md:block" />
                <div className="flex flex-1 justify-center md:justify-start">
                    <PaginationBullets
                        currentIndex={carouselIndex}
                        numberOfItems={testimonials.length}
                        bgColorClass="bg-slate-800"
                        bulletSize={12}
                    />
                </div>
                <div className="hidden flex-1 md:block" />
            </div>
            <div
                ref={mobileButtonRef}
                className={classNames(
                    'mt-8 flex justify-center gap-4 md:hidden',
                    mobileButtonAnimationClass,
                )}
            >
                <CarouselButton onClick={handleLeftClick} />
                <CarouselButton onClick={handleRightClick} right />
            </div>
        </SectionWrapper>
    );
};

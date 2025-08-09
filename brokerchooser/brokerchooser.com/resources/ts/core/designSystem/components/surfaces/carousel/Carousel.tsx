import { CarouselRefType } from '@design-system/components/surfaces/carousel/types';
import classNames from 'classnames';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import React, {
    PropsWithChildren,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
} from 'react';

export const Carousel = forwardRef<
    CarouselRefType,
    PropsWithChildren<{
        className?: string;
        options?: EmblaOptionsType;
        onScrollEnd?: (slideIndex: number) => void;
    }>
>(({ className, options, children, onScrollEnd }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    useImperativeHandle(ref, () => ({
        handlePreviousClick: () => {
            emblaApi?.scrollPrev();
        },
        handleNextClick: () => {
            emblaApi?.scrollNext();
        },
        handleToItem: (index: number) => {
            emblaApi?.scrollTo(index);
        },
    }));

    const handleScrollEnd = useCallback(
        (emblaApiInstance: EmblaCarouselType) => {
            if (onScrollEnd) {
                onScrollEnd(emblaApiInstance.selectedScrollSnap());
            }
        },
        [onScrollEnd],
    );

    useEffect(() => {
        emblaApi?.on('select', handleScrollEnd);
        return () => {
            emblaApi?.off('select', handleScrollEnd);
        };
    }, [emblaApi, handleScrollEnd]);

    return (
        <div
            ref={emblaRef}
            className={classNames('overflow-hidden', className)}
        >
            <div
                className={classNames(
                    'flex gap-4 md:gap-8 rtl:flex-row-reverse',
                    {
                        'ltr:ps-8 rtl:pe-8 rtl:ps-0': options?.loop,
                    },
                )}
            >
                {children}
            </div>
        </div>
    );
});

Carousel.displayName = 'Carousel';

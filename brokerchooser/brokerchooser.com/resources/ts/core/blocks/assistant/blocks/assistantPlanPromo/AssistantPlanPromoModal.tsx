import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { PaginationBullets } from '@design-system/components/navigation/paginationBullets/PaginationBullets';
import { Carousel } from '@design-system/components/surfaces/carousel/Carousel';
import { CarouselRefType } from '@design-system/components/surfaces/carousel/types';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breakpoints } from '../../../../consts/Breakpoints';
import { Dialog } from '../../../../elements/Dialog';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useIsRtl } from '../../../../hooks/useIsRtl';
import { AssistantLitePlanCard } from './elements/AssistantLitePlanCard';
import { AssistantPlusBadge } from './elements/AssistantPlusBadge';
import { AssistantPlusPlanCard } from './elements/AssistantPlusPlanCard';

export const AssistantPlanPromoModal: FC<{
    isOpen: boolean;
    onDialogClose: () => void;
}> = ({ isOpen, onDialogClose }) => {
    const { t } = useTranslation();

    const isMobile = useIsMobile(Breakpoints.md);

    const carouselRef = useRef<CarouselRefType>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const isRtl = useIsRtl();
    const handleScrollEnd = useCallback(
        (scrollIndex: number) => {
            if (isRtl) {
                setCarouselIndex(2 - scrollIndex - 1);
                return;
            }
            setCarouselIndex(scrollIndex);
        },
        [isRtl],
    );

    return (
        <Dialog isComponentVisible={isOpen} onDialogClose={onDialogClose}>
            <div className="h-screen w-screen overflow-y-auto bg-gradient-to-br from-[#e5f5ff] to-[#fff4dc] backdrop-blur-[30px] md:flex md:flex-col md:py-7">
                <ButtonOrLink
                    size={isMobile ? 'sm' : 'md'}
                    variant="stroke"
                    text="close"
                    className="ms-4 mt-4 !px-0 md:absolute md:ms-12 md:mt-2"
                    bodyClassName="!px-2 md:!px-3"
                    onClick={onDialogClose}
                >
                    <ChevronLeftIcon className="size-5" />
                </ButtonOrLink>
                <div className="m-auto flex flex-col">
                    <div className="mx-auto flex gap-1">
                        <p className="text-center text-3xl font-medium text-slate-950 md:text-5xl">
                            {t('Upgrade to Nuri AI')}
                        </p>
                        <AssistantPlusBadge />
                    </div>
                    <div className="mt-8 md:mt-16">
                        {isMobile ? (
                            <Carousel
                                ref={carouselRef}
                                options={{
                                    align: 'start',
                                    startIndex: isRtl ? 1 : 0,
                                }}
                                onScrollEnd={handleScrollEnd}
                                className="w-screen pb-5"
                            >
                                <AssistantPlusPlanCard className="ms-4 flex-[0_0_85%] rtl:me-4" />
                                <AssistantLitePlanCard className="me-4 flex-[0_0_85%] rtl:ms-4" />
                            </Carousel>
                        ) : (
                            <div className="flex justify-center gap-14 lg:gap-20">
                                <AssistantLitePlanCard />
                                <AssistantPlusPlanCard />
                            </div>
                        )}
                    </div>
                    {isMobile && (
                        <div className="my-8 flex w-screen justify-center">
                            <PaginationBullets
                                currentIndex={carouselIndex}
                                numberOfItems={2}
                                bgColorClass="bg-slate-800"
                                bulletSize={12}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

import React, { FC, useRef } from 'react';
import { useHighlightOpacity } from '../hooks/useHighlightOpacity';
import { BaseAwardsWinnerCardProps } from '../types/AwardsWinnerCardProps';
import { AwardsWinnerCard } from './AwardsWinnerCard';

export const AwardsWinnerCardWithHighlightEffect: FC<
    BaseAwardsWinnerCardProps
> = ({
    data,
    isMobile,
    compact,
    measurementListId,
    positionIndex,
    onVisitBrokerButtonClick,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const highlightOpacity = useHighlightOpacity({
        ref,
        centralAreaMargin: 50,
        lateralAreaMargin: 50,
        optOut: !isMobile,
    });

    return (
        <AwardsWinnerCard
            ref={ref}
            data={data}
            isMobile={isMobile}
            highlightOpacity={highlightOpacity}
            compact={compact}
            measurementListId={measurementListId}
            positionIndex={positionIndex}
            onVisitBrokerButtonClick={onVisitBrokerButtonClick}
        />
    );
};

import React from 'react';
import { ImpressionEvent } from '../../../util/measurement/eventTypes';
import { useMeasureImpression } from '../../../util/measurement/hooks/useMeasureImpression';

type Props = {
    children: React.ReactNode;
    inline?: boolean;
    className?: string;
    ga4ImpressionEventData: ImpressionEvent;
};

export function ImpressionHandler(props: Props) {
    const { children, inline, className, ga4ImpressionEventData } = props;

    const ref = useMeasureImpression({
        ga4ImpressionEventData,
    });

    const commonProps = {
        ref,
        className,
    };

    return inline ? (
        <span {...commonProps}>{children}</span>
    ) : (
        <div {...commonProps}>{children}</div>
    );
}

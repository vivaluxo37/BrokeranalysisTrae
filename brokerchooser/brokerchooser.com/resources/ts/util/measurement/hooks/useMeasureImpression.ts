import { useCallback } from 'react';
import { useHumanEyeEffectOnRef } from '../../../core/hooks/useHumanEyeEffect';
import { ImpressionEvent } from '../eventTypes';
import { trySendImpressionEvent } from '../functions/impressionHandler';

type Args = {
    ga4ImpressionEventData: ImpressionEvent;
};

export const useMeasureImpression = (eventData: Args) => {
    const onVisible = useCallback(() => {
        const { ga4ImpressionEventData } = eventData;

        trySendImpressionEvent(ga4ImpressionEventData);
    }, [eventData]);

    const ref = useHumanEyeEffectOnRef(onVisible);

    return ref;
};

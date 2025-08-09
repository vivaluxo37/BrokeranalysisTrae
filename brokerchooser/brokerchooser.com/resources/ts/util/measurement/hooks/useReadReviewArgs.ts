import { useCallback, useMemo } from 'react';
import { BasicBrokerData } from '../../../core/types/commonTypes';
import { GeneralImpressionEvent } from '../eventTypes';
import {
    getGeneralElementClickEventData,
    getGeneralElementImpressionEventData,
} from '../functions/eventCreatorFunctions';
import { sendGA4Event } from '../functions/sendGA4Event';

type Args = {
    broker: BasicBrokerData;
    measurementListId: string;
};

type UseReadReviewArgs = {
    onClickHandler: () => void;
    ga4ImpressionEventData: GeneralImpressionEvent;
    brokerReviewUrl: string;
};

export const useReadReviewArgs = (args: Args): UseReadReviewArgs => {
    const { broker, measurementListId } = args;
    const onClickHandler = useCallback(() => {
        const ga4EventData = getGeneralElementClickEventData({
            elementId: broker.name,
            measurementListId,
            elementType: 'read_review',
        });
        sendGA4Event(ga4EventData);
    }, [measurementListId, broker]);

    const ga4ImpressionEventData = useMemo(
        () =>
            getGeneralElementImpressionEventData({
                elementId: broker.name,
                measurementListId,
                elementType: 'read_review',
            }),
        [broker, measurementListId],
    );

    return {
        onClickHandler,
        ga4ImpressionEventData,
        brokerReviewUrl: broker.brokerReviewUrl,
    };
};

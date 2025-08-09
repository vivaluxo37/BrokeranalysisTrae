import { AffiliateElementEventDataArgs } from '../../../../util/measurement/eventTypes';
import {
    getAffiliateElementAuxClickEventData,
    getAffiliateElementClickEventData,
} from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { runByConsent } from '../../../functions/runByConsent';
import { ConsentLevel } from '../../../types/ConsentLevel';
import { VisitBrokerButtonClickArgs } from '../types/VisitBrokerButtonClickArgs';

type Event = {
    type: string;
};

export async function saveBrokerAnalytics(
    args: VisitBrokerButtonClickArgs,
    event: Event,
) {
    const dataCreatorParams: AffiliateElementEventDataArgs = {
        elementId: args.brokerName,
        measurementListId: args.measurementList,
        context: args.context,
        isReported: args.isReportedToAffiliatePartner,
        positionIndex: args.positionIndex,
    };

    const ga4EventArgs =
        event.type === 'auxclick'
            ? getAffiliateElementAuxClickEventData(dataCreatorParams)
            : getAffiliateElementClickEventData(dataCreatorParams);

    sendGA4Event(ga4EventArgs);

    runByConsent(
        () =>
            window.fbq?.('track', 'Purchase', {
                currency: 'USD',
                value: 1.0,
                contents: [
                    {
                        id: args.brokerName,
                        quantity: 1,
                    },
                ],
            }),
        ConsentLevel.Marketing,
    );
}

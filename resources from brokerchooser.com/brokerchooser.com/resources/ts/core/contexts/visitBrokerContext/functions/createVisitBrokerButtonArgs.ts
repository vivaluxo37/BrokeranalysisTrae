import { VisitBrokerButtonClickArgs } from '../../../blocks/visitBrokerButton/types/VisitBrokerButtonClickArgs';
import { BasicBrokerData } from '../../../types/commonTypes';

export function createVisitBrokerButtonArgs(args: {
    broker: BasicBrokerData;
    measurementListId: string;
    context?: string;
    positionIndex?: number;
}): VisitBrokerButtonClickArgs {
    const { broker, measurementListId, context, positionIndex } = args;
    return {
        brokerId: broker.id,
        brokerName: broker.name,
        brokerLink: broker.visitBrokerUrl,
        isReportedToAffiliatePartner: broker.isReportedToAffiliatePartner,
        measurementList: measurementListId,
        context,
        positionIndex,
    };
}

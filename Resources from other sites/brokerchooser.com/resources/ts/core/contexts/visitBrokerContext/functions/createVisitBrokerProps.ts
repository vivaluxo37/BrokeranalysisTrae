import { getAffiliateElementImpressionEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { getCloakedVisitBrokerUrlWithQueryParams } from '../../../blocks/visitBrokerButton/functions/getCloakedVisitBrokerUrlWithQueryParams';
import { onVisitBrokerButtonClick } from '../../../blocks/visitBrokerButton/functions/onVisitBrokerButtonClick';
import {
    CreateVisitBrokerPropsArgs,
    ElementProps,
} from '../types/visitBrokerContextTypes';
import { createVisitBrokerButtonArgs } from './createVisitBrokerButtonArgs';
import { reportIfCtaDataIsInvalid } from './reportIfCtaDataIsInvalid';

export function createVisitBrokerProps(
    args: CreateVisitBrokerPropsArgs,
): ElementProps {
    const { onClick, ...data } = args;
    reportIfCtaDataIsInvalid(data);

    function createOnClick(): ElementProps['onClick'] {
        const visitClickArgs = createVisitBrokerButtonArgs({
            broker: data.broker,
            measurementListId: data.measurementListId,
            context: data.measurementContext,
            positionIndex: data.positionIndex,
        });

        return (event) => {
            const result = onVisitBrokerButtonClick(event, visitClickArgs);
            onClick?.(data);
            return result;
        };
    }

    const ga4ImpressionEventData = getAffiliateElementImpressionEventData({
        elementId: data.broker.name,
        measurementListId: data.measurementListId,
        isReported: data.broker.isReportedToAffiliatePartner,
        positionIndex: data.positionIndex,
        context: data.measurementContext,
    });

    return {
        onClick: createOnClick(),
        href: getCloakedVisitBrokerUrlWithQueryParams({
            baseUrl: data.broker.visitBrokerUrl,
            measurementListId: data.measurementListId,
            measurementCategoryId: data.measurementCategoryId,
        }),
        rel: 'noreferrer nofollow',
        ga4ImpressionEventData,
    };
}

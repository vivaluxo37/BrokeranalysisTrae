import { getDomPath } from '../../../core/blocks/visitBrokerButton/functions/getDomPath';
import { setupHumanEyeVisibilityCheck } from '../../../logic/elem_on_screen/setupHumanEyeVisibilityCheck';
import { reportError } from '../../../logic/util/error/reportError';
import { getAffiliateElementImpressionEventData } from '../functions/eventCreatorFunctions';
import { sendGA4Event } from '../functions/sendGA4Event';

const sendImpressionEventFromCTA = (element: HTMLElement) => {
    const {
        brokerLabel,
        brokerName,
        isReportedToAffiliatePartner,
        measurementList,
    } = element.dataset;

    const elementId = brokerName || brokerLabel;

    if (typeof isReportedToAffiliatePartner === 'undefined') {
        reportError('No isReportedToAffiliatePartner value found on element', {
            domPath: getDomPath(element),
        });
    }

    if (elementId && measurementList) {
        const ga4ImpressionEventData = getAffiliateElementImpressionEventData({
            elementId,
            measurementListId: measurementList,
            isReported: isReportedToAffiliatePartner !== 'false', // if value is missing, assume we report it
        });

        sendGA4Event(ga4ImpressionEventData);
    } else {
        console.error('Missing broker data for impression event', element);
    }
};

export const setupCtaImpressionEventsOnSite = () => {
    const items = document.querySelectorAll<HTMLElement>(
        '[data-measurement-list]',
    );

    items.forEach((element) => {
        setupHumanEyeVisibilityCheck({
            element,
            onElementVisible: (visibleElement) => {
                // decide if it is CTA?
                sendImpressionEventFromCTA(visibleElement);
            },
            debug: false,
        });
    });
};
